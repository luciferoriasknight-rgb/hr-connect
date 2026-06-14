import { useState } from "react";
import { Plus, FileText, Download, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import type { DocumentItem } from "@/lib/types";
import { toast } from "sonner";

const CATS: DocumentItem["category"][] = ["contract", "amendment", "diploma", "certificate", "attestation", "id", "other"];
const CAT_LABEL: Record<DocumentItem["category"], string> = {
  contract: "Contrat", amendment: "Avenant", diploma: "Diplôme",
  certificate: "Certificat", attestation: "Attestation", id: "Pièce d'identité", other: "Autre",
};

function Page() {
  const { t } = useI18n();
  const employees = db.employees.all();
  const [docs, setDocs] = useState<DocumentItem[]>(() => db.documents.all());
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; category: DocumentItem["category"]; employeeId: string; fileData?: string }>({
    name: "", category: "contract", employeeId: "",
  });

  const refresh = () => setDocs(db.documents.all());

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, fileData: reader.result as string, name: s.name || f.name }));
    reader.readAsDataURL(f);
  };

  const create = () => {
    if (!form.name) { toast.error("Nom requis"); return; }
    const d: DocumentItem = {
      id: uid(), name: form.name, category: form.category,
      employeeId: form.employeeId || undefined, fileData: form.fileData,
      date: new Date().toISOString(),
    };
    db.documents.save([d, ...db.documents.all()]);
    refresh();
    setOpen(false);
    setForm({ name: "", category: "contract", employeeId: "" });
    toast.success("Document ajouté");
  };

  const remove = (d: DocumentItem) => {
    if (!confirm("Supprimer ?")) return;
    db.documents.save(db.documents.all().filter((x) => x.id !== d.id));
    refresh();
  };

  const filtered = filter === "all" ? docs : docs.filter((d) => d.category === filter);

  return (
    <AppShell title={t.documents}>
      <PageHeader title={t.documents} subtitle="Gestion documentaire RH." actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1.5" />{t.add}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau document</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1.5"><Label>Nom</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Catégorie</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as DocumentItem["category"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{CAT_LABEL[c]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Employé</Label>
                <Select value={form.employeeId} onValueChange={(v) => setForm({ ...form, employeeId: v })}>
                  <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                  <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Fichier</Label><Input type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} /></div>
            </div>
            <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button><Button onClick={create}>{t.save}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      } />

      <div className="mb-4 flex flex-wrap gap-1.5">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>Tous</Button>
        {CATS.map((c) => <Button key={c} size="sm" variant={filter === c ? "default" : "outline"} onClick={() => setFilter(c)}>{CAT_LABEL[c]}</Button>)}
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">{t.nothing}</div>}
          <div className="divide-y">
            {filtered.map((d) => {
              const emp = employees.find((e) => e.id === d.employeeId);
              return (
                <div key={d.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"><FileText className="h-5 w-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{CAT_LABEL[d.category]} · {emp ? `${emp.firstName} ${emp.lastName}` : "—"} · {new Date(d.date).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="outline">{CAT_LABEL[d.category]}</Badge>
                  {d.fileData && <a href={d.fileData} download={d.name}><Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button></a>}
                  <Button size="sm" variant="ghost" onClick={() => remove(d)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

export default Page;
