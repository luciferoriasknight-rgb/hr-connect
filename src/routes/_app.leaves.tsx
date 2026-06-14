import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/LeavesPage";

export const Route = createFileRoute("/_app/leaves")({
  head: () => ({ meta: [{ title: "Congés — RH Suite" }] }),
  component: Page,
});
