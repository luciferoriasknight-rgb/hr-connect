import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/PerformancePage";

export const Route = createFileRoute("/_app/performance")({
  head: () => ({ meta: [{ title: "Performances — RH Suite" }] }),
  component: Page,
});
