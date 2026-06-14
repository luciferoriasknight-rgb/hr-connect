import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/PlatformPage";

export const Route = createFileRoute("/_app/platform")({
  head: () => ({ meta: [{ title: "Console plateforme — RHConnect" }] }),
  component: Page,
});
