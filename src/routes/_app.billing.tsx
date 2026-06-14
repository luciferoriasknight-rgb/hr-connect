import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/BillingPage";

export const Route = createFileRoute("/_app/billing")({
  head: () => ({ meta: [{ title: "Facturation — RHConnect" }] }),
  component: Page,
});
