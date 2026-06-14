import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/DocumentsPage";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Documents — RH Suite" }] }),
  component: Page,
});
