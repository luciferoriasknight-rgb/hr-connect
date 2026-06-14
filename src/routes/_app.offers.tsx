import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/OffersPage";

export const Route = createFileRoute("/_app/offers")({
  head: () => ({ meta: [{ title: "Offres d'emploi — RH Suite" }] }),
  component: Page,
});
