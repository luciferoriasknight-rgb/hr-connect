import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";

function OrgPage() {
  const { t } = useI18n();
  const employees = db.employees.all();
  const departments = db.departments.all();

  return (
    <AppShell title={t.org}>
      <PageHeader title={t.org} subtitle="Structure et hiérarchie." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((d) => {
          const members = employees.filter((e) => e.departmentId === d.id);
          const managers = members.filter((e) => e.position.toLowerCase().includes("director") || e.position.toLowerCase().includes("directeur") || e.position.toLowerCase().includes("lead") || e.position.toLowerCase().includes("cto"));
          const others = members.filter((e) => !managers.includes(e));
          return (
            <Card key={d.id}>
              <CardContent className="p-5">
                <h3 className="text-base font-semibold">{d.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{members.length} membre(s)</p>

                {managers.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {managers.map((m) => (
                      <Node key={m.id} firstName={m.firstName} lastName={m.lastName} position={m.position} highlight />
                    ))}
                  </div>
                )}
                <div className="space-y-1.5 border-l-2 border-primary/30 pl-3">
                  {others.map((e) => (
                    <Node key={e.id} firstName={e.firstName} lastName={e.lastName} position={e.position} />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}

function Node({ firstName, lastName, position, highlight }: { firstName: string; lastName: string; position: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-md p-2 ${highlight ? "bg-primary/10" : ""}`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${highlight ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
        {firstName[0]}{lastName[0]}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{firstName} {lastName}</div>
        <div className="truncate text-xs text-muted-foreground">{position}</div>
      </div>
    </div>
  );
}

export default OrgPage;
