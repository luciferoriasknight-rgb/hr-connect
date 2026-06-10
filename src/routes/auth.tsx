import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Connexion — RH Suite" }, { name: "description", content: "Connectez-vous à votre plateforme RH." }],
  }),
  component: AuthPage,
});

const DEMOS = [
  { role: "Administrateur", email: "admin@acme.fr", password: "admin123" },
  { role: "RH", email: "sophie@acme.fr", password: "rh123" },
  { role: "Manager", email: "thomas@acme.fr", password: "manager123" },
  { role: "Employé", email: "lucas@acme.fr", password: "emp123" },
  { role: "Candidat", email: "candidat@example.com", password: "cand123" },
];

function AuthPage() {
  const { login, register } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const go = (u: { role: string }) => {
    if (u.role === "candidate" || u.role === "Candidat") navigate({ to: "/jobs" });
    else navigate({ to: "/dashboard" });
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success("Connecté");
      go(u);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await register({ email, password, fullName, role: "candidate" });
      toast.success("Compte créé");
      go(u);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (d: typeof DEMOS[number]) => {
    setEmail(d.email);
    setPassword(d.password);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.35_0.18_280)] lg:flex lg:flex-col lg:justify-between p-12 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">{t.appName}</span>
          </div>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance">
            La plateforme RH moderne pour les équipes ambitieuses.
          </h1>
          <p className="max-w-md text-white/80">
            Centralisez le recrutement, les employés, les congés et les performances dans une expérience unique.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {["Recrutement", "Onboarding", "Performances", "Reporting"].map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">{tag}</span>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-white/60">© {new Date().getFullYear()} {t.appName}</div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold">{t.appName}</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">{t.welcome}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{t.appTagline}</p>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t.signIn}</TabsTrigger>
              <TabsTrigger value="register">{t.signUp}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={onLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{t.signIn}</Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={onRegister} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.fullName}</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email2">{t.email}</Label>
                  <Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password2">{t.password}</Label>
                  <Input id="password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{t.signUp}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <Card className="mt-6 border-dashed">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> {t.demoAccounts}
              </div>
              <div className="space-y-1.5">
                {DEMOS.map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => quickLogin(d)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                  >
                    <span className="font-medium">{d.role}</span>
                    <span className="text-muted-foreground">{d.email}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
