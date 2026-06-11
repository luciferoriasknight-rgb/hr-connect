import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { Notification } from "@/lib/types";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — RHConnect" }] }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const { user } = useAuth();

  const load = () => db.notifications.all().filter((n) => !n.userId || n.userId === user?.id);
  const [items, setItems] = useState<Notification[]>(load);

  const persist = () => {
    // Rewrite ALL notifications keeping changes
    const all = db.notifications.raw();
    const updated = all.map((n) => items.find((i) => i.id === n.id) ?? n);
    localStorage.setItem(db.KEYS.notifications, JSON.stringify(updated));
    setItems(load());
  };

  const markRead = (id: string) => {
    setItems(items.map((n) => n.id === id ? { ...n, read: true } : n));
    setTimeout(persist, 0);
  };

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
    setTimeout(persist, 0);
  };

  const remove = (id: string) => {
    const all = db.notifications.raw().filter((n) => n.id !== id);
    localStorage.setItem(db.KEYS.notifications, JSON.stringify(all));
    setItems(load());
  };

  const colors: Record<Notification["type"], string> = {
    info: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-destructive/10 text-destructive",
  };

  return (
    <AppShell title={t.notifications}>
      <PageHeader title={t.notifications} subtitle="Toutes vos alertes en un coup d'œil." actions={
        <Button variant="outline" onClick={markAllRead}><Check className="mr-1.5 h-4 w-4" />Tout marquer lu</Button>
      } />

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
                <Bell className="h-8 w-8 opacity-40" />
                Aucune notification
              </div>
            )}
            {items.map((n) => (
              <div key={n.id} className="flex items-start gap-4 p-4 hover:bg-muted/30">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors[n.type]}`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{n.title}</span>
                    {!n.read && <Badge variant="default" className="h-5 px-1.5 text-[10px]">Nouveau</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-1">
                  {n.link && <Link to={n.link}><Button size="sm" variant="ghost">Voir</Button></Link>}
                  {!n.read && <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}><Check className="h-4 w-4" /></Button>}
                  <Button size="sm" variant="ghost" onClick={() => remove(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
