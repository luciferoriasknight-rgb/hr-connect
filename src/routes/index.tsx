import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Users, UserSearch, CalendarDays, BarChart3, ClipboardCheck,
  GraduationCap, FileText, Network, Shield, Sparkles, CheckCircle2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LandingShell } from "@/components/landing-shell";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RHConnect — Plateforme RH & Recrutement multi-entreprises" },
      { name: "description", content: "RHConnect centralise recrutement, employés, congés, performances et reporting dans une seule plateforme moderne." },
      { property: "og:title", content: "RHConnect" },
      { property: "og:description", content: "La plateforme RH moderne pour les équipes ambitieuses." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const { t } = useI18n();

  const ctaTarget = user
    ? user.role === "candidate" ? "/jobs" : "/dashboard"
    : "/auth";

  const features = [
    { icon: UserSearch, title: "Recrutement", desc: "Offres, pipeline Kanban, entretiens, scoring." },
    { icon: Users, title: "Employés", desc: "Dossiers complets, organigramme, onboarding." },
    { icon: CalendarDays, title: "Congés & présences", desc: "Workflows d'approbation, soldes, télétravail." },
    { icon: ClipboardCheck, title: "Performances", desc: "OKR, évaluations 360°, plans de développement." },
    { icon: GraduationCap, title: "Formations", desc: "Catalogue interne/externe, inscriptions." },
    { icon: FileText, title: "Documents", desc: "Contrats, attestations, diplômes archivés." },
    { icon: BarChart3, title: "Reporting", desc: "KPI RH temps réel, exports PDF/Excel." },
    { icon: Network, title: "Organisation", desc: "Départements, équipes, hiérarchie visuelle." },
    { icon: Shield, title: "Rôles & sécurité", desc: "5 rôles, multi-entreprises, journal d'audit." },
  ];

  const testimonials = [
    { name: "Sophie Martin", role: "Directrice RH, Acme", quote: "RHConnect a divisé par 2 notre temps de recrutement.", rating: 5 },
    { name: "Karim Benali", role: "CTO, Globex", quote: "Enfin une plateforme qui pense aux managers ET aux employés.", rating: 5 },
    { name: "Léa Laurent", role: "DG, Initech", quote: "Le reporting nous fait gagner un temps fou en comité.", rating: 5 },
  ];

  return (
    <LandingShell>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBg}
            alt=""
            width={1920}
            height={1024}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-background/40" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28 lg:py-36">
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="mb-5 w-fit gap-1.5 rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> {t.landing.heroTagline}
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl">
              {t.landing.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              {t.landing.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={ctaTarget}>
                <Button size="lg" className="h-12 gap-2 px-6 text-base shadow-lg shadow-primary/25">
                  {t.landing.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="h-12 bg-background/70 px-6 text-base backdrop-blur">
                  {t.landing.ctaSecondary}
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Sans carte bancaire • Configuration en 2 minutes</p>

            <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
              {[
                { k: "10k+", v: "Employés gérés" },
                { k: "500+", v: "Entreprises" },
                { k: "98%", v: "Satisfaction" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-bold text-foreground">{s.k}</div>
                  <div>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* App preview */}
          <div className="relative hidden md:block">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/40 via-fuchsia-500/20 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-2xl border bg-card/95 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <div className="ml-3 text-xs text-muted-foreground">app.rhconnect.io / dashboard</div>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <div className="text-lg font-semibold">Bienvenue Sophie 👋</div>
                  <div className="text-xs text-muted-foreground">Voici votre activité RH</div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: "Employés", v: "248", c: "var(--chart-1)" },
                    { l: "Candidats", v: "63", c: "var(--chart-2)" },
                    { l: "Offres", v: "12", c: "var(--chart-5)" },
                    { l: "Congés", v: "7", c: "var(--chart-3)" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-lg border bg-background p-3">
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.l}</div>
                      <div className="mt-1 text-2xl font-semibold" style={{ color: s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border bg-gradient-to-br from-primary/10 to-transparent p-3">
                  <div className="text-xs font-medium text-muted-foreground">Recrutement</div>
                  <svg viewBox="0 0 200 60" className="mt-1 w-full">
                    <polyline fill="none" stroke="var(--chart-1)" strokeWidth="2" points="0,40 30,30 60,35 90,20 120,25 150,12 180,18 200,8" />
                    <polyline fill="none" stroke="var(--chart-2)" strokeWidth="2" points="0,50 30,45 60,40 90,38 120,30 150,28 180,22 200,20" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES preview */}
      <section className="border-t bg-background/60 py-20 backdrop-blur md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">{t.nav.features}</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">{t.landing.featuresTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.landing.featuresSubtitle}</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="group bg-card/70 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to="/features">
              <Button variant="outline" className="gap-2">Toutes les fonctionnalités <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">Témoignages</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ce qu'en disent nos clients</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((tt) => (
              <Card key={tt.name} className="bg-card/70 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: tt.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed">"{tt.quote}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {tt.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{tt.name}</div>
                      <div className="text-xs text-muted-foreground">{tt.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary to-[oklch(0.38_0.22_310)] p-10 text-primary-foreground md:p-16">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">{t.landing.ctaBottomTitle}</h2>
              <p className="mt-3 max-w-xl text-white/85">{t.landing.ctaBottomSubtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="h-12 gap-2 px-6 text-base">
                    {t.landing.ctaPrimary} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-12 border-white/30 bg-white/0 px-6 text-base text-white hover:bg-white/10 hover:text-white">
                    {t.nav.contact}
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/85">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> 14 jours d'essai</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Sans engagement</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Support FR/EN</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LandingShell>
  );
}
