import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/IndexPage";

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
  component: Page,
});
