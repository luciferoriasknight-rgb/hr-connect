import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, MapPin, Send } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { Candidate, JobOffer } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/jobs")({
  head: () => ({ meta: [{ title: "Offres publiques — RH Suite" }] }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const { user } = useAuth();
  const offers = db.offers.all().filter((o) => o.status === "published");
  const departments = db.departments.all();
  const [selected, setSelected] = useState<JobOffer | null>(null);
  const [form, setForm] = useState({ firstName: user?.fullName.split(" ")[0] ?? "", lastName: user?.fullName.split(" ").slice(1).join(" ") ?? "", email: user?.email ?? "", phone: "", coverLetter: "" });

  const apply = () => {
    if (!selected) return;
    const c: Candidate = {
      id: uid(), firstName: form.firstName, lastName: form.lastName, email: form.email,
      phone: form.phone, skills: selected.skills, experiences: "", education: "",
      coverLetter: form.coverLetter, jobOfferId: selected.id, stage: "received",
      tags: [], favorite: false, notes: [], history: [{ id: uid(), action: "Candidature reçue", date: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };
    db.candidates.save([c, ...db.candidates.all()]);
    setSelected(null);
    toast.success("Candidature envoyée");
  };

  return (
    <AppShell title={t.publicJobs}>
      <PageHeader title="Nos offres" subtitle="Découvrez les postes disponibles et postulez." />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((o) => (
          <Card key={o.id} className="transition hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Briefcase className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{o.title}</h3>
                  <p className="text-xs text-muted-foreground">{departments.find((d) => d.id === o.departmentId)?.name}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary">{o.contractType}</Badge>
                <Badge variant="outline" className="gap-1"><MapPin className="h-3 w-3" />{o.location || "—"}</Badge>
                {o.salaryMin && <Badge variant="outline">{o.salaryMin.toLocaleString()}+ €</Badge>}
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{o.description}</p>
              <Button className="mt-4 w-full" onClick={() => setSelected(o)}>{t.apply} <Send className="h-3.5 w-3.5 ml-1.5" /></Button>
            </CardContent>
          </Card>
        ))}
        {offers.length === 0 && <div className="col-span-full rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">Aucune offre publiée.</div>}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Postuler — {selected?.title}</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Prénom</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Nom</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Téléphone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="sm:col-span-2 space-y-1.5"><Label>Lettre de motivation</Label><Textarea rows={4} value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setSelected(null)}>{t.cancel}</Button><Button onClick={apply}>{t.apply}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
