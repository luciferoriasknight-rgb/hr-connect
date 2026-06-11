import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Moon, Sun, LogOut, Languages, Building2, Bell, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AppNav } from "./app-nav";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { db } from "@/lib/storage";
import type { Notification } from "@/lib/types";

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  const { user, logout, company, switchCompany, activeCompanyId } = useAuth();
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const settings = db.settings.get();

  const [notifs, setNotifs] = useState<Notification[]>([]);
  useEffect(() => {
    const refresh = () => {
      const all = db.notifications.all();
      const mine = user ? all.filter((n) => !n.userId || n.userId === user.id) : [];
      setNotifs(mine);
    };
    refresh();
    const i = setInterval(refresh, 5000);
    return () => clearInterval(i);
  }, [user, activeCompanyId]);

  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    const all = db.notifications.raw().map((n) => (!n.userId || n.userId === user?.id ? { ...n, read: true } : n));
    localStorage.setItem(db.KEYS.notifications, JSON.stringify(all));
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const onLogout = () => { logout(); navigate({ to: "/auth" }); };

  const initials = user?.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
  const companyLabel = company?.name ?? (user?.role === "super_admin" ? t.allCompanies : settings.name);
  const allCompanies = db.companies.all();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.4_0.22_310)] text-primary-foreground shadow shadow-primary/30">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold">{t.appName}</div>
            <div className="truncate text-xs text-muted-foreground">{companyLabel}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AppNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background px-4 md:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-16 items-center gap-2 border-b px-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Building2 className="h-5 w-5" /></div>
                <div className="text-sm font-semibold">{companyLabel}</div>
              </div>
              <AppNav onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <h1 className="text-base font-semibold tracking-tight md:text-lg">{title}</h1>

          <div className="ml-auto flex items-center gap-2">
            {/* Super admin company switcher */}
            {user?.role === "super_admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span className="max-w-32 truncate">{companyLabel}</span>
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t.switchCompany}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => switchCompany(null)}>
                    {!activeCompanyId && <Check className="mr-2 h-4 w-4" />} {t.allCompanies}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {allCompanies.map((c) => (
                    <DropdownMenuItem key={c.id} onClick={() => switchCompany(c.id)}>
                      {activeCompanyId === c.id && <Check className="mr-2 h-4 w-4" />}
                      {c.name}
                      <Badge variant="outline" className="ml-auto text-[10px]">{c.plan}</Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">{unread}</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="p-0">{t.notifications}</DropdownMenuLabel>
                  {unread > 0 && <button onClick={markAllRead} className="text-xs text-primary hover:underline">Tout lire</button>}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifs.slice(0, 8).map((n) => (
                    <DropdownMenuItem key={n.id} asChild>
                      <Link to={n.link ?? "/notifications"} className="flex-col items-start gap-0.5">
                        <div className="flex w-full items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${n.read ? "bg-muted" : "bg-primary"}`} />
                          <span className="text-sm font-medium">{n.title}</span>
                        </div>
                        <p className="line-clamp-2 pl-4 text-xs text-muted-foreground">{n.message}</p>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {notifs.length === 0 && <div className="p-4 text-center text-xs text-muted-foreground">Aucune notification</div>}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/notifications" className="justify-center text-primary">Voir tout</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={toggle} aria-label="theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Languages className="h-4 w-4" />
                  <span className="uppercase">{lang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLang("fr")}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{initials}</div>
                  <div className="hidden text-left md:block">
                    <div className="text-xs font-medium leading-tight">{user?.fullName}</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{user ? t.roles[user.role] : ""}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile">{t.profile}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/billing">{t.billing}</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
