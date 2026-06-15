import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Crown, Mail, Network } from "lucide-react";
import { db } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import type { Employee } from "@/lib/types";

const PALETTES = [
  { from: "from-violet-500/15", ring: "ring-violet-500/40", chip: "bg-violet-500/15 text-violet-500" },
  { from: "from-sky-500/15", ring: "ring-sky-500/40", chip: "bg-sky-500/15 text-sky-500" },
  { from: "from-emerald-500/15", ring: "ring-emerald-500/40", chip: "bg-emerald-500/15 text-emerald-500" },
  { from: "from-amber-500/15", ring: "ring-amber-500/40", chip: "bg-amber-500/15 text-amber-500" },
  { from: "from-rose-500/15", ring: "ring-rose-500/40", chip: "bg-rose-500/15 text-rose-500" },
  { from: "from-cyan-500/15", ring: "ring-cyan-500/40", chip: "bg-cyan-500/15 text-cyan-500" },
];

function OrgPage() {
  const { t } = useI18n();
  const employees = db.employees.all();
  const departments = db.departments.all();
  const total = employees.length;
  const managersTotal = employees.filter((e) => isManager(e)).length;

  return (
    <AppShell title={t.org}>
      <PageHeader title={t.org} subtitle="Structure et hiérarchie de l'entreprise." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <KpiCard icon={Building2} label="Départements" value={departments.length} tint="text-primary bg-primary/10" />
        <KpiCard icon={Users} label="Collaborateurs" value={total} tint="text-emerald-500 bg-emerald-500/10" />
        <KpiCard icon={Crown} label="Managers" value={managersTotal} tint="text-amber-500 bg-amber-500/10" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((d, i) => {
          const palette = PALETTES[i % PALETTES.length];
          const members = employees.filter((e) => e.departmentId === d.id);
          const managers = members.filter(isManager);
          const others = members.filter((e) => !managers.includes(e));
          const head = managers[0];

          return (
            <Card key={d.id} className={`group relative overflow-hidden border bg-gradient-to-br ${palette.from} to-transparent transition-shadow hover:shadow-xl`}>
              <div className="absolute right-0 top-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-foreground/[0.04] blur-2xl" />
              <CardContent className="relative p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${palette.chip}`}>
                      <Network className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold tracking-tight">{d.name}</h3>
                      <p className="text-xs text-muted-foreground">{members.length} membre{members.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">{String(i + 1).padStart(2, "0")}</Badge>
                </div>

                {head ? (
                  <div className={`mb-4 rounded-xl border bg-background/60 p-3 ring-1 ${palette.ring}`}>
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Crown className="h-3 w-3" /> Responsable
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar firstName={head.firstName} lastName={head.lastName} large palette={palette} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{head.firstName} {head.lastName}</div>
                        <div className="truncate text-xs text-muted-foreground">{head.position}</div>
                        <a href={`mailto:${head.email}`} className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
                          <Mail className="h-3 w-3" /> {head.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl border border-dashed p-3 text-center text-xs text-muted-foreground">
                    Aucun responsable désigné
                  </div>
                )}

                {others.length > 0 && (
                  <div>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Équipe</div>
                    <div className="relative space-y-1.5 border-l-2 border-dashed border-border/70 pl-4">
                      {others.map((e) => (
                        <div key={e.id} className="relative flex items-center gap-2.5 rounded-md p-1.5 transition-colors hover:bg-background/60">
                          <span className={`absolute -left-[19px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${palette.chip}`} />
                          <Avatar firstName={e.firstName} lastName={e.lastName} palette={palette} />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{e.firstName} {e.lastName}</div>
                            <div className="truncate text-[11px] text-muted-foreground">{e.position}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}

function isManager(e: Employee) {
  const p = e.position.toLowerCase();
  return p.includes("director") || p.includes("directeur") || p.includes("directrice") || p.includes("lead") || p.includes("cto") || p.includes("ceo") || p.includes("responsable") || p.includes("head");
}

function Avatar({ firstName, lastName, palette, large }: { firstName: string; lastName: string; palette: typeof PALETTES[number]; large?: boolean }) {
  const size = large ? "h-11 w-11 text-sm" : "h-8 w-8 text-[11px]";
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full ${palette.chip} font-semibold ring-2 ring-background`}>
      {firstName[0]}{lastName[0]}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, tint }: { icon: typeof Users; label: string; value: number; tint: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrgPage;
