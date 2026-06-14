import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/EmployeesDetailPage";

export const Route = createFileRoute("/_app/employees/$id")({
  head: () => ({ meta: [{ title: "Fiche employé — RH Suite" }] }),
  component: Page,
});
