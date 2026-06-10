import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { db, makeInviteCode, read, seedIfEmpty, uid, write } from "./storage";
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
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const Ctx = createContext<AuthCtx | null>(null);
const SESSION_KEY = "hr.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedIfEmpty();
    const id = read<string | null>(SESSION_KEY, null);
    if (id) {
      const u = db.users.all().find((x) => x.id === id);
      if (u) setUser(u);
    }
    setLoading(false);
  }, []);

  const company = user?.companyId ? db.companies.get(user.companyId) ?? null : null;

  const login = async (email: string, password: string) => {
    const u = db.users.all().find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) throw new Error("Identifiants invalides");
    write(SESSION_KEY, u.id);
    setUser(u);
    db.audit.log({ companyId: u.companyId, userId: u.id, userName: u.fullName, action: "login", entity: "auth" });
    return u;
  };

  const register: AuthCtx["register"] = async (input) => {
    const users = db.users.all();
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
    } else {
      role = "candidate";
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
    users.push(u);
    db.users.save(users);
    write(SESSION_KEY, u.id);
    setUser(u);
    db.audit.log({ companyId, userId: u.id, userName: u.fullName, action: "register:" + input.mode, entity: "auth" });
    return u;
  };

  const logout = () => {
    if (user) db.audit.log({ companyId: user.companyId, userId: user.id, userName: user.fullName, action: "logout", entity: "auth" });
    write(SESSION_KEY, null);
    setUser(null);
  };

  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);

  return (
    <Ctx.Provider value={{ user, company, loading, login, register, logout, hasRole }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
