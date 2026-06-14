import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/AdminPage";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Administration — RH Suite" }] }),
  component: Page,
});
