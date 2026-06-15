import { Link } from "@tanstack/react-router";
import { LandingShell } from "@/components/landing-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLanding } from "@/lib/landing-content";

function Page() {
  const { pricing } = getLanding();
  return (
    <LandingShell>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Tarifs</Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">{pricing.title}</h1>
          <p className="mt-4 text-muted-foreground">{pricing.subtitle}</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pricing.plans.map((p) => {
            const ctaHref = p.contactCta ? "/contact" : "/auth";
            return (
              <Card key={p.name} className={cn("relative bg-card/80 backdrop-blur", p.highlight && "border-primary shadow-xl shadow-primary/15")}>
                {p.highlight && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Le plus populaire</Badge>}
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
                  <Link to={ctaHref} className="mt-7 block">
                    <Button variant={p.highlight ? "default" : "outline"} className="w-full">{p.cta}</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </LandingShell>
  );
}

export default Page;
