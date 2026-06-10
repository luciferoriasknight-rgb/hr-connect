import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { db } from "@/lib/storage";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Mon profil — RH Suite" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const { t } = useI18n();
  const employee = user?.employeeId ? db.employees.all().find((e) => e.id === user.employeeId) : null;
  const dept = employee ? db.departments.all().find((d) => d.id === employee.departmentId) : null;

  return (
    <AppShell title={t.profile}>
      <PageHeader title={t.profile} subtitle="Vos informations personnelles." />
      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {user?.fullName?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1">{user && t.roles[user.role]}</Badge>
            </div>
          </div>
          {employee && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
              <Info label="Poste" value={employee.position} />
              <Info label="Département" value={dept?.name ?? "—"} />
              <Info label="Contrat" value={employee.contractType} />
              <Info label="Date d'embauche" value={new Date(employee.hireDate).toLocaleDateString()} />
              <Info label="Téléphone" value={employee.phone} />
              <Info label="Solde de congés" value={`${employee.leaveBalance} j`} />
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div><div className="mt-0.5 font-medium">{value}</div></div>;
}
