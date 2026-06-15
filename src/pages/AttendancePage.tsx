import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, LogOut, Clock, Users, CheckCircle2, AlertTriangle, XCircle, Home } from "lucide-react";
import { db, uid, notify, read } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { Attendance, User } from "@/lib/types";
import { toast } from "sonner";

function AttendancePage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const employees = db.employees.all();
  const departments = db.departments.all();
  const [records, setRecords] = useState<Attendance[]>(() => db.attendance.all());
  const [tab, setTab] = useState("today");

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter((r) => r.date === today);

  const me = user?.employeeId ? employees.find((e) => e.id === user.employeeId) : undefined;
  const myToday = me ? todayRecords.find((r) => r.employeeId === me.id) : undefined;

  const refresh = () => setRecords(db.attendance.all());

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
    targets.forEach((uid) =>
      notify({ companyId: me.companyId, userId: uid, title: "Pointage", message: msg, type, link: "/attendance" }),
    );
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
    refresh();
    toast.success(`Arrivée enregistrée à ${time}`);
    notifyManagers(`${me.firstName} ${me.lastName} a pointé son arrivée à ${time}${status === "late" ? " (retard)" : ""}.`, "success");
  };

  const checkOut = () => {
    if (!me || !myToday) return;
    const time = new Date().toTimeString().slice(0, 5);
    const all = db.attendance.all();
    db.attendance.save(all.map((r) => (r.id === myToday.id ? { ...r, checkOut: time } : r)));
    refresh();
    toast.success(`Départ enregistré à ${time}`);
    notifyManagers(`${me.firstName} ${me.lastName} a pointé son départ à ${time}.`, "info");
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
    refresh();
    toast.success("Télétravail signalé");
    notifyManagers(`${me.firstName} ${me.lastName} est en télétravail aujourd'hui.`, "info");
  };

  const monthly = useMemo(() => {
    const map = new Map<string, { name: string; present: number; late: number; remote: number; absent: number }>();
    employees.forEach((e) => map.set(e.id, { name: `${e.firstName} ${e.lastName}`, present: 0, late: 0, remote: 0, absent: 0 }));
    records.forEach((r) => {
      const m = map.get(r.employeeId);
      if (!m) return;
      if (r.status === "present") m.present++;
      else if (r.status === "late") m.late++;
      else if (r.status === "remote") m.remote++;
      else m.absent++;
    });
    return Array.from(map.values());
  }, [employees, records]);

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

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <KpiCard icon={CheckCircle2} label="Présents" value={summary.present} tint="text-emerald-500 bg-emerald-500/10" />
        <KpiCard icon={AlertTriangle} label="Retards" value={summary.late} tint="text-amber-500 bg-amber-500/10" />
        <KpiCard icon={Home} label="Télétravail" value={summary.remote} tint="text-sky-500 bg-sky-500/10" />
        <KpiCard icon={XCircle} label="Absents" value={summary.absent} tint="text-rose-500 bg-rose-500/10" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="today"><Users className="mr-1.5 h-4 w-4" />Tableau du jour</TabsTrigger>
          <TabsTrigger value="monthly">Mensuel</TabsTrigger>
        </TabsList>

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
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
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
