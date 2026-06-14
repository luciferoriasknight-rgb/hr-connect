import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/JobsPage";

export const Route = createFileRoute("/_app/jobs")({
  head: () => ({ meta: [{ title: "Offres publiques — RH Suite" }] }),
  component: Page,
});
