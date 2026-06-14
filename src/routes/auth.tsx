import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/AuthPage";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion — RHConnect" }] }),
  component: Page,
});
