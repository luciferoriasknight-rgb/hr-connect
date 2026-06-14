import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/InterviewsPage";

export const Route = createFileRoute("/_app/interviews")({
  head: () => ({ meta: [{ title: "Entretiens — RH Suite" }] }),
  component: Page,
});
