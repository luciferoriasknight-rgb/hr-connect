import { useState } from "react";
import { Plus } from "lucide-react";
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
import type { Objective } from "@/lib/types";

function Page() {
  const { t } = useI18n();
  const [objectives, setObjectives] = useState<Objective[]>(() => db.objectives.all());
  const evaluations = db.evaluations.all();
  const employees = db.employees.all();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: "", title: "", description: "", dueDate: "", progress: 0 });

  const create = () => {
    if (!form.employeeId || !form.title) return;
    const ob: Objective = { id: uid(), ...form, status: "in_progress" };
    db.objectives.save([ob, ...db.objectives.all()]);
    setObjectives(db.objectives.all());
    setOpen(false);
    setForm({ employeeId: "", title: "", description: "", dueDate: "", progress: 0 });
  };

  const updateProgress = (id: string, progress: number) => {
    db.objectives.save(db.objectives.all().map((o) => o.id === id ? { ...o, progress, status: progress >= 100 ? "done" : o.status } : o));
    setObjectives(db.objectives.all());
  };

  return (
    <AppShell title={t.performance}>
      <PageHeader
        title={t.performance}
        subtitle="Objectifs et évaluations."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1.5" />Objectif</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvel objectif</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div className="space-y-1.5"><Label>Employé</Label>
                  <Select value={form.employeeId} onValueChange={(v) => setForm({ ...form, employeeId: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Titre</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Échéance</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
              </div>
              <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button><Button onClick={create}>{t.save}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-4">Objectifs en cours</h3>
            <div className="space-y-4">
              {objectives.map((o) => {
                const emp = employees.find((e) => e.id === o.employeeId);
                return (
                  <div key={o.id} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">{o.title}</div>
                        <div className="text-xs text-muted-foreground">{emp?.firstName} {emp?.lastName} • {o.dueDate ? new Date(o.dueDate).toLocaleDateString() : ""}</div>
                      </div>
                      <Badge variant={o.status === "done" ? "default" : "secondary"}>{o.progress}%</Badge>
                    </div>
                    <input type="range" min={0} max={100} value={o.progress} onChange={(e) => updateProgress(o.id, Number(e.target.value))} className="w-full" />
                  </div>
                );
              })}
              {objectives.length === 0 && <div className="text-sm text-muted-foreground">Aucun objectif.</div>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-4">Évaluations</h3>
            <div className="space-y-2">
              {evaluations.map((ev) => {
                const emp = employees.find((e) => e.id === ev.employeeId);
                const avg = ((ev.selfScore ?? 0) + (ev.managerScore ?? 0) + (ev.hrScore ?? 0)) / 3;
                return (
                  <div key={ev.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <div>
                      <div className="font-medium">{emp?.firstName} {emp?.lastName}</div>
                      <div className="text-xs text-muted-foreground">{ev.period}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{avg.toFixed(1)}/5</div>
                      <div className="text-xs text-muted-foreground">Auto {ev.selfScore} · Mgr {ev.managerScore} · RH {ev.hrScore}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

export default Page;
