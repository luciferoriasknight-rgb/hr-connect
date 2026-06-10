import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { db, read, seedIfEmpty, uid, write } from "./storage";
import type { Role, User } from "./types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: { email: string; password: string; fullName: string; role?: Role }) => Promise<User>;
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

  const login = async (email: string, password: string) => {
    const u = db.users.all().find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) throw new Error("Identifiants invalides");
    write(SESSION_KEY, u.id);
    setUser(u);
    db.audit.log({ userId: u.id, userName: u.fullName, action: "login", entity: "auth" });
    return u;
  };

  const register: AuthCtx["register"] = async ({ email, password, fullName, role = "candidate" }) => {
    const users = db.users.all();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email déjà utilisé");
    }
    const u: User = { id: uid(), email, password, fullName, role, createdAt: new Date().toISOString() };
    users.push(u);
    db.users.save(users);
    write(SESSION_KEY, u.id);
    setUser(u);
    db.audit.log({ userId: u.id, userName: u.fullName, action: "register", entity: "auth" });
    return u;
  };

  const logout = () => {
    if (user) db.audit.log({ userId: user.id, userName: user.fullName, action: "logout", entity: "auth" });
    write(SESSION_KEY, null);
    setUser(null);
  };

  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, hasRole }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
