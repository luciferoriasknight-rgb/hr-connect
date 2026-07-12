import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/PortfolioPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deno Roy — Algo trader & Python developer" },
      { name: "description", content: "Portfolio dev de Deno Roy — trading bots, scanners de marché, IA appliquée à la finance." },
    ],
  }),
  component: Page,
});
