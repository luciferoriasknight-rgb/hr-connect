import { Link } from "@tanstack/react-router";
import { LandingShell } from "@/components/landing-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserSearch, Users, CalendarDays, ClipboardCheck, GraduationCap, FileText,
  BarChart3, Network, Shield, Bell, CreditCard, Briefcase, ArrowRight,
} from "lucide-react";

const features = [
  { icon: UserSearch, title: "Recrutement", desc: "Pipeline Kanban, scoring, entretiens et suivi des candidats de bout en bout." },
  { icon: Users, title: "Gestion des employés", desc: "Dossiers complets, onboarding, archives et historique professionnel." },
  { icon: Network, title: "Organigramme", desc: "Hiérarchie visuelle multi-niveaux, départements et équipes." },
  { icon: CalendarDays, title: "Congés", desc: "Workflows d'approbation, soldes automatiques, calendrier d'équipe." },
  { icon: ClipboardCheck, title: "Présences", desc: "Check-in/out, télétravail, retards, rapports mensuels." },
  { icon: GraduationCap, title: "Formations", desc: "Catalogue, inscriptions, certifications et suivi des compétences." },
  { icon: BarChart3, title: "Reporting", desc: "KPI temps réel, exports PDF & Excel, tableaux pour direction." },
  { icon: FileText, title: "Documents", desc: "Contrats, attestations, diplômes générés et archivés." },
  { icon: Shield, title: "Rôles & sécurité", desc: "5 rôles métier, multi-tenant, journal d'audit complet." },
  { icon: Bell, title: "Notifications", desc: "Alertes en temps réel sur les actions importantes." },
  { icon: CreditCard, title: "Facturation", desc: "Cartes, mobile money, suivi des paiements et factures." },
  { icon: Briefcase, title: "Site carrière", desc: "Offres publiques, candidatures externes intégrées." },
];

function Page() {
  return (
    <LandingShell>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Fonctionnalités</Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">Tout ce qu'il vous faut pour gérer vos talents</h1>
          <p className="mt-4 text-muted-foreground">Une plateforme unique, 15 modules métiers conçus avec les meilleures équipes RH.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="bg-card/70 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <Link to="/auth"><Button size="lg" className="gap-2">Essayer gratuitement <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>
    </LandingShell>
  );
}

export default Page;
