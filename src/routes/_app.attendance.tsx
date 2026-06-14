import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/AttendancePage";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({ meta: [{ title: "Présences — RH Suite" }] }),
  component: Page,
});
