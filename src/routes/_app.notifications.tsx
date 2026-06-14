import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/NotificationsPage";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — RHConnect" }] }),
  component: Page,
});
