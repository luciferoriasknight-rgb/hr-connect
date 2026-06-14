import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/FeaturesPage";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Fonctionnalités — RHConnect" },
      { name: "description", content: "Découvrez les 15 modules RH de RHConnect : recrutement, employés, congés, performances, paie et plus." },
      { property: "og:title", content: "Fonctionnalités — RHConnect" },
      { property: "og:description", content: "Tous les modules RH dans une seule plateforme moderne." },
    ],
  }),
  component: Page,
});
