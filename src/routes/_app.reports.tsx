import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { db } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { exportToExcel, exportToPDF } from "@/lib/export";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Rapports — RH Suite" }] }),
  component: Page,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Page() {
  const { t } = useI18n();
  const employees = db.employees.all();
  const offers = db.offers.all();
  const candidates = db.candidates.all();
  const departments = db.departments.all();
  const leaves = db.leaves.all();

  const stats = useMemo(() => {
    const hired = candidates.filter((c) => c.stage === "hired").length;
    const hireRate = candidates.length ? (hired / candidates.length) * 100 : 0;
    const avgSenority = employees.length
      ? employees.reduce((s, e) => s + (Date.now() - new Date(e.hireDate).getTime()) / (365 * 86400_000), 0) / employees.length
      : 0;
    const absenceRate = leaves.length ? (leaves.filter((l) => l.type === "sick").length / leaves.length) * 100 : 0;
    return [
      { label: "Offres", value: offers.length },
      { label: "Candidatures", value: candidates.length },
      { label: "Taux d'embauche", value: hireRate.toFixed(1) + " %" },
      { label: "Effectif", value: employees.length },
      { label: "Ancienneté moy.", value: avgSenority.toFixed(1) + " ans" },
      { label: "Taux d'absence", value: absenceRate.toFixed(1) + " %" },
    ];
  }, [offers, candidates, employees, leaves]);

  const byDep = departments.map((d) => ({ name: d.name, value: employees.filter((e) => e.departmentId === d.id).length }));
  const byStage = ["received", "analysis", "shortlisted", "hr_interview", "hired", "rejected"].map((s) => ({
    name: s, value: candidates.filter((c) => c.stage === s).length,
  }));

  const exportEmployees = () => {
    exportToPDF("Rapport Employés",
      ["Nom", "Email", "Poste", "Département", "Contrat", "Salaire"],
      employees.map((e) => [`${e.firstName} ${e.lastName}`, e.email, e.position, departments.find((d) => d.id === e.departmentId)?.name ?? "—", e.contractType, e.salary]),
    );
  };

  const exportRecruitment = () => {
    exportToExcel("rapport_recrutement", "Candidats", candidates.map((c) => ({
      Nom: `${c.firstName} ${c.lastName}`, Email: c.email, Offre: offers.find((o) => o.id === c.jobOfferId)?.title ?? "", Étape: c.stage, Note: c.rating ?? "",
    })));
  };

  return (
    <AppShell title={t.reports}>
      <PageHeader title={t.reports} subtitle="Indicateurs RH et exports." actions={
        <>
          <Button variant="outline" onClick={exportEmployees}><FileDown className="h-4 w-4 mr-1.5" />PDF Employés</Button>
          <Button variant="outline" onClick={exportRecruitment}><FileSpreadsheet className="h-4 w-4 mr-1.5" />Excel Recrutement</Button>
        </>
      } />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6 mb-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs uppercase text-muted-foreground">{s.label}</div>
              <div className="mt-2 text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-3">Effectif par département</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byDep}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-3">Pipeline de candidatures</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byStage} dataKey="value" nameKey="name" outerRadius={90}>
                  {byStage.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
