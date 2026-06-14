import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/EmployeesPage";

export const Route = createFileRoute("/_app/employees")({
  head: () => ({ meta: [{ title: "Employés — RH Suite" }] }),
  component: Page,
});
