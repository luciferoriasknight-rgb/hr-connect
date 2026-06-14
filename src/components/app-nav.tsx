import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Briefcase, Users, UserSearch, CalendarDays, FileText,
  BarChart3, Settings2, ClipboardCheck, GraduationCap, Network, Clock,
  Target, UserCircle2, Globe2, Mail, CreditCard, Bell, Building2,
  Check, ChevronsUpDown,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { db } from "@/lib/storage";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

type LabelKey = keyof ReturnType<typeof useI18n>["t"];

interface NavItem {
  to: string;
  label: LabelKey;
  icon: typeof LayoutDashboard;
  roles: Role[];
  requiresCompany?: boolean;
}

interface NavGroup {
  id: string;
  label: string; // translated label key in t.navGroups
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    id: "overview",
    label: "overview",
    items: [
      { to: "/dashboard", label: "dashboard", icon: LayoutDashboard, roles: ["super_admin", "admin", "hr", "manager", "employee"] },
      { to: "/notifications", label: "notifications", icon: Bell, roles: ["super_admin", "admin", "hr", "manager", "employee", "candidate"] },
    ],
  },
  {
    id: "recruitment",
    label: "recruitment",
    items: [
      { to: "/offers", label: "offers", icon: Briefcase, roles: ["super_admin", "admin", "hr", "manager"], requiresCompany: true },
      { to: "/candidates", label: "candidates", icon: UserSearch, roles: ["super_admin", "admin", "hr", "manager"], requiresCompany: true },
      { to: "/interviews", label: "interviews", icon: ClipboardCheck, roles: ["super_admin", "admin", "hr", "manager"], requiresCompany: true },
    ],
  },
  {
    id: "people",
    label: "people",
    items: [
      { to: "/employees", label: "employees", icon: Users, roles: ["super_admin", "admin", "hr", "manager"], requiresCompany: true },
      { to: "/org", label: "org", icon: Network, roles: ["super_admin", "admin", "hr", "manager", "employee"], requiresCompany: true },
      { to: "/performance", label: "performance", icon: Target, roles: ["super_admin", "admin", "hr", "manager", "employee"], requiresCompany: true },
      { to: "/trainings", label: "trainings", icon: GraduationCap, roles: ["super_admin", "admin", "hr", "manager", "employee"], requiresCompany: true },
    ],
  },
  {
    id: "timeOff",
    label: "timeOff",
    items: [
      { to: "/leaves", label: "leaves", icon: CalendarDays, roles: ["super_admin", "admin", "hr", "manager", "employee"], requiresCompany: true },
      { to: "/attendance", label: "attendance", icon: Clock, roles: ["super_admin", "admin", "hr", "manager", "employee"], requiresCompany: true },
    ],
  },
  {
    id: "documents",
    label: "documents",
    items: [
      { to: "/documents", label: "documents", icon: FileText, roles: ["super_admin", "admin", "hr", "manager", "employee"], requiresCompany: true },
      { to: "/reports", label: "reports", icon: BarChart3, roles: ["super_admin", "admin", "hr"], requiresCompany: true },
    ],
  },
  {
    id: "platformAdmin",
    label: "platformAdmin",
    items: [
      { to: "/platform", label: "platform", icon: Building2, roles: ["super_admin"] },
    ],
  },
  {
    id: "administration",
    label: "administration",
    items: [
      { to: "/admin", label: "admin", icon: Settings2, roles: ["super_admin", "admin"] },
      { to: "/invitations", label: "invitations", icon: Mail, roles: ["super_admin", "admin"], requiresCompany: true },
      { to: "/billing", label: "billing", icon: CreditCard, roles: ["super_admin", "admin"], requiresCompany: true },
    ],
  },
  {
    id: "personal",
    label: "personal",
    items: [
      { to: "/profile", label: "profile", icon: UserCircle2, roles: ["super_admin", "admin", "hr", "manager", "employee", "candidate"] },
      { to: "/jobs", label: "publicJobs", icon: Globe2, roles: ["candidate"] },
    ],
  },
];

function NavLink({ item, onNavigate, active }: { item: NavItem; onNavigate?: () => void; active: boolean }) {
  const { t } = useI18n();
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{t[item.label] as string}</span>
    </Link>
  );
}

function CompanySwitcher() {
  const { activeCompanyId, switchCompany } = useAuth();
  const { t } = useI18n();
  const companies = db.companies.all();
  const current = activeCompanyId ? companies.find((c) => c.id === activeCompanyId) : null;
  return (
    <div className="border-b border-sidebar-border p-3">
      <div className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
        {t.switchCompany}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-between gap-2 bg-background/40">
            <span className="flex min-w-0 items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{current?.name ?? t.allCompanies}</span>
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>{t.switchCompany}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => switchCompany(null)}>
            {!activeCompanyId && <Check className="mr-2 h-4 w-4" />}
            {t.allCompanies}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {companies.map((c) => (
            <DropdownMenuItem key={c.id} onClick={() => switchCompany(c.id)}>
              {activeCompanyId === c.id && <Check className="mr-2 h-4 w-4" />}
              <span className="truncate">{c.name}</span>
              <Badge variant="outline" className="ml-auto text-[10px] uppercase">{c.plan}</Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user, activeCompanyId } = useAuth();
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;

  const isSuperAdminNoCo = user.role === "super_admin" && !activeCompanyId;

  const visibleGroups = GROUPS
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => {
        if (!it.roles.includes(user.role)) return false;
        if (isSuperAdminNoCo && it.requiresCompany) return false;
        return true;
      }),
    }))
    .filter((g) => g.items.length > 0);

  const defaultOpen = visibleGroups
    .filter((g) => g.items.some((it) => pathname === it.to || pathname.startsWith(it.to + "/")))
    .map((g) => g.id);

  return (
    <div className="flex flex-col">
      {user.role === "super_admin" && <CompanySwitcher />}

      <Accordion
        type="multiple"
        defaultValue={defaultOpen.length ? defaultOpen : visibleGroups.slice(0, 2).map((g) => g.id)}
        className="px-2 py-2"
      >
        {visibleGroups.map((group) => (
          <AccordionItem key={group.id} value={group.id} className="border-b-0">
            <AccordionTrigger className="rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60 hover:bg-sidebar-accent/30 hover:no-underline">
              {(t.navGroups as Record<string, string>)[group.label] ?? group.label}
            </AccordionTrigger>
            <AccordionContent className="pb-1 pt-0">
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(item.to + "/");
                  return <NavLink key={item.to} item={item} onNavigate={onNavigate} active={active} />;
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
