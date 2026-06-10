import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, GraduationCap } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import type { Training } from "@/lib/types";

export const Route = createFileRoute("/_app/trainings")({
  head: () => ({ meta: [{ title: "Formations — RH Suite" }] }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const [items, setItems] = useState<Training[]>(() => db.trainings.all());
  const employees = db.employees.all();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Training, "id" | "enrolled">>({ title: "", type: "internal", description: "", duration: "" });

  const create = () => {
    if (!form.title) return;
    db.trainings.save([{ ...form, id: uid(), enrolled: [] }, ...db.trainings.all()]);
    setItems(db.trainings.all());
    setOpen(false);
  };

  const toggleEnroll = (tr: Training, eid: string) => {
    const enrolled = tr.enrolled.includes(eid) ? tr.enrolled.filter((x) => x !== eid) : [...tr.enrolled, eid];
    db.trainings.save(db.trainings.all().map((x) => x.id === tr.id ? { ...x, enrolled } : x));
    setItems(db.trainings.all());
  };

  return (
    <AppShell title={t.trainings}>
      <PageHeader title={t.trainings} subtitle="Catalogue et inscriptions." actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1.5" />{t.create}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle formation</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1.5"><Label>Titre</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Training["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="internal">Interne</SelectItem><SelectItem value="external">Externe</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Durée</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button><Button onClick={create}>{t.save}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      } />

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((tr) => (
          <Card key={tr.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><GraduationCap className="h-5 w-5" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{tr.title}</h3>
                  <p className="text-xs text-muted-foreground">{tr.duration} • <Badge variant="outline" className="ml-1">{tr.type === "internal" ? "Interne" : "Externe"}</Badge></p>
                  <p className="mt-2 text-sm text-muted-foreground">{tr.description}</p>
                </div>
              </div>
              <div className="mt-4 border-t pt-3">
                <div className="text-xs font-medium mb-2">Inscrits ({tr.enrolled.length})</div>
                <div className="flex flex-wrap gap-1">
                  {employees.map((e) => (
                    <button key={e.id} onClick={() => toggleEnroll(tr, e.id)} type="button"
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${tr.enrolled.includes(e.id) ? "bg-primary text-primary-foreground border-primary" : "bg-card"}`}>
                      {e.firstName} {e.lastName[0]}.
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
