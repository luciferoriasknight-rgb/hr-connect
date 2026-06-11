import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Briefcase, Users, UserSearch, CalendarDays, FileText,
  BarChart3, Settings2, ClipboardCheck, GraduationCap, Network, Clock,
  Target, UserCircle2, Globe2, Mail, CreditCard, Bell,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: keyof ReturnType<typeof useI18n>["t"];
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "dashboard", icon: LayoutDashboard, roles: ["super_admin", "admin", "hr", "manager", "employee"] },
  { to: "/offers", label: "offers", icon: Briefcase, roles: ["super_admin", "admin", "hr", "manager"] },
  { to: "/candidates", label: "candidates", icon: UserSearch, roles: ["super_admin", "admin", "hr", "manager"] },
  { to: "/interviews", label: "interviews", icon: ClipboardCheck, roles: ["super_admin", "admin", "hr", "manager"] },
  { to: "/employees", label: "employees", icon: Users, roles: ["super_admin", "admin", "hr", "manager"] },
  { to: "/org", label: "org", icon: Network, roles: ["super_admin", "admin", "hr", "manager", "employee"] },
  { to: "/leaves", label: "leaves", icon: CalendarDays, roles: ["super_admin", "admin", "hr", "manager", "employee"] },
  { to: "/attendance", label: "attendance", icon: Clock, roles: ["super_admin", "admin", "hr", "manager", "employee"] },
  { to: "/performance", label: "performance", icon: Target, roles: ["super_admin", "admin", "hr", "manager", "employee"] },
  { to: "/trainings", label: "trainings", icon: GraduationCap, roles: ["super_admin", "admin", "hr", "manager", "employee"] },
  { to: "/documents", label: "documents", icon: FileText, roles: ["super_admin", "admin", "hr", "manager", "employee"] },
  { to: "/reports", label: "reports", icon: BarChart3, roles: ["super_admin", "admin", "hr"] },
  { to: "/invitations", label: "invitations", icon: Mail, roles: ["super_admin", "admin"] },
  { to: "/notifications", label: "notifications", icon: Bell, roles: ["super_admin", "admin", "hr", "manager", "employee", "candidate"] },
  { to: "/billing", label: "billing", icon: CreditCard, roles: ["super_admin", "admin"] },
  { to: "/admin", label: "admin", icon: Settings2, roles: ["super_admin", "admin"] },
  { to: "/profile", label: "profile", icon: UserCircle2, roles: ["super_admin", "admin", "hr", "manager", "employee", "candidate"] },
  { to: "/jobs", label: "publicJobs", icon: Globe2, roles: ["candidate"] },
];

export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;
  const items = NAV.filter((n) => n.roles.includes(user.role));

  return (
    <nav className="flex flex-col gap-0.5 px-2 py-3">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <Link key={item.to} to={item.to} onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{t[item.label] as string}</span>
          </Link>
        );
      })}
    </nav>
  );
}
