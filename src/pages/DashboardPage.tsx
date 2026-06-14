import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Briefcase, Users, UserSearch, CalendarDays, ClipboardCheck, TrendingUp,
  Target, GraduationCap, Building2, ArrowRight, Sparkles, Clock, CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/storage";

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function StatCard({ label, value, icon: Icon, color, hint }: { label: string; value: number | string; icon: typeof Users; color: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`, color }}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { t } = useI18n();
  const { user, company } = useAuth();
  const role = user?.role ?? "employee";

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  }, []);

  return (
    <AppShell title={t.dashboard}>
      <div className="mb-6 rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary">{t.roles[role]}</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              {greeting}, {user?.fullName?.split(" ")[0]} 👋
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {company ? `${company.name} • ${company.plan.toUpperCase()}` : "Vue plateforme"}
            </p>
          </div>
          {company && (
            <div className="flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <div className="text-xs">
                <div className="text-muted-foreground">Code d'invitation</div>
                <div className="font-mono text-sm font-semibold">{company.inviteCode}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {role === "super_admin" && <SuperAdminBoard />}
      {role === "admin" && <AdminBoard />}
      {role === "hr" && <HrBoard />}
      {role === "manager" && <ManagerBoard />}
      {role === "employee" && <EmployeeBoard />}
    </AppShell>
  );
}

/* --------- SUPER ADMIN: cross-company view --------- */
function SuperAdminBoard() {
  const companies = db.companies.all();
  const users = db.users.all();
  const employees = db.employees.all();
  const offers = db.offers.all();

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Entreprises" value={companies.length} icon={Building2} color="var(--chart-1)" />
        <StatCard label="Utilisateurs" value={users.length} icon={Users} color="var(--chart-2)" />
        <StatCard label="Employés totaux" value={employees.length} icon={Users} color="var(--chart-5)" />
        <StatCard label="Offres totales" value={offers.length} icon={Briefcase} color="var(--chart-3)" />
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Entreprises de la plateforme</h3>
          <div className="space-y-2">
            {companies.map((c) => {
              const empCount = employees.filter((e) => e.companyId === c.id).length;
              const userCount = users.filter((u) => u.companyId === c.id).length;
              return (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.industry} • {c.size} • {c.country}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div><span className="font-semibold">{empCount}</span> employés</div>
                    <div><span className="font-semibold">{userCount}</span> users</div>
                    <Badge variant="outline" className="uppercase">{c.plan}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/* --------- ADMIN: full org overview --------- */
function AdminBoard() {
  const { t } = useI18n();
  const employees = db.employees.all();
  const candidates = db.candidates.all();
  const offers = db.offers.all();
  const interviews = db.interviews.all();
  const leaves = db.leaves.all();
  const departments = db.departments.all();
  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = [
    { label: t.employeesCount, value: employees.length, icon: Users, color: "var(--chart-1)" },
    { label: t.candidatesCount, value: candidates.length, icon: UserSearch, color: "var(--chart-2)" },
    { label: t.activeOffers, value: offers.filter((o) => o.status === "published").length, icon: Briefcase, color: "var(--chart-5)" },
    { label: t.scheduledInterviews, value: interviews.filter((i) => i.status === "scheduled").length, icon: ClipboardCheck, color: "var(--chart-3)" },
    { label: t.pendingLeaves, value: leaves.filter((l) => l.status === "pending" || l.status === "manager_approved").length, icon: CalendarDays, color: "var(--chart-4)" },
    { label: t.monthlyHires, value: employees.filter((e) => new Date(e.hireDate) >= startMonth).length, icon: TrendingUp, color: "var(--chart-2)" },
  ];

  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: d.toISOString().slice(0, 7), label: d.toLocaleDateString("fr-FR", { month: "short" }) };
  });
  const recruitmentSeries = months.map((m) => ({
    month: m.label,
    Embauches: employees.filter((e) => e.hireDate.slice(0, 7) === m.key).length,
    Candidatures: candidates.filter((c) => c.createdAt.slice(0, 7) === m.key).length,
  }));
  const deptDistribution = departments.map((d) => ({
    name: d.name,
    value: employees.filter((e) => e.departmentId === d.id).length,
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold">{t.recruitment}</h3>
            <p className="mb-3 text-xs text-muted-foreground">Évolution sur 6 mois</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={recruitmentSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="Candidatures" stroke="var(--chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="Embauches" stroke="var(--chart-2)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold">Répartition par département</h3>
            <p className="mb-3 text-xs text-muted-foreground">Effectif</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={deptDistribution} dataKey="value" nameKey="name" outerRadius={85} innerRadius={45}>
                  {deptDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

/* --------- HR: pipeline & people focus --------- */
function HrBoard() {
  const candidates = db.candidates.all();
  const offers = db.offers.all();
  const interviews = db.interviews.all();
  const leaves = db.leaves.all();
  const employees = db.employees.all();

  const stages = ["received", "analysis", "shortlisted", "technical_test", "hr_interview", "manager_interview", "final_validation"] as const;
  const pipeline = stages.map((s) => ({ stage: s, n: candidates.filter((c) => c.stage === s).length }));
  const totalInPipeline = pipeline.reduce((a, b) => a + b.n, 0);
  const upcoming = interviews
    .filter((i) => i.status === "scheduled")
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 5);
  const pendingLeaves = leaves.filter((l) => l.status === "pending");

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Candidats actifs" value={totalInPipeline} icon={UserSearch} color="var(--chart-1)" hint="dans le pipeline" />
        <StatCard label="Offres publiées" value={offers.filter((o) => o.status === "published").length} icon={Briefcase} color="var(--chart-5)" />
        <StatCard label="Entretiens" value={upcoming.length} icon={ClipboardCheck} color="var(--chart-3)" hint="à venir" />
        <StatCard label="Congés à valider" value={pendingLeaves.length} icon={CalendarDays} color="var(--chart-4)" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Pipeline de recrutement</h3>
              <Link to="/candidates"><Button variant="ghost" size="sm" className="gap-1">Voir <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
            </div>
            <div className="space-y-3">
              {pipeline.map((p) => (
                <div key={p.stage}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="capitalize">{p.stage.replace("_", " ")}</span>
                    <span className="font-semibold">{p.n}</span>
                  </div>
                  <Progress value={totalInPipeline ? (p.n / totalInPipeline) * 100 : 0} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Prochains entretiens</h3>
              <Link to="/interviews"><Button variant="ghost" size="sm" className="gap-1"><ArrowRight className="h-3.5 w-3.5" /></Button></Link>
            </div>
            <div className="space-y-2">
              {upcoming.length === 0 && <p className="text-xs text-muted-foreground">Aucun entretien à venir.</p>}
              {upcoming.map((iv) => {
                const c = candidates.find((x) => x.id === iv.candidateId);
                return (
                  <div key={iv.id} className="flex items-center justify-between rounded-md border p-2 text-xs">
                    <div>
                      <div className="font-medium">{c ? `${c.firstName} ${c.lastName}` : "—"}</div>
                      <div className="text-muted-foreground capitalize">{iv.type}</div>
                    </div>
                    <div className="text-right">
                      <div>{new Date(iv.date).toLocaleDateString("fr-FR")}</div>
                      <div className="text-muted-foreground">{new Date(iv.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Demandes de congés en attente</h3>
          {pendingLeaves.length === 0 && <p className="text-xs text-muted-foreground">Tout est à jour ✨</p>}
          <div className="space-y-2">
            {pendingLeaves.slice(0, 5).map((l) => {
              const e = employees.find((x) => x.id === l.employeeId);
              return (
                <div key={l.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <div>
                      <div className="font-medium">{e ? `${e.firstName} ${e.lastName}` : "—"}</div>
                      <div className="text-xs text-muted-foreground capitalize">{l.type}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(l.startDate).toLocaleDateString("fr-FR")} → {new Date(l.endDate).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/* --------- MANAGER: team focus --------- */
function ManagerBoard() {
  const { user } = useAuth();
  const me = db.employees.all().find((e) => e.id === user?.employeeId);
  const team = db.employees.all().filter((e) => e.managerId === me?.id);
  const teamIds = team.map((e) => e.id);
  const leaves = db.leaves.all().filter((l) => teamIds.includes(l.employeeId));
  const pending = leaves.filter((l) => l.status === "pending");
  const objectives = db.objectives.all().filter((o) => teamIds.includes(o.employeeId));
  const interviews = db.interviews.all().filter((i) => i.status === "scheduled" && i.interviewers.includes(me?.id ?? ""));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Mon équipe" value={team.length} icon={Users} color="var(--chart-1)" />
        <StatCard label="Congés à valider" value={pending.length} icon={CalendarDays} color="var(--chart-4)" />
        <StatCard label="Objectifs en cours" value={objectives.filter((o) => o.status === "in_progress").length} icon={Target} color="var(--chart-2)" />
        <StatCard label="Mes entretiens" value={interviews.length} icon={ClipboardCheck} color="var(--chart-3)" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Mon équipe</h3>
            {team.length === 0 && <p className="text-xs text-muted-foreground">Aucun rattachement direct.</p>}
            <div className="space-y-2">
              {team.map((e) => (
                <Link to="/employees/$id" params={{ id: e.id }} key={e.id} className="flex items-center justify-between rounded-md border p-2 text-sm hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {e.firstName[0]}{e.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium">{e.firstName} {e.lastName}</div>
                      <div className="text-xs text-muted-foreground">{e.position}</div>
                    </div>
                  </div>
                  <Badge variant="outline">{e.contractType}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Objectifs de l'équipe</h3>
            <div className="space-y-3">
              {objectives.map((o) => {
                const e = team.find((x) => x.id === o.employeeId);
                return (
                  <div key={o.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span><span className="font-medium">{e?.firstName}</span> — {o.title}</span>
                      <span className="font-semibold">{o.progress}%</span>
                    </div>
                    <Progress value={o.progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

/* --------- EMPLOYEE: self-service --------- */
function EmployeeBoard() {
  const { user } = useAuth();
  const me = db.employees.all().find((e) => e.id === user?.employeeId);
  const myLeaves = db.leaves.all().filter((l) => l.employeeId === me?.id);
  const myObjectives = db.objectives.all().filter((o) => o.employeeId === me?.id);
  const myTrainings = db.trainings.all().filter((tr) => me && tr.enrolled.includes(me.id));
  const attendance = db.attendance.all().filter((a) => a.employeeId === me?.id).slice(0, 7);
  const presence = attendance.map((a) => ({ day: new Date(a.date).toLocaleDateString("fr-FR", { weekday: "short" }), value: a.status === "present" || a.status === "remote" ? 1 : 0 }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Solde de congés" value={me?.leaveBalance ?? 0} icon={CalendarDays} color="var(--chart-1)" hint="jours restants" />
        <StatCard label="Demandes en cours" value={myLeaves.filter((l) => l.status === "pending" || l.status === "manager_approved").length} icon={Clock} color="var(--chart-4)" />
        <StatCard label="Objectifs" value={myObjectives.length} icon={Target} color="var(--chart-2)" />
        <StatCard label="Formations" value={myTrainings.length} icon={GraduationCap} color="var(--chart-3)" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Mes objectifs</h3>
            {myObjectives.length === 0 && <p className="text-xs text-muted-foreground">Aucun objectif assigné.</p>}
            <div className="space-y-3">
              {myObjectives.map((o) => (
                <div key={o.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{o.title}</span>
                    <span>{o.progress}%</span>
                  </div>
                  <Progress value={o.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Actions rapides</h3>
            <div className="space-y-2">
              <Link to="/leaves"><Button variant="outline" className="w-full justify-between">Demander un congé <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/attendance"><Button variant="outline" className="w-full justify-between">Pointer ma présence <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/trainings"><Button variant="outline" className="w-full justify-between">S'inscrire à une formation <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/profile"><Button variant="outline" className="w-full justify-between">Mon profil <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Ma présence — derniers jours</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={presence}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 1]} hide />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Présent / télétravail comptabilisé.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;
