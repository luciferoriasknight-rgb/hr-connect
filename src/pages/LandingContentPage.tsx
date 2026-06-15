import { useState } from "react";
import { Plus, Trash2, Save, RotateCcw, FileEdit } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { getLanding, saveLanding, DEFAULT_LANDING, type LandingContent, type LandingPlan } from "@/lib/landing-content";
import { toast } from "sonner";

function LandingContentPage() {
  const { hasRole } = useAuth();
  const [content, setContent] = useState<LandingContent>(() => getLanding());

  if (!hasRole("super_admin")) {
    return (
      <AppShell title="Contenu landing">
        <PageHeader title="Accès refusé" subtitle="Réservé au super administrateur." />
      </AppShell>
    );
  }

  const save = () => {
    saveLanding(content);
    toast.success("Contenu publié sur les pages publiques.");
  };
  const reset = () => {
    if (!confirm("Restaurer le contenu par défaut ?")) return;
    setContent(DEFAULT_LANDING);
    saveLanding(DEFAULT_LANDING);
    toast.success("Contenu réinitialisé.");
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

  return (
    <AppShell title="Contenu landing">
      <PageHeader
        title="Contenu des pages publiques"
        subtitle="Modifiez les textes et tarifs visibles sur Landing, Tarifs, À propos et Contact."
        actions={
          <>
            <Button variant="outline" onClick={reset}><RotateCcw className="mr-1.5 h-4 w-4" />Réinitialiser</Button>
            <Button onClick={save}><Save className="mr-1.5 h-4 w-4" />Publier</Button>
          </>
        }
      />

      <div className="mb-3 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
        <FileEdit className="h-4 w-4 text-primary" />
        Les modifications sont publiées de façon permanente après clic sur « Publier ».
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
                    <Button size="icon" variant="ghost" onClick={() => removePlan(idx)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>{children}</div>;
}

export default LandingContentPage;
