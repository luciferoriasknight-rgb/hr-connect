import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { db, makeInviteCode, read, seedIfEmpty, setActiveCompanyId, getActiveCompanyId, uid, write, notify } from "./storage";
import type { Company, Role, User } from "./types";

type RegisterInput =
  | { mode: "candidate"; email: string; password: string; fullName: string }
  | { mode: "join"; email: string; password: string; fullName: string; inviteCode: string }
  | {
      mode: "create";
      email: string;
      password: string;
      fullName: string;
      companyName: string;
      industry?: string;
      size?: Company["size"];
      country?: string;
    };

interface AuthCtx {
  user: User | null;
  company: Company | null;
  activeCompanyId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
  /** Super admin only: switch the active company context (or clear with null) */
  switchCompany: (id: string | null) => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const SESSION_KEY = "hr.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedIfEmpty();
    const id = read<string | null>(SESSION_KEY, null);
    if (id) {
      const u = db.users.raw().find((x) => x.id === id);
      if (u) {
        setUser(u);
        // Restore scope
        if (u.role === "super_admin") {
          setActiveCompanyIdState(getActiveCompanyId());
        } else if (u.companyId) {
          setActiveCompanyId(u.companyId);
          setActiveCompanyIdState(u.companyId);
        } else {
          setActiveCompanyId(null);
          setActiveCompanyIdState(null);
        }
      }
    }
    setLoading(false);
  }, []);

  const company = activeCompanyId ? db.companies.get(activeCompanyId) ?? null : null;

  const login = async (email: string, password: string) => {
    const u = db.users.raw().find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) throw new Error("Identifiants invalides");
    write(SESSION_KEY, u.id);
    setUser(u);
    if (u.role === "super_admin") {
      setActiveCompanyId(null);
      setActiveCompanyIdState(null);
    } else {
      setActiveCompanyId(u.companyId ?? null);
      setActiveCompanyIdState(u.companyId ?? null);
    }
    db.audit.log({ companyId: u.companyId, userId: u.id, userName: u.fullName, action: "login", entity: "auth" });
    return u;
  };

  const register: AuthCtx["register"] = async (input) => {
    const users = db.users.raw();
    if (users.find((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error("Email déjà utilisé");
    }

    let role: Role = "candidate";
    let companyId: string | undefined;

    if (input.mode === "create") {
      const slug = input.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "company";
      const co: Company = {
        id: "co_" + uid(),
        name: input.companyName,
        slug,
        inviteCode: makeInviteCode(),
        industry: input.industry,
        size: input.size,
        country: input.country,
        plan: "free",
        createdAt: new Date().toISOString(),
      };
      db.companies.save([co, ...db.companies.all()]);
      companyId = co.id;
      role = "admin";
    } else if (input.mode === "join") {
      const co = db.companies.byInvite(input.inviteCode.trim());
      if (!co) throw new Error("Code d'invitation invalide");
      companyId = co.id;
      role = "employee";
    }

    const u: User = {
      id: uid(),
      email: input.email,
      password: input.password,
      fullName: input.fullName,
      role,
      companyId,
      createdAt: new Date().toISOString(),
    };
    // Bypass scope for user creation
    write(db.KEYS.users, [u, ...users]);
    write(SESSION_KEY, u.id);
    setUser(u);
    setActiveCompanyId(companyId ?? null);
    setActiveCompanyIdState(companyId ?? null);
    db.audit.log({ companyId, userId: u.id, userName: u.fullName, action: "register:" + input.mode, entity: "auth" });

    if (companyId) {
      notify({
        companyId,
        userId: u.id,
        title: input.mode === "create" ? "Bienvenue sur RHConnect 🎉" : "Bienvenue dans l'équipe",
        message: input.mode === "create"
          ? "Votre espace est prêt. Invitez votre équipe via le code d'invitation."
          : "Vous avez rejoint l'entreprise avec succès.",
        type: "success",
      });
    }
    return u;
  };

  const logout = () => {
    if (user) db.audit.log({ companyId: user.companyId, userId: user.id, userName: user.fullName, action: "logout", entity: "auth" });
    write(SESSION_KEY, null);
    setActiveCompanyId(null);
    setActiveCompanyIdState(null);
    setUser(null);
  };

  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);

  const switchCompany = (id: string | null) => {
    if (!user || user.role !== "super_admin") return;
    setActiveCompanyId(id);
    setActiveCompanyIdState(id);
  };

  return (
    <Ctx.Provider value={{ user, company, activeCompanyId, loading, login, register, logout, hasRole, switchCompany }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
