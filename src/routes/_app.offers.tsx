import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Copy, Archive, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { db, uid } from "@/lib/storage";
import type { JobOffer } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/offers")({
  head: () => ({ meta: [{ title: "Offres d'emploi — RH Suite" }] }),
  component: OffersPage,
});

const EMPTY: Omit<JobOffer, "id" | "createdAt"> = {
  title: "", departmentId: "", contractType: "CDI", experienceLevel: "intermediate",
  description: "", skills: [], location: "", status: "draft",
};

function OffersPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [offers, setOffers] = useState<JobOffer[]>(() => db.offers.all());
  const departments = db.departments.all();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JobOffer | null>(null);
  const [form, setForm] = useState({ ...EMPTY, skillsInput: "" });

  const refresh = () => setOffers(db.offers.all());

  const filtered = offers.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (contractFilter !== "all" && o.contractType !== contractFilter) return false;
    if (search && !`${o.title} ${o.location} ${o.skills.join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, skillsInput: "" });
    setOpen(true);
  };
  const openEdit = (o: JobOffer) => {
    setEditing(o);
    setForm({ ...o, skillsInput: o.skills.join(", ") });
    setOpen(true);
  };

  const save = () => {
    if (!form.title || !form.departmentId) { toast.error("Titre et département requis"); return; }
    const skills = form.skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    const list = db.offers.all();
    if (editing) {
      const updated: JobOffer = { ...editing, ...form, skills, salaryMin: form.salaryMin || undefined, salaryMax: form.salaryMax || undefined };
      db.offers.save(list.map((x) => x.id === editing.id ? updated : x));
      db.audit.log({ userId: user!.id, userName: user!.fullName, action: "update", entity: `offer:${editing.id}` });
      toast.success("Offre modifiée");
    } else {
      const newOffer: JobOffer = { ...form, skills, id: uid(), createdAt: new Date().toISOString() };
      db.offers.save([newOffer, ...list]);
      db.audit.log({ userId: user!.id, userName: user!.fullName, action: "create", entity: `offer:${newOffer.id}` });
      toast.success("Offre créée");
    }
    refresh();
    setOpen(false);
  };

  const togglePublish = (o: JobOffer) => {
    const next: JobOffer = { ...o, status: o.status === "published" ? "draft" : "published" };
    db.offers.save(db.offers.all().map((x) => x.id === o.id ? next : x));
    refresh();
  };
  const archive = (o: JobOffer) => {
    db.offers.save(db.offers.all().map((x) => x.id === o.id ? { ...x, status: "archived" } : x));
    refresh();
  };
  const duplicate = (o: JobOffer) => {
    const copy: JobOffer = { ...o, id: uid(), title: o.title + " (copie)", status: "draft", createdAt: new Date().toISOString() };
    db.offers.save([copy, ...db.offers.all()]);
    refresh();
    toast.success("Offre dupliquée");
  };
  const remove = (o: JobOffer) => {
    if (!confirm("Supprimer cette offre ?")) return;
    db.offers.save(db.offers.all().filter((x) => x.id !== o.id));
    refresh();
  };

  return (
    <AppShell title={t.offers}>
      <PageHeader
        title={t.offers}
        subtitle="Gérez vos annonces de recrutement."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />{t.create}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{editing ? t.edit : t.create} — {t.offers}</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>{t.title}</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.department}</Label>
                  <Select value={form.departmentId} onValueChange={(v) => setForm({ ...form, departmentId: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.location}</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.contract}</Label>
                  <Select value={form.contractType} onValueChange={(v) => setForm({ ...form, contractType: v as JobOffer["contractType"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["CDI", "CDD", "Stage", "Freelance", "Alternance"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.experience}</Label>
                  <Select value={form.experienceLevel} onValueChange={(v) => setForm({ ...form, experienceLevel: v as JobOffer["experienceLevel"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.salary} min</Label>
                  <Input type="number" value={form.salaryMin ?? ""} onChange={(e) => setForm({ ...form, salaryMin: Number(e.target.value) || undefined })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.salary} max</Label>
                  <Input type="number" value={form.salaryMax ?? ""} onChange={(e) => setForm({ ...form, salaryMax: Number(e.target.value) || undefined })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.deadline}</Label>
                  <Input type="date" value={form.deadline ?? ""} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.status}</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as JobOffer["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>{t.skills} (séparées par virgule)</Label>
                  <Input value={form.skillsInput} onChange={(e) => setForm({ ...form, skillsInput: e.target.value })} placeholder="React, Node.js, ..." />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>{t.description}</Label>
                  <Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button>
                <Button onClick={save}>{t.save}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
          <Select value={contractFilter} onValueChange={setContractFilter}>
            <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous contrats</SelectItem>
              {["CDI", "CDD", "Stage", "Freelance", "Alternance"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((o) => {
          const dep = departments.find((d) => d.id === o.departmentId)?.name ?? "—";
          return (
            <Card key={o.id} className="group transition hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">{o.title}</h3>
                    <p className="text-xs text-muted-foreground">{dep} • {o.location || "—"}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{o.contractType}</Badge>
                  <Badge variant="outline">{o.experienceLevel}</Badge>
                  {o.salaryMin && o.salaryMax && (
                    <Badge variant="outline">{o.salaryMin.toLocaleString()} – {o.salaryMax.toLocaleString()} €</Badge>
                  )}
                </div>
                {o.description && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{o.description}</p>}
                <div className="mt-3 flex flex-wrap gap-1">
                  {o.skills.slice(0, 4).map((s) => <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>)}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t pt-3">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(o)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => duplicate(o)}><Copy className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => togglePublish(o)}>
                    {o.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => archive(o)}><Archive className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(o)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">{t.nothing}</div>
        )}
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: JobOffer["status"] }) {
  const map = {
    published: { label: "Publié", className: "bg-success/15 text-success border-success/30" },
    draft: { label: "Brouillon", className: "bg-muted text-muted-foreground" },
    archived: { label: "Archivé", className: "bg-warning/15 text-warning border-warning/30" },
  };
  const s = map[status];
  return <Badge variant="outline" className={s.className}>{s.label}</Badge>;
}
