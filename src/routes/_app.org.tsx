import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/OrgPage";

export const Route = createFileRoute("/_app/org")({
  head: () => ({ meta: [{ title: "Organigramme — RH Suite" }] }),
  component: Page,
});
