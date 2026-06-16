import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, RotateCcw, FileEdit, Eye, Send, CheckCircle2, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import {
  getLandingDraft,
  getLanding,
  saveLandingDraft,
  publishLanding,
  discardLandingDraft,
  hasUnpublishedChanges,
  DEFAULT_LANDING,
  type LandingContent,
  type LandingPlan,
} from "@/lib/landing-content";
import { toast } from "sonner";

function LandingContentPage() {
  const { hasRole } = useAuth();
  const [content, setContent] = useState<LandingContent>(() => getLandingDraft());
  const [dirty, setDirty] = useState<boolean>(() => hasUnpublishedChanges());
  const [previewOpen, setPreviewOpen] = useState(false);

  // Auto-save draft on each change (debounced via effect).
  useEffect(() => {
    saveLandingDraft(content);
    setDirty(hasUnpublishedChanges());
  }, [content]);

  if (!hasRole("super_admin")) {
    return (
      <AppShell title="Contenu landing">
        <PageHeader title="Accès refusé" subtitle="Réservé au super administrateur." />
      </AppShell>
    );
  }

  const publish = () => {
    publishLanding(content);
    setDirty(false);
    toast.success("Contenu publié sur les pages publiques.");
  };
  const revert = () => {
    if (!confirm("Abandonner le brouillon et revenir au contenu publié ?")) return;
    discardLandingDraft();
    const pub = getLanding();
    setContent(pub);
    setDirty(false);
    toast.info("Brouillon abandonné.");
  };
  const reset = () => {
    if (!confirm("Restaurer le contenu par défaut comme brouillon ?")) return;
    setContent(DEFAULT_LANDING);
    toast.message("Contenu réinitialisé en brouillon (non publié).");
  };

  const setHero = (k: keyof LandingContent["hero"], v: string) => setContent({ ...content, hero: { ...content.hero, [k]: v } });
  const setAbout = (k: keyof LandingContent["about"], v: string) => setContent({ ...content, about: { ...content.about, [k]: v } });
  const setContact = (k: keyof LandingContent["contact"], v: string) => setContent({ ...content, contact: { ...content.contact, [k]: v } });
  const setPricingMeta = (k: "title" | "subtitle", v: string) => setContent({ ...content, pricing: { ...content.pricing, [k]: v } });
  const setPlan = (idx: number, patch: Partial<LandingPlan>) => {
    const plans = content.pricing.plans.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    setContent({ ...content, pricing: { ...content.pricing, plans } });
  };
  const addPlan = () => setContent({ ...content, pricing: { ...content.pricing, plans: [...content.pricing.plans, { name: "Nouveau plan", price: "0€", desc: "", features: [], cta: "Choisir" }] } });
  const removePlan = (idx: number) => setContent({ ...content, pricing: { ...content.pricing, plans: content.pricing.plans.filter((_, i) => i !== idx) } });

  const statusBadge = useMemo(() => {
    if (dirty) return <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600"><AlertCircle className="mr-1 h-3 w-3" />Brouillon non publié</Badge>;
    return <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="mr-1 h-3 w-3" />À jour</Badge>;
  }, [dirty]);

  return (
    <AppShell title="Contenu landing">
      <PageHeader
        title="Contenu des pages publiques"
        subtitle="Modifiez en brouillon, prévisualisez, puis publiez sur Landing, Tarifs, À propos et Contact."
        actions={
          <>
            <Button variant="outline" onClick={() => setPreviewOpen(true)}><Eye className="mr-1.5 h-4 w-4" />Aperçu</Button>
            <Button variant="outline" onClick={revert} disabled={!dirty}><RotateCcw className="mr-1.5 h-4 w-4" />Abandonner</Button>
            <Button variant="outline" onClick={reset}><Save className="mr-1.5 h-4 w-4" />Défaut</Button>
            <Button onClick={publish} disabled={!dirty}><Send className="mr-1.5 h-4 w-4" />Publier</Button>
          </>
        }
      />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
        <div className="flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-primary" />
          Les modifications sont enregistrées automatiquement en brouillon. Cliquez sur « Publier » pour les rendre visibles aux visiteurs.
        </div>
        {statusBadge}
      </div>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Landing</TabsTrigger>
          <TabsTrigger value="pricing">Tarifs</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-4">
          <Card><CardContent className="grid gap-3 p-5">
            <Field label="Tagline (badge)"><Input value={content.hero.tagline} onChange={(e) => setHero("tagline", e.target.value)} /></Field>
            <Field label="Titre principal"><Textarea rows={2} value={content.hero.title} onChange={(e) => setHero("title", e.target.value)} /></Field>
            <Field label="Sous-titre"><Textarea rows={3} value={content.hero.subtitle} onChange={(e) => setHero("subtitle", e.target.value)} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="CTA principal"><Input value={content.hero.ctaPrimary} onChange={(e) => setHero("ctaPrimary", e.target.value)} /></Field>
              <Field label="CTA secondaire"><Input value={content.hero.ctaSecondary} onChange={(e) => setHero("ctaSecondary", e.target.value)} /></Field>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-4 space-y-4">
          <Card><CardContent className="grid gap-3 p-5">
            <Field label="Titre"><Input value={content.pricing.title} onChange={(e) => setPricingMeta("title", e.target.value)} /></Field>
            <Field label="Sous-titre"><Input value={content.pricing.subtitle} onChange={(e) => setPricingMeta("subtitle", e.target.value)} /></Field>
          </CardContent></Card>

          <div className="grid gap-4 lg:grid-cols-3">
            {content.pricing.plans.map((p, idx) => (
              <Card key={idx} className={p.highlight ? "border-primary" : ""}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant={p.highlight ? "default" : "outline"}>Plan {idx + 1}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => removePlan(idx)} aria-label="Supprimer ce plan"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <Field label="Nom"><Input value={p.name} onChange={(e) => setPlan(idx, { name: e.target.value })} /></Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Prix"><Input value={p.price} onChange={(e) => setPlan(idx, { price: e.target.value })} /></Field>
                    <Field label="Périodicité"><Input value={p.per ?? ""} onChange={(e) => setPlan(idx, { per: e.target.value })} /></Field>
                  </div>
                  <Field label="Description"><Input value={p.desc} onChange={(e) => setPlan(idx, { desc: e.target.value })} /></Field>
                  <Field label="Fonctionnalités (une par ligne)">
                    <Textarea rows={5} value={p.features.join("\n")} onChange={(e) => setPlan(idx, { features: e.target.value.split("\n").filter(Boolean) })} />
                  </Field>
                  <Field label="Texte du bouton"><Input value={p.cta} onChange={(e) => setPlan(idx, { cta: e.target.value })} /></Field>
                  <div className="flex items-center justify-between rounded-md border p-2.5">
                    <Label className="text-xs">Mettre en avant</Label>
                    <Switch checked={!!p.highlight} onCheckedChange={(v) => setPlan(idx, { highlight: v })} />
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-2.5">
                    <Label className="text-xs">CTA → page Contact</Label>
                    <Switch checked={!!p.contactCta} onCheckedChange={(v) => setPlan(idx, { contactCta: v })} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" onClick={addPlan}><Plus className="mr-1.5 h-4 w-4" />Ajouter un plan</Button>
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <Card><CardContent className="grid gap-3 p-5">
            <Field label="Titre"><Textarea rows={2} value={content.about.title} onChange={(e) => setAbout("title", e.target.value)} /></Field>
            <Field label="Introduction"><Textarea rows={4} value={content.about.intro} onChange={(e) => setAbout("intro", e.target.value)} /></Field>
            <Field label="Mission"><Input value={content.about.mission} onChange={(e) => setAbout("mission", e.target.value)} /></Field>
            <Field label="Valeurs"><Input value={content.about.values} onChange={(e) => setAbout("values", e.target.value)} /></Field>
            <Field label="Vision"><Input value={content.about.vision} onChange={(e) => setAbout("vision", e.target.value)} /></Field>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card><CardContent className="grid gap-3 p-5">
            <Field label="Email"><Input value={content.contact.email} onChange={(e) => setContact("email", e.target.value)} /></Field>
            <Field label="Téléphone"><Input value={content.contact.phone} onChange={(e) => setContact("phone", e.target.value)} /></Field>
            <Field label="Adresse"><Input value={content.contact.address} onChange={(e) => setContact("address", e.target.value)} /></Field>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> Aperçu du brouillon
              {dirty && <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600">Non publié</Badge>}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto rounded-md border bg-background">
            <Preview content={content} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Fermer</Button>
            <Button onClick={() => { publish(); setPreviewOpen(false); }} disabled={!dirty}>
              <Send className="mr-1.5 h-4 w-4" />Publier maintenant
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Preview({ content }: { content: LandingContent }) {
  return (
    <div className="space-y-8 p-6">
      <section>
        <Badge variant="secondary" className="mb-3">{content.hero.tagline}</Badge>
        <h1 className="text-3xl font-bold tracking-tight">{content.hero.title}</h1>
        <p className="mt-3 text-muted-foreground">{content.hero.subtitle}</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm">{content.hero.ctaPrimary}</Button>
          <Button size="sm" variant="outline">{content.hero.ctaSecondary}</Button>
        </div>
      </section>

      <section className="border-t pt-6">
        <Badge variant="outline" className="mb-2">Tarifs</Badge>
        <h2 className="text-xl font-semibold">{content.pricing.title}</h2>
        <p className="text-sm text-muted-foreground">{content.pricing.subtitle}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {content.pricing.plans.map((p, i) => (
            <Card key={i} className={p.highlight ? "border-primary" : ""}>
              <CardContent className="p-4">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{p.desc}</div>
                <div className="mt-2 text-2xl font-bold">{p.price} <span className="text-xs font-normal text-muted-foreground">{p.per}</span></div>
                <ul className="mt-3 space-y-1 text-xs">
                  {p.features.map((f) => <li key={f} className="flex gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" />{f}</li>)}
                </ul>
                <Button size="sm" variant={p.highlight ? "default" : "outline"} className="mt-3 w-full">{p.cta}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t pt-6">
        <Badge variant="outline" className="mb-2">À propos</Badge>
        <h2 className="text-xl font-semibold">{content.about.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{content.about.intro}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          <div><div className="font-medium">Mission</div><div className="text-muted-foreground">{content.about.mission}</div></div>
          <div><div className="font-medium">Valeurs</div><div className="text-muted-foreground">{content.about.values}</div></div>
          <div><div className="font-medium">Vision</div><div className="text-muted-foreground">{content.about.vision}</div></div>
        </div>
      </section>

      <section className="border-t pt-6">
        <Badge variant="outline" className="mb-2">Contact</Badge>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{content.contact.email}</div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{content.contact.phone}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{content.contact.address}</div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>{children}</div>;
}

export default LandingContentPage;
