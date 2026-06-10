import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({ meta: [{ title: "Présences — RH Suite" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const { t } = useI18n();
  const employees = db.employees.all();
  const records = db.attendance.all();
  const [tab, setTab] = useState("today");

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter((r) => r.date === today);

  const monthly = useMemo(() => {
    const map = new Map<string, { name: string; present: number; late: number; remote: number; absent: number }>();
    employees.forEach((e) => map.set(e.id, { name: `${e.firstName} ${e.lastName}`, present: 0, late: 0, remote: 0, absent: 0 }));
    records.forEach((r) => {
      const m = map.get(r.employeeId);
      if (!m) return;
      if (r.status === "present") m.present++;
      else if (r.status === "late") m.late++;
      else if (r.status === "remote") m.remote++;
      else m.absent++;
    });
    return Array.from(map.values());
  }, [employees, records]);

  return (
    <AppShell title={t.attendance}>
      <PageHeader title={t.attendance} subtitle="Suivi des présences et absences." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="monthly">Mensuel</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Employé</th>
                    <th className="p-3 font-medium">Arrivée</th>
                    <th className="p-3 font-medium">Départ</th>
                    <th className="p-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => {
                    const r = todayRecords.find((x) => x.employeeId === e.id);
                    return (
                      <tr key={e.id} className="border-b last:border-0">
                        <td className="p-3">{e.firstName} {e.lastName}</td>
                        <td className="p-3 text-muted-foreground">{r?.checkIn ?? "—"}</td>
                        <td className="p-3 text-muted-foreground">{r?.checkOut ?? "—"}</td>
                        <td className="p-3">
                          <Badge variant={r?.status === "present" ? "default" : r?.status === "late" ? "outline" : "secondary"}>
                            {r?.status ?? "absent"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Employé</th>
                    <th className="p-3 font-medium">Présent</th>
                    <th className="p-3 font-medium">Retard</th>
                    <th className="p-3 font-medium">Télétravail</th>
                    <th className="p-3 font-medium">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.map((m) => (
                    <tr key={m.name} className="border-b last:border-0">
                      <td className="p-3 font-medium">{m.name}</td>
                      <td className="p-3 text-success">{m.present}</td>
                      <td className="p-3 text-warning">{m.late}</td>
                      <td className="p-3 text-info">{m.remote}</td>
                      <td className="p-3 text-destructive">{m.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
