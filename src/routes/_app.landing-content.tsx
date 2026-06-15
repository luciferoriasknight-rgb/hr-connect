import { createFileRoute } from "@tanstack/react-router";
import LandingContentPage from "@/pages/LandingContentPage";

export const Route = createFileRoute("/_app/landing-content")({
  head: () => ({ meta: [{ title: "Contenu landing — RHConnect" }] }),
  component: LandingContentPage,
});
