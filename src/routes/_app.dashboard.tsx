import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Briefcase, Users, UserSearch, CalendarDays, ClipboardCheck, TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useI18n } from "@/lib/i18n";
import { db } from "@/lib/storage";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — RH Suite" }] }),
  component: Dashboard,
});

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Dashboard() {
  const { t } = useI18n();

  const data = useMemo(() => {
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
      {
        label: t.monthlyHires,
        value: employees.filter((e) => new Date(e.hireDate) >= startMonth).length,
        icon: TrendingUp, color: "var(--chart-2)",
      },
    ];

    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: d.toISOString().slice(0, 7),
        label: d.toLocaleDateString("fr-FR", { month: "short" }),
      };
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

    const att = db.attendance.all();
    const presence = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const day = att.filter((a) => a.date === key);
      return {
        day: d.toLocaleDateString("fr-FR", { weekday: "short" }),
        Présents: day.filter((a) => a.status === "present").length,
        Télétravail: day.filter((a) => a.status === "remote").length,
        Retards: day.filter((a) => a.status === "late").length,
      };
    });

    return { stats, recruitmentSeries, deptDistribution, presence };
  }, [t]);

  return (
    <AppShell title={t.dashboard}>
      <PageHeader title={t.dashboard} subtitle="Vue d'ensemble de votre activité RH." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {data.stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in oklab, ${s.color} 18%, transparent)`, color: s.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">{t.recruitment}</h3>
              <p className="text-xs text-muted-foreground">Évolution sur 6 mois</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.recruitmentSeries}>
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
            <div className="mb-4">
              <h3 className="text-sm font-semibold">{t.distribution} par {t.department.toLowerCase()}</h3>
              <p className="text-xs text-muted-foreground">Effectif par département</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.deptDistribution} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                  {data.deptDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">{t.presence}</h3>
              <p className="text-xs text-muted-foreground">7 derniers jours</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.presence}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="Présents" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Télétravail" stackId="a" fill="var(--chart-1)" />
                <Bar dataKey="Retards" stackId="a" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
