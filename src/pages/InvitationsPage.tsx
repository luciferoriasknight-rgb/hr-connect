import { useState } from "react";
import { Mail, Plus, RefreshCw, Copy, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { db, makeInviteCode, uid } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { Invitation, Role } from "@/lib/types";
import { toast } from "sonner";

function Page() {
  const { t } = useI18n();
  const { hasRole, company, activeCompanyId } = useAuth();
  if (!hasRole("admin", "super_admin")) {
    return <AppShell title={t.invitations}><PageHeader title="Accès refusé" /></AppShell>;
  }

  const [items, setItems] = useState<Invitation[]>(() => db.invitations.all());
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("employee");

  const refresh = () => setItems(db.invitations.all());

  const create = () => {
    if (!email) return toast.error("Email requis");
    const inv: Invitation = {
      id: uid(),
      email,
      role,
      status: "pending",
      invitedBy: "Admin",
      createdAt: new Date().toISOString(),
    };
    db.invitations.save([inv, ...db.invitations.all()]);
    refresh();
    setOpen(false);
    setEmail("");
    toast.success(`Invitation envoyée à ${email}`);
  };

  const cancel = (inv: Invitation) => {
    db.invitations.save(db.invitations.all().map((i) => i.id === inv.id ? { ...i, status: "cancelled" } : i));
    refresh();
  };

  const remove = (inv: Invitation) => {
    if (!confirm("Supprimer ?")) return;
    db.invitations.save(db.invitations.all().filter((i) => i.id !== inv.id));
    refresh();
  };

  const regenCode = () => {
    if (!company || !activeCompanyId) return toast.error("Sélectionnez une entreprise");
    const code = makeInviteCode();
    db.companies.save(db.companies.all().map((c) => c.id === activeCompanyId ? { ...c, inviteCode: code } : c));
    toast.success("Code régénéré");
    setTimeout(() => location.reload(), 400);
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copié"); };

  const pending = items.filter((i) => i.status === "pending");

  return (
    <AppShell title={t.invitations}>
      <PageHeader title={t.invitations} subtitle="Gérez les codes et invitations de votre entreprise." />

      {company && (
        <Card className="mb-4">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Code d'invitation — {company.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <code className="rounded bg-muted px-3 py-1.5 font-mono text-lg font-semibold">{company.inviteCode}</code>
                <Button size="sm" variant="ghost" onClick={() => copy(company.inviteCode)}><Copy className="h-4 w-4" /></Button>
              </div>
            </div>
            <Button variant="outline" onClick={regenCode}><RefreshCw className="mr-1.5 h-4 w-4" />Régénérer</Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{pending.length} invitation(s) en attente</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" />Inviter par email</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle invitation</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom.nom@entreprise.com" /></div>
              <div className="space-y-1.5">
                <Label>Rôle</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["admin", "hr", "manager", "employee"] as Role[]).map((r) => <SelectItem key={r} value={r}>{t.roles[r]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button>
              <Button onClick={create}><Mail className="mr-1.5 h-4 w-4" />Envoyer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr className="text-left">
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Rôle</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-medium">{inv.email}</td>
                  <td className="p-3"><Badge variant="outline">{t.roles[inv.role]}</Badge></td>
                  <td className="p-3">
                    <Badge variant={inv.status === "pending" ? "secondary" : inv.status === "accepted" ? "default" : "outline"}>
                      {inv.status === "pending" ? "En attente" : inv.status === "accepted" ? "Acceptée" : inv.status === "cancelled" ? "Annulée" : "Expirée"}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    {inv.status === "pending" && <Button size="sm" variant="ghost" onClick={() => cancel(inv)}>Annuler</Button>}
                    <Button size="sm" variant="ghost" onClick={() => remove(inv)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">Aucune invitation</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}

export default Page;
