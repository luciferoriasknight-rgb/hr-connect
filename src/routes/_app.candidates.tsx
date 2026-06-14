import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/CandidatesPage";

export const Route = createFileRoute("/_app/candidates")({
  head: () => ({ meta: [{ title: "Candidatures — RH Suite" }] }),
  component: Page,
});
