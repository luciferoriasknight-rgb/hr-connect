import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — RHConnect" },
      { name: "description", content: "Contactez l'équipe RHConnect pour une démo, une question commerciale ou un support." },
      { property: "og:title", content: "Contact — RHConnect" },
      { property: "og:description", content: "Nous répondons sous 24h. Démo gratuite sur demande." },
    ],
  }),
  component: Page,
});
