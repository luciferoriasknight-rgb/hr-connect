import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/InvitationsPage";

export const Route = createFileRoute("/_app/invitations")({
  head: () => ({ meta: [{ title: "Invitations — RHConnect" }] }),
  component: Page,
});
