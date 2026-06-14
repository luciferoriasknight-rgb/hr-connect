import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/PricingPage";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Tarifs — RHConnect" },
      { name: "description", content: "Tarifs simples et transparents : Starter gratuit, Pro à 12€/employé/mois, Enterprise sur devis." },
      { property: "og:title", content: "Tarifs — RHConnect" },
      { property: "og:description", content: "Démarrez gratuitement, montez en puissance quand vous le souhaitez." },
    ],
  }),
  component: Page,
});
