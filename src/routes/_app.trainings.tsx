import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/TrainingsPage";

export const Route = createFileRoute("/_app/trainings")({
  head: () => ({ meta: [{ title: "Formations — RH Suite" }] }),
  component: Page,
});
