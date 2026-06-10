import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import type { Company } from "@/lib/types";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — RHConnect" },
      { name: "description", content: "Connectez-vous ou créez votre entreprise sur RHConnect." },
    ],
  }),
  component: AuthPage,
});

const DEMOS = [
  { role: "Super admin", email: "owner@rhconnect.io", password: "owner123" },
  { role: "Admin entreprise", email: "admin@acme.fr", password: "admin123" },
  { role: "RH", email: "sophie@acme.fr", password: "rh123" },
  { role: "Manager", email: "thomas@acme.fr", password: "manager123" },
  { role: "Employé", email: "lucas@acme.fr", password: "emp123" },
  { role: "Candidat", email: "candidat@example.com", password: "cand123" },
];

type RegMode = "create" | "join" | "candidate";

function AuthPage() {
  const { login, register } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<RegMode>("create");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState<Company["size"]>("11-50");
  const [country, setCountry] = useState("France");
  const [inviteCode, setInviteCode] = useState("");

  const go = (role: string) => {
    if (role === "candidate") navigate({ to: "/jobs" });
    else navigate({ to: "/dashboard" });
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success("Connecté");
      go(u.role);
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
      let u;
      if (mode === "create") {
        if (!companyName.trim()) throw new Error("Nom d'entreprise requis");
        u = await register({ mode: "create", email, password, fullName, companyName, industry, size, country });
        toast.success(`Entreprise "${companyName}" créée 🎉`);
      } else if (mode === "join") {
        if (!inviteCode.trim()) throw new Error("Code d'invitation requis");
        u = await register({ mode: "join", email, password, fullName, inviteCode });
        toast.success("Vous avez rejoint l'entreprise");
      } else {
        u = await register({ mode: "candidate", email, password, fullName });
        toast.success("Compte candidat créé");
      }
      go(u.role);
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
      {/* Visual side */}
      <div className="relative hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.35_0.18_290)] p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">{t.appName}</span>
          </Link>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance">
            La plateforme RH multi-entreprises.
          </h1>
          <p className="max-w-md text-white/80">
            Créez votre espace en quelques secondes. Invitez votre équipe via un code. Centralisez votre RH.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            {["Multi-tenant", "Recrutement", "Performances", "Reporting"].map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">{tag}</span>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-white/60">© {new Date().getFullYear()} {t.appName}</div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour à l'accueil
          </Link>

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
                <RadioGroup
                  value={mode}
                  onValueChange={(v) => setMode(v as RegMode)}
                  className="grid grid-cols-1 gap-2"
                >
                  {[
                    { v: "create", t: t.createCompany, d: "Vous créez votre espace entreprise et en devenez l'administrateur." },
                    { v: "join", t: t.joinCompany, d: "Vous rejoignez votre entreprise avec un code d'invitation." },
                    { v: "candidate", t: t.asCandidate, d: "Vous souhaitez postuler aux offres publiques." },
                  ].map((opt) => (
                    <label
                      key={opt.v}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                        mode === opt.v ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={opt.v} className="mt-0.5" />
                      <div>
                        <div className="font-medium">{opt.t}</div>
                        <div className="text-xs text-muted-foreground">{opt.d}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

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

                {mode === "create" && (
                  <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
                    <div className="space-y-2">
                      <Label htmlFor="cname">{t.companyName}</Label>
                      <Input id="cname" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ex. Acme Corp" required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>{t.industry}</Label>
                        <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Tech, Finance…" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.companySize}</Label>
                        <Select value={size} onValueChange={(v) => setSize(v as Company["size"])}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {(["1-10", "11-50", "51-200", "201-1000", "1000+"] as const).map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t.country}</Label>
                      <Input value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>
                  </div>
                )}

                {mode === "join" && (
                  <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                    <Label htmlFor="invite">{t.inviteCode}</Label>
                    <Input id="invite" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="Ex. ACME2026" required />
                    <p className="text-[11px] text-muted-foreground">
                      Codes démo : <span className="font-mono">ACME2026</span> · <span className="font-mono">GLOBEX26</span>
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>{t.signUp}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <Card className="mt-6 border-dashed">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> {t.demoAccounts}
              </div>
              <div className="space-y-1">
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
