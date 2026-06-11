import { createFileRoute } from "@tanstack/react-router";
import { LandingShell } from "@/components/landing-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Heart, Globe2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — RHConnect" },
      { name: "description", content: "RHConnect, la plateforme RH moderne née de l'expérience d'équipes RH ambitieuses." },
      { property: "og:title", content: "À propos — RHConnect" },
      { property: "og:description", content: "Notre mission : simplifier la gestion RH des entreprises modernes." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <LandingShell>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <Badge variant="outline" className="mb-4">À propos</Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">La RH moderne, accessible à toutes les entreprises.</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          RHConnect est né d'un constat simple : les outils RH actuels sont soit trop complexes, soit trop limités.
          Nous avons construit une plateforme qui réunit le meilleur des deux mondes, pour des entreprises
          de toutes tailles, partout dans le monde.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Target, title: "Notre mission", desc: "Digitaliser toute la chaîne RH, du recrutement au reporting." },
            { icon: Heart, title: "Nos valeurs", desc: "Transparence, simplicité, et respect des collaborateurs." },
            { icon: Globe2, title: "Notre vision", desc: "Devenir la référence RH pour les équipes ambitieuses." },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="bg-card/70 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 text-center">
          {[{ k: "500+", v: "Entreprises clientes" }, { k: "10 000+", v: "Employés gérés" }, { k: "12", v: "Pays présents" }].map((s) => (
            <div key={s.v}>
              <div className="text-4xl font-bold text-primary">{s.k}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>
    </LandingShell>
  );
}
