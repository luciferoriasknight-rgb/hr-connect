import { useMemo, useState } from "react";
import {
  Building2, Users, CreditCard, TrendingUp, ArrowRight, Plus, Trash2,
  CheckCircle2, ShieldCheck,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { db, read, uid, makeInviteCode } from "@/lib/storage";
import type { Company, Payment, Role, User } from "@/lib/types";

const PLAN_PRICE: Record<Company["plan"], number> = { free: 0, pro: 49, enterprise: 199 };

function PlatformPage() {
  const { hasRole, user, switchCompany } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  if (!hasRole("super_admin")) {
    return (
      <AppShell title={t.platform}>
        <PageHeader title="403" subtitle="Réservé au super_admin." />
      </AppShell>
    );
  }

  const [tick, setTick] = useState(0);
  const refresh = () => setTick((x) => x + 1);

  const companies = useMemo(() => db.companies.all(), [tick]);
  const allUsers = useMemo(() => read<User[]>(db.KEYS.users, []), [tick]);
  const allPayments = useMemo(() => read<Payment[]>(db.KEYS.payments, []), [tick]);

  const totalRevenue = allPayments
    .filter((p) => p.status === "succeeded")
    .reduce((s, p) => s + p.amount, 0);
  const mrr = companies.reduce((s, c) => s + PLAN_PRICE[c.plan], 0);

  // Company create dialog
  const [openCo, setOpenCo] = useState(false);
  const [coForm, setCoForm] = useState<{ name: string; plan: Company["plan"]; industry: string; size: Company["size"]; country: string }>({
    name: "", plan: "pro", industry: "", size: "11-50", country: "France",
  });
  const createCompany = () => {
    if (!coForm.name) return toast.error("Nom requis");
    const c: Company = {
      id: uid(), name: coForm.name,
      slug: coForm.name.toLowerCase().replace(/\s+/g, "-"),
      inviteCode: makeInviteCode(), plan: coForm.plan,
      industry: coForm.industry, size: coForm.size, country: coForm.country,
      createdAt: new Date().toISOString(),
    };
    db.companies.save([c, ...companies]);
    setOpenCo(false);
    setCoForm({ name: "", plan: "pro", industry: "", size: "11-50", country: "France" });
    refresh();
    toast.success("Entreprise créée");
  };
  const removeCompany = (c: Company) => {
    if (!confirm(`Supprimer "${c.name}" et toutes ses données ?`)) return;
    db.companies.save(companies.filter((x) => x.id !== c.id));
    // wipe scoped data
    for (const key of [
      db.KEYS.users, db.KEYS.employees, db.KEYS.departments, db.KEYS.offers,
      db.KEYS.candidates, db.KEYS.interviews, db.KEYS.leaves, db.KEYS.attendance,
      db.KEYS.objectives, db.KEYS.evaluations, db.KEYS.trainings, db.KEYS.documents,
      db.KEYS.invitations, db.KEYS.notifications, db.KEYS.paymentMethods, db.KEYS.payments,
    ]) {
      const items = read<{ companyId?: string }[]>(key, []);
      localStorage.setItem(key, JSON.stringify(items.filter((x) => x.companyId !== c.id)));
    }
    refresh();
    toast.success("Entreprise supprimée");
  };
  const changePlan = (c: Company, plan: Company["plan"]) => {
    db.companies.save(companies.map((x) => (x.id === c.id ? { ...x, plan } : x)));
    refresh();
  };
  const enterCompany = (c: Company) => {
    switchCompany(c.id);
    navigate({ to: "/dashboard" });
  };

  // User role change cross-tenant
  const setUserRole = (u: User, role: Role) => {
    const list = read<User[]>(db.KEYS.users, []);
    localStorage.setItem(db.KEYS.users, JSON.stringify(list.map((x) => (x.id === u.id ? { ...x, role } : x))));
    refresh();
  };
  const removeUser = (u: User) => {
    if (u.id === user?.id) return toast.error("Vous ne pouvez pas vous supprimer.");
    if (!confirm("Supprimer cet utilisateur ?")) return;
    const list = read<User[]>(db.KEYS.users, []);
    localStorage.setItem(db.KEYS.users, JSON.stringify(list.filter((x) => x.id !== u.id)));
    refresh();
  };

  const usersByCompany = (cid?: string) => allUsers.filter((u) => u.companyId === cid).length;

  return (
    <AppShell title={t.platform}>
      <PageHeader
        title={t.platform}
        subtitle={t.platformSubtitle}
        actions={
          <Badge variant="outline" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> super_admin
          </Badge>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Building2} label={t.activeTenants} value={companies.length.toString()} />
        <StatCard icon={Users} label={t.totalUsers} value={allUsers.length.toString()} />
        <StatCard icon={TrendingUp} label={t.mrr} value={`${mrr.toLocaleString()} €`} accent />
        <StatCard icon={CreditCard} label={t.totalRevenue} value={`${totalRevenue.toLocaleString()} €`} />
      </div>

      <Tabs defaultValue="tenants">
        <TabsList>
          <TabsTrigger value="tenants">{t.tenants}</TabsTrigger>
          <TabsTrigger value="users">{t.platformUsers}</TabsTrigger>
          <TabsTrigger value="billing">{t.platformBilling}</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Dialog open={openCo} onOpenChange={setOpenCo}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-1.5 h-4 w-4" />Nouvelle entreprise</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nouvelle entreprise cliente</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="space-y-1.5"><Label>Nom</Label><Input value={coForm.name} onChange={(e) => setCoForm({ ...coForm, name: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Plan</Label>
                      <Select value={coForm.plan} onValueChange={(v) => setCoForm({ ...coForm, plan: v as Company["plan"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro (49 €)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (199 €)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label>Taille</Label>
                      <Select value={coForm.size} onValueChange={(v) => setCoForm({ ...coForm, size: v as Company["size"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["1-10", "11-50", "51-200", "201-1000", "1000+"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Secteur</Label><Input value={coForm.industry} onChange={(e) => setCoForm({ ...coForm, industry: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Pays</Label><Input value={coForm.country} onChange={(e) => setCoForm({ ...coForm, country: e.target.value })} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenCo(false)}>{t.cancel}</Button>
                  <Button onClick={createCompany}>{t.save}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Entreprise</th>
                    <th className="p-3 font-medium">Code</th>
                    <th className="p-3 font-medium">Plan</th>
                    <th className="p-3 font-medium">Utilisateurs</th>
                    <th className="p-3 font-medium">Créée</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="p-3">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.industry ?? "—"} · {c.country ?? "—"} · {c.size ?? "—"}</div>
                      </td>
                      <td className="p-3"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.inviteCode}</code></td>
                      <td className="p-3">
                        <Select value={c.plan} onValueChange={(v) => changePlan(c, v as Company["plan"])}>
                          <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-muted-foreground">{usersByCompany(c.id)}</td>
                      <td className="p-3 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => enterCompany(c)} title={t.impersonate}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeCompany(c)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {companies.length === 0 && (
                    <tr><td colSpan={6} className="p-10 text-center text-sm text-muted-foreground">Aucune entreprise.</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Nom</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Entreprise</th>
                    <th className="p-3 font-medium">Rôle</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => {
                    const co = u.companyId ? companies.find((c) => c.id === u.companyId) : null;
                    return (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="p-3 font-medium">{u.fullName}</td>
                        <td className="p-3 text-muted-foreground">{u.email}</td>
                        <td className="p-3">
                          {co ? <Badge variant="outline">{co.name}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                        <td className="p-3">
                          <Select value={u.role} onValueChange={(v) => setUserRole(u, v as Role)}>
                            <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {(["super_admin", "admin", "hr", "manager", "employee", "candidate"] as Role[]).map((r) => (
                                <SelectItem key={r} value={r}>{t.roles[r]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3 text-right">
                          <Button size="sm" variant="ghost" onClick={() => removeUser(u)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {(["free", "pro", "enterprise"] as Company["plan"][]).map((p) => {
              const count = companies.filter((c) => c.plan === p).length;
              return (
                <Card key={p}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase text-muted-foreground">{p}</div>
                        <div className="mt-1 text-2xl font-semibold">{count}</div>
                        <div className="text-xs text-muted-foreground">entreprises</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{PLAN_PRICE[p]} €</div>
                        <div className="text-xs text-muted-foreground">/ mois</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      MRR: {(count * PLAN_PRICE[p]).toLocaleString()} €
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Facture</th>
                    <th className="p-3 font-medium">Entreprise</th>
                    <th className="p-3 font-medium">Montant</th>
                    <th className="p-3 font-medium">Méthode</th>
                    <th className="p-3 font-medium">Statut</th>
                    <th className="p-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.slice(0, 50).map((p) => {
                    const co = companies.find((c) => c.id === p.companyId);
                    return (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="p-3 font-mono text-xs">{p.invoiceNumber}</td>
                        <td className="p-3">{co?.name ?? "—"}</td>
                        <td className="p-3 font-medium">{p.amount} {p.currency}</td>
                        <td className="p-3 text-xs uppercase text-muted-foreground">{p.method}</td>
                        <td className="p-3">
                          <Badge variant={p.status === "succeeded" ? "default" : p.status === "pending" ? "outline" : "destructive"}>
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                  {allPayments.length === 0 && (
                    <tr><td colSpan={6} className="p-10 text-center text-sm text-muted-foreground">Aucune transaction.</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Building2; label: string; value: string; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PlatformPage;
