import { useState } from "react";
import { Plus, CheckCircle2, XCircle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { db, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { LeaveRequest, LeaveType } from "@/lib/types";
import { toast } from "sonner";

const TYPES: LeaveType[] = ["annual", "sick", "maternity", "paternity", "exceptional", "remote"];

function LeavesPage() {
  const { t } = useI18n();
  const { user, hasRole } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => db.leaves.all());
  const employees = db.employees.all();
  const myEmployee = employees.find((e) => e.id === user?.employeeId);
  const isApprover = hasRole("admin", "hr", "manager");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ type: LeaveType; startDate: string; endDate: string; reason: string }>({
    type: "annual", startDate: "", endDate: "", reason: "",
  });

  const refresh = () => setLeaves(db.leaves.all());

  const mine = leaves.filter((l) => l.employeeId === user?.employeeId);
  const toApprove = isApprover ? leaves.filter((l) => l.status === "pending" || l.status === "manager_approved") : [];
  const allRecent = isApprover ? leaves.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50) : [];

  const submit = () => {
    if (!user?.employeeId) { toast.error("Aucun dossier employé lié"); return; }
    if (!form.startDate || !form.endDate) { toast.error("Dates requises"); return; }
    const lr: LeaveRequest = {
      id: uid(), employeeId: user.employeeId, type: form.type,
      startDate: form.startDate, endDate: form.endDate, reason: form.reason,
      status: "pending", createdAt: new Date().toISOString(),
    };
    db.leaves.save([lr, ...db.leaves.all()]);
    setOpen(false);
    refresh();
    toast.success("Demande envoyée");
  };

  const setStatus = (l: LeaveRequest, status: LeaveRequest["status"]) => {
    db.leaves.save(db.leaves.all().map((x) => x.id === l.id ? { ...x, status } : x));
    refresh();
  };

  return (
    <AppShell title={t.leaves}>
      <PageHeader
        title={t.leaves}
        subtitle="Gérez vos demandes de congés."
        actions={
          user?.employeeId && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-1.5" />{t.request}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Demande de congé</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <Label>{t.type}</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as LeaveType })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TYPES.map((x) => <SelectItem key={x} value={x}>{t.leaveTypes[x]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>{t.from}</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>{t.to}</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
                  </div>
                  <div className="space-y-1.5"><Label>{t.reason}</Label><Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button>
                  <Button onClick={submit}>{t.save}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

      {myEmployee && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">{t.leaveBalance}</div><div className="mt-1 text-2xl font-semibold">{myEmployee.leaveBalance} j</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">En attente</div><div className="mt-1 text-2xl font-semibold">{mine.filter((m) => m.status === "pending" || m.status === "manager_approved").length}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Approuvés</div><div className="mt-1 text-2xl font-semibold">{mine.filter((m) => m.status === "approved").length}</div></CardContent></Card>
        </div>
      )}

      {isApprover && (
        <>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">À approuver</h3>
          <Card className="mb-6">
            <CardContent className="p-0">
              <Table leaves={toApprove} employees={employees} approver onAction={setStatus} />
            </CardContent>
          </Card>
        </>
      )}

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {isApprover ? "Toutes les demandes" : "Mes demandes"}
      </h3>
      <Card>
        <CardContent className="p-0">
          <Table leaves={isApprover ? allRecent : mine} employees={employees} onAction={(l, s) => setStatus(l, s)} />
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Table({
  leaves, employees, approver, onAction,
}: {
  leaves: LeaveRequest[];
  employees: ReturnType<typeof db.employees.all>;
  approver?: boolean;
  onAction: (l: LeaveRequest, status: LeaveRequest["status"]) => void;
}) {
  const { t } = useI18n();
  if (leaves.length === 0) return <div className="p-10 text-center text-sm text-muted-foreground">{t.nothing}</div>;
  return (
    <table className="w-full text-sm">
      <thead className="border-b bg-muted/50">
        <tr className="text-left">
          <th className="p-3 font-medium">Employé</th>
          <th className="p-3 font-medium">Type</th>
          <th className="p-3 font-medium">Période</th>
          <th className="p-3 font-medium">Statut</th>
          {approver && <th className="p-3"></th>}
        </tr>
      </thead>
      <tbody>
        {leaves.map((l) => {
          const e = employees.find((x) => x.id === l.employeeId);
          return (
            <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="p-3">{e ? `${e.firstName} ${e.lastName}` : "—"}</td>
              <td className="p-3">{t.leaveTypes[l.type]}</td>
              <td className="p-3 text-muted-foreground">{new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()}</td>
              <td className="p-3">
                <Badge variant={l.status === "approved" ? "default" : l.status === "rejected" ? "destructive" : "secondary"}>{l.status}</Badge>
              </td>
              {approver && (
                <td className="p-3 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" className="text-success" onClick={() => onAction(l, "approved")}>
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onAction(l, "rejected")}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default LeavesPage;
