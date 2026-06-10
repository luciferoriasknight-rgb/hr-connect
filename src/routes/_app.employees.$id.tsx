import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft, Briefcase, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/storage";

export const Route = createFileRoute("/_app/employees/$id")({
  head: () => ({ meta: [{ title: "Fiche employé — RH Suite" }] }),
  component: EmployeeDetail,
});

function EmployeeDetail() {
  const { id } = useParams({ from: "/_app/employees/$id" });
  const employee = useMemo(() => db.employees.all().find((e) => e.id === id), [id]);
  const department = db.departments.all().find((d) => d.id === employee?.departmentId);
  const manager = db.employees.all().find((e) => e.id === employee?.managerId);
  const leaves = db.leaves.all().filter((l) => l.employeeId === id);
  const objectives = db.objectives.all().filter((o) => o.employeeId === id);
  const evaluations = db.evaluations.all().filter((ev) => ev.employeeId === id);

  if (!employee) {
    return (
      <AppShell title="Employé">
        <PageHeader title="Employé introuvable" />
        <Button asChild variant="outline"><Link to="/employees"><ArrowLeft className="h-4 w-4 mr-1.5" />Retour</Link></Button>
      </AppShell>
    );
  }

  return (
    <AppShell title="Fiche employé">
      <Button asChild variant="ghost" className="mb-4"><Link to="/employees"><ArrowLeft className="h-4 w-4 mr-1.5" />Retour</Link></Button>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
              <h2 className="mt-4 text-xl font-semibold">{employee.firstName} {employee.lastName}</h2>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
              <Badge className="mt-3" variant="secondary">{employee.contractType}</Badge>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground"><Mail className="h-4 w-4" />{employee.email}</div>
              <div className="flex items-center gap-3 text-muted-foreground"><Phone className="h-4 w-4" />{employee.phone}</div>
              {employee.address && <div className="flex items-center gap-3 text-muted-foreground"><MapPin className="h-4 w-4" />{employee.address}</div>}
              <div className="flex items-center gap-3 text-muted-foreground"><Briefcase className="h-4 w-4" />{department?.name ?? "—"}</div>
              <div className="flex items-center gap-3 text-muted-foreground"><Calendar className="h-4 w-4" />Embauché le {new Date(employee.hireDate).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
              <Stat label="Salaire" value={`${employee.salary.toLocaleString()} €`} />
              <Stat label="Solde congés" value={`${employee.leaveBalance} j`} />
              <Stat label="Manager" value={manager ? `${manager.firstName} ${manager.lastName}` : "—"} />
              <Stat label="Statut" value={employee.status} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-3">Objectifs</h3>
              {objectives.length === 0 && <p className="text-sm text-muted-foreground">Aucun objectif.</p>}
              <div className="space-y-3">
                {objectives.map((o) => (
                  <div key={o.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{o.title}</span>
                      <span className="text-muted-foreground">{o.progress}%</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${o.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-3">Évaluations</h3>
              {evaluations.length === 0 && <p className="text-sm text-muted-foreground">Aucune évaluation.</p>}
              <div className="space-y-2">
                {evaluations.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <div>
                      <div className="font-medium">{ev.period}</div>
                      <div className="text-xs text-muted-foreground">{new Date(ev.date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span>Auto: <b>{ev.selfScore ?? "—"}</b></span>
                      <span>Manager: <b>{ev.managerScore ?? "—"}</b></span>
                      <span>RH: <b>{ev.hrScore ?? "—"}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-3">Historique des congés</h3>
              {leaves.length === 0 && <p className="text-sm text-muted-foreground">Aucune demande.</p>}
              <div className="space-y-2">
                {leaves.map((l) => (
                  <div key={l.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <div>
                      <div className="font-medium capitalize">{l.type}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="outline">{l.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-base font-semibold">{value}</div>
    </div>
  );
}
