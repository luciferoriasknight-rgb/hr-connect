import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Star, Mail, Phone, Plus, Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { db, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { Candidate, CandidateStage } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/candidates")({
  head: () => ({ meta: [{ title: "Candidatures — RH Suite" }] }),
  component: CandidatesPage,
});

const STAGES: CandidateStage[] = [
  "received", "analysis", "shortlisted", "technical_test",
  "hr_interview", "manager_interview", "final_validation", "hired", "rejected", "archived",
];

function CandidatesPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>(() => db.candidates.all());
  const [search, setSearch] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const offers = db.offers.all();
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", jobOfferId: "" });

  const refresh = () => setCandidates(db.candidates.all());

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (favOnly && !c.favorite) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return `${c.firstName} ${c.lastName} ${c.email} ${c.skills.join(" ")}`.toLowerCase().includes(q);
    });
  }, [candidates, search, favOnly]);

  const grouped = useMemo(() => {
    const g: Record<CandidateStage, Candidate[]> = {} as Record<CandidateStage, Candidate[]>;
    STAGES.forEach((s) => (g[s] = []));
    filtered.forEach((c) => g[c.stage].push(c));
    return g;
  }, [filtered]);

  const onDragEnd = (r: DropResult) => {
    if (!r.destination) return;
    const stage = r.destination.droppableId as CandidateStage;
    const cid = r.draggableId;
    const list = db.candidates.all();
    const updated = list.map((c) =>
      c.id === cid
        ? {
            ...c,
            stage,
            history: [...c.history, { id: uid(), action: `Stage → ${stage}`, date: new Date().toISOString() }],
          }
        : c,
    );
    db.candidates.save(updated);
    db.audit.log({ userId: user!.id, userName: user!.fullName, action: `stage→${stage}`, entity: `candidate:${cid}` });
    refresh();
  };

  const toggleFav = (c: Candidate) => {
    db.candidates.save(db.candidates.all().map((x) => x.id === c.id ? { ...x, favorite: !x.favorite } : x));
    refresh();
  };

  const create = () => {
    if (!form.firstName || !form.email) { toast.error("Nom et email requis"); return; }
    const c: Candidate = {
      id: uid(), firstName: form.firstName, lastName: form.lastName, email: form.email,
      phone: form.phone, skills: [], experiences: "", education: "",
      jobOfferId: form.jobOfferId || undefined, stage: "received",
      tags: [], favorite: false, notes: [], history: [],
      createdAt: new Date().toISOString(),
    };
    db.candidates.save([c, ...db.candidates.all()]);
    refresh();
    setOpenNew(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", jobOfferId: "" });
    toast.success("Candidat créé");
  };

  return (
    <AppShell title={t.candidates}>
      <PageHeader
        title={t.candidates}
        subtitle="Pipeline de recrutement et suivi des candidats."
        actions={
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1.5" />{t.create}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau candidat</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Prénom</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Nom</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Téléphone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>Offre</Label>
                  <Select value={form.jobOfferId} onValueChange={(v) => setForm({ ...form, jobOfferId: v })}>
                    <SelectTrigger><SelectValue placeholder="Aucune" /></SelectTrigger>
                    <SelectContent>{offers.map((o) => <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenNew(false)}>{t.cancel}</Button>
                <Button onClick={create}>{t.save}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant={favOnly ? "default" : "outline"} onClick={() => setFavOnly((v) => !v)}>
          <Star className={cn("h-4 w-4 mr-1.5", favOnly && "fill-current")} /> Favoris
        </Button>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">{t.kanban}</TabsTrigger>
          <TabsTrigger value="list">{t.list}</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
              {STAGES.map((s) => (
                <Droppable key={s} droppableId={s}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex w-72 shrink-0 flex-col rounded-xl border bg-muted/30 p-2.5",
                        snapshot.isDraggingOver && "bg-primary-soft border-primary/30",
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between px-1">
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.stages[s]}</div>
                        <Badge variant="secondary" className="text-[10px]">{grouped[s].length}</Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        {grouped[s].map((c, idx) => (
                          <Draggable key={c.id} draggableId={c.id} index={idx}>
                            {(p, snap) => (
                              <div
                                ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
                                onClick={() => setSelected(c)}
                                className={cn(
                                  "cursor-pointer rounded-lg border bg-card p-3 text-sm shadow-sm transition",
                                  snap.isDragging && "ring-2 ring-primary",
                                )}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="truncate font-medium">{c.firstName} {c.lastName}</div>
                                    <div className="truncate text-xs text-muted-foreground">{c.email}</div>
                                  </div>
                                  {c.favorite && <Star className="h-3.5 w-3.5 fill-warning text-warning" />}
                                </div>
                                {c.jobOfferId && (
                                  <div className="mt-2 text-[11px] text-muted-foreground">
                                    {offers.find((o) => o.id === c.jobOfferId)?.title}
                                  </div>
                                )}
                                {c.tags.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {c.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Candidat</th>
                    <th className="p-3 font-medium">Offre</th>
                    <th className="p-3 font-medium">Étape</th>
                    <th className="p-3 font-medium">Note</th>
                    <th className="p-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3">
                        <div className="font-medium">{c.firstName} {c.lastName}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">{offers.find((o) => o.id === c.jobOfferId)?.title || "—"}</td>
                      <td className="p-3"><Badge variant="secondary">{t.stages[c.stage]}</Badge></td>
                      <td className="p-3">{c.rating ? "★".repeat(c.rating) : "—"}</td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => toggleFav(c)}>
                          <Star className={cn("h-3.5 w-3.5", c.favorite && "fill-warning text-warning")} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setSelected(c)}>Détails</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CandidateSheet
        candidate={selected}
        onClose={() => setSelected(null)}
        onChange={refresh}
      />
    </AppShell>
  );
}

function CandidateSheet({
  candidate, onClose, onChange,
}: { candidate: Candidate | null; onClose: () => void; onChange: () => void }) {
  const { user } = useAuth();
  const [note, setNote] = useState("");
  if (!candidate) return null;
  const offers = db.offers.all();

  const addNote = () => {
    if (!note.trim()) return;
    const list = db.candidates.all().map((c) =>
      c.id === candidate.id
        ? { ...c, notes: [{ id: uid(), author: user!.fullName, text: note, date: new Date().toISOString() }, ...c.notes] }
        : c,
    );
    db.candidates.save(list);
    setNote("");
    onChange();
  };

  const setRating = (r: number) => {
    db.candidates.save(db.candidates.all().map((c) => c.id === candidate.id ? { ...c, rating: r } : c));
    onChange();
  };

  const current = db.candidates.all().find((c) => c.id === candidate.id) ?? candidate;

  return (
    <Sheet open={!!candidate} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{current.firstName} {current.lastName}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{current.email}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{current.phone}</div>
          </div>
          <div className="text-sm">
            <div className="font-medium mb-1">Offre</div>
            <div className="text-muted-foreground">{offers.find((o) => o.id === current.jobOfferId)?.title ?? "—"}</div>
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium">Évaluation</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} type="button">
                  <Star className={cn("h-5 w-5", (current.rating ?? 0) >= n ? "fill-warning text-warning" : "text-muted-foreground")} />
                </button>
              ))}
            </div>
          </div>
          {current.skills.length > 0 && (
            <div>
              <div className="mb-1.5 text-sm font-medium">Compétences</div>
              <div className="flex flex-wrap gap-1">
                {current.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </div>
          )}
          <div>
            <div className="mb-2 text-sm font-medium">Notes RH</div>
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note…" />
            <Button size="sm" className="mt-2" onClick={addNote}>Ajouter</Button>
            <div className="mt-3 space-y-2">
              {current.notes.map((n) => (
                <div key={n.id} className="rounded-md border bg-muted/40 p-2 text-xs">
                  <div className="font-medium">{n.author} <span className="text-muted-foreground">· {new Date(n.date).toLocaleString()}</span></div>
                  <div className="mt-0.5 whitespace-pre-wrap">{n.text}</div>
                </div>
              ))}
              {current.notes.length === 0 && <div className="text-xs text-muted-foreground">Aucune note.</div>}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Historique</div>
            <div className="space-y-1.5">
              {current.history.map((h) => (
                <div key={h.id} className="flex items-center justify-between text-xs">
                  <span>{h.action}</span>
                  <span className="text-muted-foreground">{new Date(h.date).toLocaleString()}</span>
                </div>
              ))}
              {current.history.length === 0 && <div className="text-xs text-muted-foreground">Aucune action.</div>}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
