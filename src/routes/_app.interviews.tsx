import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, CalendarCheck, CheckCircle2, XCircle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { db, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import type { Interview } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/interviews")({
  head: () => ({ meta: [{ title: "Entretiens — RH Suite" }] }),
  component: InterviewsPage,
});

function InterviewsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Interview[]>(() => db.interviews.all());
  const candidates = db.candidates.all();
  const employees = db.employees.all();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    candidateId: "", type: "hr" as Interview["type"], date: "", location: "Visioconférence", interviewers: [] as string[],
  });

  const refresh = () => setItems(db.interviews.all());

  const create = () => {
    if (!form.candidateId || !form.date) { toast.error("Candidat et date requis"); return; }
    const iv: Interview = {
      id: uid(), candidateId: form.candidateId, type: form.type,
      date: new Date(form.date).toISOString(), location: form.location,
      interviewers: form.interviewers, status: "scheduled", decision: "pending",
    };
    db.interviews.save([iv, ...db.interviews.all()]);
    setOpen(false);
    refresh();
    toast.success("Entretien programmé");
  };

  const setStatus = (i: Interview, status: Interview["status"], decision?: Interview["decision"]) => {
    db.interviews.save(db.interviews.all().map((x) => x.id === i.id ? { ...x, status, decision } : x));
    refresh();
  };

  const setScore = (i: Interview, score: number) => {
    db.interviews.save(db.interviews.all().map((x) => x.id === i.id ? { ...x, score } : x));
    refresh();
  };

  const upcoming = items.filter((i) => i.status === "scheduled");
  const past = items.filter((i) => i.status !== "scheduled");

  return (
    <AppShell title={t.interviews}>
      <PageHeader
        title={t.interviews}
        subtitle="Planifiez et évaluez les entretiens."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1.5" />Planifier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvel entretien</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div className="space-y-1.5">
                  <Label>Candidat</Label>
                  <Select value={form.candidateId} onValueChange={(v) => setForm({ ...form, candidateId: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{candidates.map((c) => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Interview["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["hr", "technical", "manager", "final"] as const).map((x) => (
                        <SelectItem key={x} value={x}>{t.interviewTypes[x]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Date & heure</Label>
                  <Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Lieu</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button>
                <Button onClick={create}>{t.save}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">À venir</h3>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {upcoming.map((i) => (
          <InterviewCard key={i.id} iv={i} candidates={candidates} employees={employees} setStatus={setStatus} setScore={setScore} />
        ))}
        {upcoming.length === 0 && <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Aucun entretien planifié.</div>}
      </div>

      <h3 className="mt-8 mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Historique</h3>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {past.map((i) => (
          <InterviewCard key={i.id} iv={i} candidates={candidates} employees={employees} setStatus={setStatus} setScore={setScore} />
        ))}
      </div>
    </AppShell>
  );
}

function InterviewCard({
  iv, candidates, employees, setStatus, setScore,
}: {
  iv: Interview;
  candidates: ReturnType<typeof db.candidates.all>;
  employees: ReturnType<typeof db.employees.all>;
  setStatus: (i: Interview, status: Interview["status"], decision?: Interview["decision"]) => void;
  setScore: (i: Interview, score: number) => void;
}) {
  const { t } = useI18n();
  const cand = candidates.find((c) => c.id === iv.candidateId);
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{cand ? `${cand.firstName} ${cand.lastName}` : "—"}</h4>
            <p className="text-xs text-muted-foreground">{t.interviewTypes[iv.type]} • {iv.location}</p>
          </div>
          <Badge variant={iv.status === "scheduled" ? "secondary" : iv.decision === "pass" ? "default" : "destructive"}>
            {iv.status === "scheduled" ? "Programmé" : iv.decision === "pass" ? "Validé" : iv.decision === "fail" ? "Refusé" : "Terminé"}
          </Badge>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(iv.date).toLocaleString()}</span>
        </div>
        {iv.interviewers.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            Recruteurs : {iv.interviewers.map((id) => employees.find((e) => e.id === id)?.firstName).join(", ")}
          </div>
        )}
        {iv.notes && <p className="mt-2 text-sm text-muted-foreground">{iv.notes}</p>}
        {iv.status === "done" && iv.score !== undefined && (
          <div className="mt-2 text-sm">Score : <span className="font-medium">{iv.score}/20</span></div>
        )}
        {iv.status === "scheduled" && (
          <div className="mt-4 flex gap-2 border-t pt-3">
            <Input
              type="number" min={0} max={20} placeholder="Note /20"
              className="h-8 w-24"
              onChange={(e) => setScore(iv, Number(e.target.value))}
            />
            <Button size="sm" variant="outline" onClick={() => setStatus(iv, "done", "pass")} className={cn("text-success")}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Valider
            </Button>
            <Button size="sm" variant="outline" onClick={() => setStatus(iv, "done", "fail")} className="text-destructive">
              <XCircle className="h-3.5 w-3.5 mr-1" /> Refuser
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
