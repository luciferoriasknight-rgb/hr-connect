import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/AboutPage";

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
