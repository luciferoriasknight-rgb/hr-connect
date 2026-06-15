import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, FileDown, Pencil, Eye } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { db, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import type { Employee } from "@/lib/types";
import { toast } from "sonner";
import { exportToExcel } from "@/lib/export";

const EMPTY: Omit<Employee, "id"> = {
  firstName: "", lastName: "", email: "", phone: "", position: "",
  departmentId: "", hireDate: new Date().toISOString().slice(0, 10),
  contractType: "CDI", salary: 0, status: "active", leaveBalance: 25,
};

function EmployeesPage() {
  const { t } = useI18n();
  const [employees, setEmployees] = useState<Employee[]>(() => db.employees.all());
  const departments = db.departments.all();
  const [search, setSearch] = useState("");
  const [dep, setDep] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<Omit<Employee, "id">>(EMPTY);

  const refresh = () => setEmployees(db.employees.all());

  const filtered = useMemo(() => employees.filter((e) => {
    if (dep !== "all" && e.departmentId !== dep) return false;
    if (search && !`${e.firstName} ${e.lastName} ${e.email} ${e.position}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [employees, search, dep]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (e: Employee) => { setEditing(e); setForm(e); setOpen(true); };

  const save = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.departmentId) {
      toast.error("Champs obligatoires manquants"); return;
    }
    if (editing) {
      db.employees.save(db.employees.all().map((x) => x.id === editing.id ? { ...editing, ...form } : x));
    } else {
      db.employees.save([{ ...form, id: uid() }, ...db.employees.all()]);
    }
    refresh();
    setOpen(false);
    toast.success("Enregistré");
  };

  const exportExcel = () => {
    exportToExcel("employes", "Employés", filtered.map((e) => ({
      Prénom: e.firstName, Nom: e.lastName, Email: e.email, Téléphone: e.phone,
      Poste: e.position, Département: departments.find((d) => d.id === e.departmentId)?.name,
      Contrat: e.contractType, Salaire: e.salary, "Date d'embauche": e.hireDate, Statut: e.status,
    })));
  };

  return (
    <AppShell title={t.employees}>
      <PageHeader
        title={t.employees}
        subtitle="Annuaire et dossiers RH."
        actions={
          <>
            <Button variant="outline" onClick={exportExcel}><FileDown className="h-4 w-4 mr-1.5" />{t.exportExcel}</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />{t.create}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>{editing ? t.edit : t.create} — Employé</DialogTitle></DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Prénom</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Nom</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Téléphone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Poste</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
                  <div className="space-y-1.5">
                    <Label>Département</Label>
                    <Select value={form.departmentId} onValueChange={(v) => setForm({ ...form, departmentId: v })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contrat</Label>
                    <Select value={form.contractType} onValueChange={(v) => setForm({ ...form, contractType: v as Employee["contractType"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["CDI", "CDD", "Stage", "Freelance", "Alternance"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Salaire annuel</Label><Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} /></div>
                  <div className="space-y-1.5"><Label>Date d'embauche</Label><Input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Solde de congés</Label><Input type="number" value={form.leaveBalance} onChange={(e) => setForm({ ...form, leaveBalance: Number(e.target.value) })} /></div>
                  <div className="space-y-1.5">
                    <Label>Manager</Label>
                    <Select value={form.managerId ?? ""} onValueChange={(v) => setForm({ ...form, managerId: v || undefined })}>
                      <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                      <SelectContent>{employees.filter((e) => e.id !== editing?.id).map((e) => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Statut</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Employee["status"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button>
                  <Button onClick={save}>{t.save}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={dep} onValueChange={setDep}>
            <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous départements</SelectItem>
              {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr className="text-left">
                <th className="p-3 font-medium">Employé</th>
                <th className="p-3 font-medium">Poste</th>
                <th className="p-3 font-medium">Département</th>
                <th className="p-3 font-medium">Contrat</th>
                <th className="p-3 font-medium">Embauche</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {e.firstName[0]}{e.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium">{e.firstName} {e.lastName}</div>
                        <div className="text-xs text-muted-foreground">{e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{e.position}</td>
                  <td className="p-3 text-muted-foreground">{departments.find((d) => d.id === e.departmentId)?.name ?? "—"}</td>
                  <td className="p-3"><Badge variant="secondary">{e.contractType}</Badge></td>
                  <td className="p-3 text-muted-foreground">{new Date(e.hireDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Badge variant={e.status === "active" ? "default" : "outline"}>{e.status}</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(e)} title={t.edit} aria-label={t.edit}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" asChild title="Voir" aria-label="Voir">
                      <Link to="/employees/$id" params={{ id: e.id }}><Eye className="h-4 w-4" /></Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-10 text-center text-sm text-muted-foreground">{t.nothing}</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}

export default EmployeesPage;
