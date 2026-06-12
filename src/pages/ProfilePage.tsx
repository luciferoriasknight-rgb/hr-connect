import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { User2, Lock, Settings2, Mail, Phone, MapPin, Briefcase, Building2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { db } from "@/lib/storage";

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();

  const employee = user?.employeeId ? db.employees.raw().find((e) => e.id === user.employeeId) : null;
  const dept = employee ? db.departments.raw().find((d) => d.id === employee.departmentId) : null;
  const company = user?.companyId ? db.companies.get(user.companyId) : null;

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(employee?.phone ?? "");
  const [address, setAddress] = useState(employee?.address ?? "");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  if (!user) return null;
  const initials = user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const onSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, email, phone, address });
    toast.success(t.profileUpdated);
  };

  const onChangePwd = (e: FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) return toast.error("Les mots de passe ne correspondent pas");
    try {
      changePassword(currentPwd, newPwd);
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      toast.success(t.passwordUpdated);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <AppShell title={t.profile}>
      <PageHeader title={t.profileTitle} subtitle={t.profileSubtitle} />

      {/* Identity card */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent" />
        <CardContent className="-mt-12 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-2xl font-semibold text-primary-foreground shadow">
                {initials}
              </div>
              <div className="min-w-0 pb-1">
                <h2 className="truncate text-xl font-semibold">{user.fullName}</h2>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{t.roles[user.role]}</Badge>
                  {company && <Badge variant="outline" className="gap-1"><Building2 className="h-3 w-3" />{company.name}</Badge>}
                  {employee && <Badge variant="outline" className="gap-1"><Briefcase className="h-3 w-3" />{employee.position}</Badge>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
          <TabsTrigger value="info" className="gap-1.5"><User2 className="h-4 w-4" /><span className="hidden sm:inline">{t.personalInfo}</span></TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><Lock className="h-4 w-4" /><span className="hidden sm:inline">{t.security}</span></TabsTrigger>
          <TabsTrigger value="prefs" className="gap-1.5"><Settings2 className="h-4 w-4" /><span className="hidden sm:inline">{t.preferences}</span></TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <form onSubmit={onSaveProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={t.fullName} icon={User2}>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </Field>
                    <Field label={t.email} icon={Mail}>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Field>
                    <Field label={t.phone} icon={Phone}>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 6 12 34 56 78" />
                    </Field>
                    <Field label={t.address} icon={MapPin}>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="—" />
                    </Field>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">{t.save}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {employee && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-sm font-semibold">{t.position}</h3>
                  <dl className="space-y-3 text-sm">
                    <Info label={t.position} value={employee.position} />
                    <Info label={t.department} value={dept?.name ?? "—"} />
                    <Info label={t.contract} value={employee.contractType} />
                    <Info label="Date d'embauche" value={new Date(employee.hireDate).toLocaleDateString()} />
                    <Info label={t.leaveBalance} value={`${employee.leaveBalance} j`} />
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="max-w-xl">
            <CardContent className="p-6">
              <form onSubmit={onChangePwd} className="space-y-4">
                <Field label={t.currentPassword} icon={Lock}>
                  <Input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} required />
                </Field>
                <Field label={t.newPassword} icon={Lock}>
                  <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required minLength={6} />
                </Field>
                <Field label={t.confirmPassword} icon={Lock}>
                  <Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required minLength={6} />
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">{t.changePassword}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prefs" className="mt-4">
          <Card className="max-w-xl">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label className="text-sm font-medium">{t.language}</Label>
                  <p className="text-xs text-muted-foreground">FR / EN</p>
                </div>
                <div className="flex gap-1 rounded-lg border p-0.5">
                  <Button size="sm" variant={lang === "fr" ? "default" : "ghost"} onClick={() => setLang("fr")}>FR</Button>
                  <Button size="sm" variant={lang === "en" ? "default" : "ghost"} onClick={() => setLang("en")}>EN</Button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-t pt-4">
                <div>
                  <Label className="text-sm font-medium">{t.theme}</Label>
                  <p className="text-xs text-muted-foreground">{theme === "dark" ? t.dark : t.light}</p>
                </div>
                <Button size="sm" variant="outline" onClick={toggle}>
                  {theme === "dark" ? t.light : t.dark}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: typeof User2; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </Label>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b pb-2 last:border-0">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
