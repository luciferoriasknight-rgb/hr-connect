import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/ReportsPage";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Rapports — RH Suite" }] }),
  component: Page,
});
