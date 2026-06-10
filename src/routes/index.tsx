import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Building2, ArrowRight, Users, UserSearch, CalendarDays, BarChart3,
  ClipboardCheck, GraduationCap, FileText, Network, Shield, Sparkles,
  CheckCircle2, Globe2, Moon, Sun, Menu, X, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

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
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctaTarget = user
    ? user.role === "candidate" ? "/jobs" : "/dashboard"
    : "/auth";

  const features = [
    { icon: UserSearch, title: "Recrutement", desc: "Offres, pipeline Kanban, entretiens, scoring — tout au même endroit." },
    { icon: Users, title: "Employés", desc: "Dossiers complets, organigramme, onboarding et historique professionnel." },
    { icon: CalendarDays, title: "Congés & présences", desc: "Workflows d'approbation, soldes, télétravail et planning d'équipe." },
    { icon: ClipboardCheck, title: "Performances", desc: "Objectifs OKR, évaluations 360°, plans de développement." },
    { icon: GraduationCap, title: "Formations", desc: "Catalogue interne/externe, inscriptions, suivi des compétences." },
    { icon: FileText, title: "Documents", desc: "Contrats, attestations, diplômes — générés, signés, archivés." },
    { icon: BarChart3, title: "Reporting", desc: "KPI RH en temps réel, exports PDF/Excel pour la direction." },
    { icon: Network, title: "Organisation", desc: "Départements, équipes, hiérarchie visuelle multi-niveaux." },
    { icon: Shield, title: "Rôles & sécurité", desc: "5 rôles métier, multi-entreprises, journal d'audit complet." },
  ];

  const plans = [
    { name: "Starter", price: "Gratuit", desc: "Pour démarrer.", features: ["Jusqu'à 10 employés", "Recrutement de base", "Congés & présences", "1 administrateur"], cta: t.nav.getStarted, highlight: false },
    { name: "Pro", price: "12€", per: "/ employé / mois", desc: "Pour les équipes en croissance.", features: ["Employés illimités", "Pipeline complet", "Performances & formations", "Reporting avancé", "Multi-administrateurs"], cta: "Essai 14 jours", highlight: true },
    { name: "Enterprise", price: "Sur devis", desc: "Pour les grandes organisations.", features: ["Multi-entreprises", "SSO & sécurité avancée", "Intégrations sur-mesure", "Support dédié 24/7", "Conformité RGPD"], cta: "Nous contacter", highlight: false },
  ];

  const testimonials = [
    { name: "Sophie Martin", role: "Directrice RH, Acme", quote: "RHConnect a divisé par 2 notre temps de recrutement. L'outil est devenu indispensable.", rating: 5 },
    { name: "Karim Benali", role: "CTO, Globex", quote: "Enfin une plateforme qui pense aux managers ET aux employés. Adoption immédiate.", rating: 5 },
    { name: "Léa Laurent", role: "DG, Initech", quote: "Le reporting et l'organigramme nous font gagner un temps fou en comité de direction.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all",
          scrolled ? "border-b bg-background/85 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.4_0.2_290)] text-primary-foreground shadow-lg shadow-primary/25">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold tracking-tight">{t.appName}</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">{t.nav.features}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{t.nav.pricing}</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">{t.nav.about}</a>
            <a href="#contact" className="hover:text-foreground transition-colors">{t.nav.contact}</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="hidden sm:inline-flex">
              <Globe2 className="mr-1.5 h-4 w-4" /> {lang.toUpperCase()}
            </Button>
            <Link to="/auth" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm">{t.nav.login}</Button>
            </Link>
            <Link to={ctaTarget}>
              <Button size="sm" className="gap-1.5">
                {t.nav.getStarted} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenu((v) => !v)} aria-label="Menu">
              {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {menu && (
          <div className="border-t bg-background md:hidden">
            <nav className="flex flex-col px-4 py-3 text-sm">
              <a href="#features" onClick={() => setMenu(false)} className="py-2">{t.nav.features}</a>
              <a href="#pricing" onClick={() => setMenu(false)} className="py-2">{t.nav.pricing}</a>
              <a href="#testimonials" onClick={() => setMenu(false)} className="py-2">{t.nav.about}</a>
              <a href="#contact" onClick={() => setMenu(false)} className="py-2">{t.nav.contact}</a>
              <Link to="/auth" className="py-2">{t.nav.login}</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_20%_10%,oklch(0.85_0.15_265/0.35),transparent_40%),radial-gradient(circle_at_80%_30%,oklch(0.85_0.15_300/0.25),transparent_45%)]" />
        <div className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:32px_32px] opacity-40" />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {t.landing.heroTagline}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
              {t.landing.heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg text-balance">
              {t.landing.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={ctaTarget}>
                <Button size="lg" className="gap-2 h-12 px-6 text-base">
                  {t.landing.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="h-12 px-6 text-base">
                  {t.landing.ctaSecondary}
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Sans carte bancaire • Configuration en 2 minutes</p>
          </div>

          {/* App preview mock */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="absolute -inset-x-20 -inset-y-8 -z-10 rounded-[3rem] bg-gradient-to-tr from-primary/30 via-fuchsia-500/15 to-transparent blur-3xl opacity-60" />
            <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <div className="ml-3 text-xs text-muted-foreground">app.rhconnect.io / dashboard</div>
              </div>
              <div className="grid grid-cols-12 gap-0">
                <div className="col-span-3 hidden border-r bg-sidebar p-4 md:block">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary" />
                    <div className="text-sm font-semibold">Acme Corp</div>
                  </div>
                  {["Dashboard", "Offres", "Candidats", "Employés", "Congés", "Performances", "Reporting"].map((n, i) => (
                    <div key={n} className={cn("mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs", i === 0 ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70")}>
                      <div className="h-3.5 w-3.5 rounded bg-current opacity-30" />
                      {n}
                    </div>
                  ))}
                </div>
                <div className="col-span-12 p-5 md:col-span-9">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">Bienvenue Sophie 👋</div>
                      <div className="text-xs text-muted-foreground">Voici votre activité RH</div>
                    </div>
                    <div className="h-8 w-24 rounded-md bg-primary/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="h-32 rounded-lg border bg-gradient-to-br from-primary/10 to-transparent p-3">
                      <div className="text-xs font-medium text-muted-foreground">Recrutement</div>
                      <svg viewBox="0 0 200 60" className="mt-1 w-full">
                        <polyline fill="none" stroke="var(--chart-1)" strokeWidth="2" points="0,40 30,30 60,35 90,20 120,25 150,12 180,18 200,8" />
                        <polyline fill="none" stroke="var(--chart-2)" strokeWidth="2" points="0,50 30,45 60,40 90,38 120,30 150,28 180,22 200,20" />
                      </svg>
                    </div>
                    <div className="h-32 rounded-lg border bg-gradient-to-br from-fuchsia-500/10 to-transparent p-3">
                      <div className="text-xs font-medium text-muted-foreground">Pipeline candidats</div>
                      <div className="mt-2 flex h-6 overflow-hidden rounded-full bg-muted">
                        <div className="bg-[var(--chart-1)]" style={{ width: "30%" }} />
                        <div className="bg-[var(--chart-3)]" style={{ width: "20%" }} />
                        <div className="bg-[var(--chart-5)]" style={{ width: "25%" }} />
                        <div className="bg-[var(--chart-2)]" style={{ width: "15%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logos */}
          <div className="mt-16 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{t.landing.trustedBy}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
              {["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark Ind."].map((n) => (
                <span key={n} className="text-lg font-semibold tracking-tight text-muted-foreground">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-20 md:py-28">
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
                <Card key={f.title} className="group transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
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
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">{t.nav.pricing}</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">{t.landing.pricingTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.landing.pricingSubtitle}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.name} className={cn("relative", p.highlight && "border-primary shadow-xl shadow-primary/10")}>
                {p.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Le plus populaire</Badge>
                )}
                <CardContent className="p-7">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                    {p.per && <span className="text-sm text-muted-foreground">{p.per}</span>}
                  </div>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth" className="mt-7 block">
                    <Button variant={p.highlight ? "default" : "outline"} className="w-full">{p.cta}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">Témoignages</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ce qu'en disent nos clients</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((tt) => (
              <Card key={tt.name}>
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

      {/* Bottom CTA */}
      <section id="contact" className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary to-[oklch(0.38_0.2_290)] p-10 text-primary-foreground md:p-16">
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
                <a href="mailto:hello@rhconnect.io">
                  <Button size="lg" variant="outline" className="h-12 border-white/30 bg-white/0 px-6 text-base text-white hover:bg-white/10 hover:text-white">
                    {t.nav.contact}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">{t.appName}</span>
            <span className="hidden md:inline">— {t.landing.footerTagline}</span>
          </div>
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} RHConnect. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}
