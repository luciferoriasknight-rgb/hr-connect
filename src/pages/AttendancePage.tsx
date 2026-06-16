import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, LogOut, Clock, Users, CheckCircle2, AlertTriangle, XCircle, Home, History, Lock } from "lucide-react";
import { db, uid, notify, read } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { Attendance, AuditLog, User } from "@/lib/types";
import { toast } from "sonner";

function AttendancePage() {
  const { t } = useI18n();
  const { user, hasRole } = useAuth();
  const employees = db.employees.all();
  const departments = db.departments.all();
  const [records, setRecords] = useState<Attendance[]>(() => db.attendance.all());
  const [audit, setAudit] = useState<AuditLog[]>(() => db.audit.all());
  const [tab, setTab] = useState("today");

  // Visibility rule: only employees with role 'employee' have restricted view.
  // Manager / HR / admin / super_admin keep the full team view.
  const restricted = user?.role === "employee";

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter((r) => r.date === today);

  const me = user?.employeeId ? employees.find((e) => e.id === user.employeeId) : undefined;
  const myToday = me ? todayRecords.find((r) => r.employeeId === me.id) : undefined;
  const myRecords = me ? records.filter((r) => r.employeeId === me.id) : [];
  const myAudit = audit.filter((a) => me && a.entity === `attendance:${me.id}`);

  const refresh = () => {
    setRecords(db.attendance.all());
    setAudit(db.audit.all());
  };

  const notifyManagers = (msg: string, type: "info" | "success" = "info") => {
    if (!me) return;
    const usersAll = read<User[]>(db.KEYS.users, []);
    const targets = new Set<string>();
    if (me.managerId) {
      const mgrUser = usersAll.find((u) => u.employeeId === me.managerId);
      if (mgrUser) targets.add(mgrUser.id);
    }
    usersAll
      .filter((u) => u.companyId === me.companyId && (u.role === "admin" || u.role === "hr"))
      .forEach((u) => targets.add(u.id));
    const targetNames = usersAll.filter((u) => targets.has(u.id)).map((u) => u.fullName).join(", ");
    targets.forEach((uid) =>
      notify({ companyId: me.companyId, userId: uid, title: "Pointage", message: msg, type, link: "/attendance" }),
    );
    return targetNames;
  };

  const logAction = (action: string, msg: string) => {
    if (!me || !user) return;
    const sent = notifyManagers(msg, action === "check_in" ? "success" : "info") ?? "";
    db.audit.log({
      companyId: me.companyId,
      userId: user.id,
      userName: user.fullName,
      action: `${action}${sent ? ` — notifié: ${sent}` : ""}`,
      entity: `attendance:${me.id}`,
    });
  };

  const checkIn = () => {
    if (!me) return;
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const status: Attendance["status"] = now.getHours() >= 9 && now.getMinutes() > 15 ? "late" : "present";
    const all = db.attendance.all();
    const existing = all.find((r) => r.employeeId === me.id && r.date === today);
    if (existing) {
      db.attendance.save(all.map((r) => (r.id === existing.id ? { ...r, checkIn: time, status } : r)));
    } else {
      db.attendance.save([{ id: uid(), companyId: me.companyId, employeeId: me.id, date: today, checkIn: time, status }, ...all]);
    }
    logAction("check_in", `${me.firstName} ${me.lastName} a pointé son arrivée à ${time}${status === "late" ? " (retard)" : ""}.`);
    refresh();
    toast.success(`Arrivée enregistrée à ${time}`);
  };

  const checkOut = () => {
    if (!me || !myToday) return;
    const time = new Date().toTimeString().slice(0, 5);
    const all = db.attendance.all();
    db.attendance.save(all.map((r) => (r.id === myToday.id ? { ...r, checkOut: time } : r)));
    logAction("check_out", `${me.firstName} ${me.lastName} a pointé son départ à ${time}.`);
    refresh();
    toast.success(`Départ enregistré à ${time}`);
  };

  const remote = () => {
    if (!me) return;
    const all = db.attendance.all();
    const existing = all.find((r) => r.employeeId === me.id && r.date === today);
    if (existing) {
      db.attendance.save(all.map((r) => (r.id === existing.id ? { ...r, status: "remote" } : r)));
    } else {
      db.attendance.save([{ id: uid(), companyId: me.companyId, employeeId: me.id, date: today, status: "remote" }, ...all]);
    }
    logAction("remote", `${me.firstName} ${me.lastName} est en télétravail aujourd'hui.`);
    refresh();
    toast.success("Télétravail signalé");
  };

  const monthly = useMemo(() => {
    const list = restricted ? (me ? [me] : []) : employees;
    const map = new Map<string, { name: string; present: number; late: number; remote: number; absent: number }>();
    list.forEach((e) => map.set(e.id, { name: `${e.firstName} ${e.lastName}`, present: 0, late: 0, remote: 0, absent: 0 }));
    records.forEach((r) => {
      const m = map.get(r.employeeId);
      if (!m) return;
      if (r.status === "present") m.present++;
      else if (r.status === "late") m.late++;
      else if (r.status === "remote") m.remote++;
      else m.absent++;
    });
    return Array.from(map.values());
  }, [employees, records, restricted, me]);

  const summary = useMemo(() => {
    const counts = { present: 0, late: 0, remote: 0, absent: 0 };
    employees.forEach((e) => {
      const r = todayRecords.find((x) => x.employeeId === e.id);
      const s = r?.status ?? "absent";
      counts[s as keyof typeof counts]++;
    });
    return counts;
  }, [employees, todayRecords]);

  return (
    <AppShell title={t.attendance}>
      <PageHeader title={t.attendance} subtitle="Pointage, présences en direct et historique." />

      {me && (
        <Card className="mb-4 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Mon pointage du jour</div>
                <div className="mt-0.5 text-lg font-semibold">{me.firstName} {me.lastName}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Arrivée : <b className="text-foreground">{myToday?.checkIn ?? "—"}</b></span>
                  <span>Départ : <b className="text-foreground">{myToday?.checkOut ?? "—"}</b></span>
                  {myToday && <StatusBadge status={myToday.status} />}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={checkIn} disabled={!!myToday?.checkIn} className="gap-1.5">
                <LogIn className="h-4 w-4" />Pointer l'arrivée
              </Button>
              <Button onClick={checkOut} disabled={!myToday?.checkIn || !!myToday?.checkOut} variant="secondary" className="gap-1.5">
                <LogOut className="h-4 w-4" />Pointer le départ
              </Button>
              <Button onClick={remote} variant="outline" className="gap-1.5">
                <Home className="h-4 w-4" />Télétravail
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!restricted && (
        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <KpiCard icon={CheckCircle2} label="Présents" value={summary.present} tint="text-emerald-500 bg-emerald-500/10" />
          <KpiCard icon={AlertTriangle} label="Retards" value={summary.late} tint="text-amber-500 bg-amber-500/10" />
          <KpiCard icon={Home} label="Télétravail" value={summary.remote} tint="text-sky-500 bg-sky-500/10" />
          <KpiCard icon={XCircle} label="Absents" value={summary.absent} tint="text-rose-500 bg-rose-500/10" />
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {!restricted && <TabsTrigger value="today"><Users className="mr-1.5 h-4 w-4" />Tableau du jour</TabsTrigger>}
          <TabsTrigger value="monthly">{restricted ? "Mon mensuel" : "Mensuel"}</TabsTrigger>
          {restricted && <TabsTrigger value="my-history">Mon historique</TabsTrigger>}
          {(hasRole("admin", "hr", "manager", "super_admin")) && (
            <TabsTrigger value="audit"><History className="mr-1.5 h-4 w-4" />Journal d'audit</TabsTrigger>
          )}
        </TabsList>

        {!restricted && (
          <TabsContent value="today" className="mt-4">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left">
                      <th className="p-3 font-medium">Employé</th>
                      <th className="p-3 font-medium">Département</th>
                      <th className="p-3 font-medium">Arrivée</th>
                      <th className="p-3 font-medium">Départ</th>
                      <th className="p-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((e) => {
                      const r = todayRecords.find((x) => x.employeeId === e.id);
                      const status = r?.status ?? "absent";
                      return (
                        <tr key={e.id} className={`border-b last:border-0 ${e.id === me?.id ? "bg-primary/5" : ""}`}>
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
                                {e.firstName[0]}{e.lastName[0]}
                              </div>
                              <div>
                                <div className="font-medium">{e.firstName} {e.lastName}</div>
                                <div className="text-[11px] text-muted-foreground">{e.position}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground">{departments.find((d) => d.id === e.departmentId)?.name ?? "—"}</td>
                          <td className="p-3 font-mono text-xs">{r?.checkIn ?? "—"}</td>
                          <td className="p-3 font-mono text-xs">{r?.checkOut ?? "—"}</td>
                          <td className="p-3"><StatusBadge status={status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Employé</th>
                    <th className="p-3 font-medium">Présent</th>
                    <th className="p-3 font-medium">Retard</th>
                    <th className="p-3 font-medium">Télétravail</th>
                    <th className="p-3 font-medium">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.map((m) => (
                    <tr key={m.name} className="border-b last:border-0">
                      <td className="p-3 font-medium">{m.name}</td>
                      <td className="p-3 text-emerald-500">{m.present}</td>
                      <td className="p-3 text-amber-500">{m.late}</td>
                      <td className="p-3 text-sky-500">{m.remote}</td>
                      <td className="p-3 text-rose-500">{m.absent}</td>
                    </tr>
                  ))}
                  {monthly.length === 0 && (
                    <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Aucune donnée.</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {restricted && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" />Vous ne voyez que vos propres présences.</p>
          )}
        </TabsContent>

        {restricted && (
          <TabsContent value="my-history" className="mt-4">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left">
                      <th className="p-3 font-medium">Date</th>
                      <th className="p-3 font-medium">Arrivée</th>
                      <th className="p-3 font-medium">Départ</th>
                      <th className="p-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRecords.sort((a, b) => b.date.localeCompare(a.date)).map((r) => (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="p-3 font-mono text-xs">{r.date}</td>
                        <td className="p-3 font-mono text-xs">{r.checkIn ?? "—"}</td>
                        <td className="p-3 font-mono text-xs">{r.checkOut ?? "—"}</td>
                        <td className="p-3"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                    {myRecords.length === 0 && (
                      <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Aucun pointage.</td></tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            {myAudit.length > 0 && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="mb-2 text-sm font-semibold flex items-center gap-1.5"><History className="h-4 w-4" />Mes actions récentes</div>
                  <ul className="space-y-1.5 text-xs">
                    {myAudit.slice(0, 20).map((a) => (
                      <li key={a.id} className="flex justify-between gap-3 border-b py-1.5 last:border-0">
                        <span className="text-muted-foreground">{new Date(a.date).toLocaleString()}</span>
                        <span className="flex-1">{a.action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {(hasRole("admin", "hr", "manager", "super_admin")) && (
          <TabsContent value="audit" className="mt-4">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left">
                      <th className="p-3 font-medium">Date</th>
                      <th className="p-3 font-medium">Auteur</th>
                      <th className="p-3 font-medium">Employé</th>
                      <th className="p-3 font-medium">Action / Notifications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.filter((a) => a.entity.startsWith("attendance:")).map((a) => {
                      const eid = a.entity.split(":")[1];
                      const emp = employees.find((x) => x.id === eid);
                      return (
                        <tr key={a.id} className="border-b last:border-0">
                          <td className="p-3 font-mono text-xs text-muted-foreground">{new Date(a.date).toLocaleString()}</td>
                          <td className="p-3">{a.userName}</td>
                          <td className="p-3">{emp ? `${emp.firstName} ${emp.lastName}` : eid}</td>
                          <td className="p-3 text-xs">{a.action}</td>
                        </tr>
                      );
                    })}
                    {audit.filter((a) => a.entity.startsWith("attendance:")).length === 0 && (
                      <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Aucun événement enregistré.</td></tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    present: { label: "Présent", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    late: { label: "En retard", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    remote: { label: "Télétravail", cls: "bg-sky-500/15 text-sky-600 border-sky-500/30" },
    absent: { label: "Absent", cls: "bg-rose-500/15 text-rose-600 border-rose-500/30" },
  };
  const s = map[status] ?? map.absent;
  return <Badge variant="outline" className={s.cls}>{s.label}</Badge>;
}

function KpiCard({ icon: Icon, label, value, tint }: { icon: typeof Users; label: string; value: number; tint: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-2xl font-bold leading-none">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AttendancePage;
