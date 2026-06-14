import { useState } from "react";
import { Plus, Trash2, Download, Upload, RotateCcw } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, exportAll, importAll, resetAll, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { Role, User } from "@/lib/types";
import { toast } from "sonner";

function Page() {
  const { t } = useI18n();
  const { hasRole } = useAuth();
  if (!hasRole("admin")) {
    return <AppShell title={t.admin}><PageHeader title="Accès refusé" /></AppShell>;
  }

  const [users, setUsers] = useState<User[]>(() => db.users.all());
  const [audit] = useState(() => db.audit.all());
  const [settings, setSettings] = useState(() => db.settings.get());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ email: string; password: string; fullName: string; role: Role }>({
    email: "", password: "", fullName: "", role: "employee",
  });

  const refresh = () => setUsers(db.users.all());

  const createUser = () => {
    if (!form.email || !form.password || !form.fullName) { toast.error("Tous les champs requis"); return; }
    if (db.users.all().find((u) => u.email === form.email)) { toast.error("Email existe"); return; }
    db.users.save([{ id: uid(), ...form, createdAt: new Date().toISOString() }, ...db.users.all()]);
    refresh();
    setOpen(false);
    setForm({ email: "", password: "", fullName: "", role: "employee" });
    toast.success("Utilisateur créé");
  };

  const removeUser = (u: User) => {
    if (!confirm("Supprimer ?")) return;
    db.users.save(db.users.all().filter((x) => x.id !== u.id));
    refresh();
  };

  const setRole = (u: User, role: Role) => {
    db.users.save(db.users.all().map((x) => x.id === u.id ? { ...x, role } : x));
    refresh();
  };

  const onExport = () => {
    const blob = new Blob([exportAll()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "rh-backup.json"; a.click();
  };
  const onImport = (f: File) => {
    const r = new FileReader();
    r.onload = () => { try { importAll(r.result as string); toast.success("Import réussi"); location.reload(); } catch { toast.error("Fichier invalide"); } };
    r.readAsText(f);
  };
  const onReset = () => { if (confirm("Réinitialiser toutes les données ?")) { resetAll(); location.reload(); } };

  const saveSettings = () => { db.settings.save(settings); toast.success("Paramètres enregistrés"); };

  return (
    <AppShell title={t.admin}>
      <PageHeader title={t.admin} subtitle="Utilisateurs, paramètres, journal." />

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">{t.users}</TabsTrigger>
          <TabsTrigger value="company">{t.company}</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="audit">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1.5" />{t.create}</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nouvel utilisateur</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="space-y-1.5"><Label>Nom complet</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Mot de passe</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Rôle</Label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(["admin", "hr", "manager", "employee", "candidate"] as Role[]).map((r) => (
                          <SelectItem key={r} value={r}>{t.roles[r]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button><Button onClick={createUser}>{t.save}</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50"><tr className="text-left">
                  <th className="p-3 font-medium">Nom</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Rôle</th>
                  <th className="p-3"></th>
                </tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="p-3 font-medium">{u.fullName}</td>
                      <td className="p-3 text-muted-foreground">{u.email}</td>
                      <td className="p-3">
                        <Select value={u.role} onValueChange={(v) => setRole(u, v as Role)}>
                          <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {(["admin", "hr", "manager", "employee", "candidate"] as Role[]).map((r) => (
                              <SelectItem key={r} value={r}>{t.roles[r]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-right"><Button size="sm" variant="ghost" onClick={() => removeUser(u)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="mt-4">
          <Card><CardContent className="p-5 grid gap-3 max-w-xl">
            <div className="space-y-1.5"><Label>Nom de l'entreprise</Label><Input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Adresse</Label><Input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></div>
            <Button onClick={saveSettings} className="w-fit">{t.save}</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="data" className="mt-4">
          <Card><CardContent className="p-5 flex flex-wrap gap-2">
            <Button variant="outline" onClick={onExport}><Download className="h-4 w-4 mr-1.5" />{t.exportJson}</Button>
            <label className="inline-flex">
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
              <span><Button variant="outline" asChild><span><Upload className="h-4 w-4 mr-1.5" />{t.importJson}</span></Button></span>
            </label>
            <Button variant="destructive" onClick={onReset}><RotateCcw className="h-4 w-4 mr-1.5" />{t.resetData}</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {audit.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">Aucune action.</div>}
                {audit.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 text-sm">
                    <div><span className="font-medium">{a.userName}</span> <Badge variant="outline" className="ml-2">{a.action}</Badge> <span className="text-muted-foreground ml-2">{a.entity}</span></div>
                    <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

export default Page;
