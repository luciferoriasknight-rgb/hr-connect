import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/DashboardPage";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — RHConnect" }] }),
  component: Page,
});
