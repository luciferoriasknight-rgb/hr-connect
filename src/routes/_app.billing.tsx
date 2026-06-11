import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Smartphone, Plus, Trash2, CheckCircle2, Receipt } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, uid } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import type { PaymentMethod, PaymentMethodType } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/billing")({
  head: () => ({ meta: [{ title: "Facturation — RHConnect" }] }),
  component: Page,
});

const METHOD_LABELS: Record<PaymentMethodType, string> = {
  card: "Carte bancaire",
  orange_money: "Orange Money",
  mtn_momo: "MTN Mobile Money",
  wave: "Wave",
  moov_money: "Moov Money",
  paypal: "PayPal",
};

function Page() {
  const { t } = useI18n();
  const [methods, setMethods] = useState<PaymentMethod[]>(() => db.paymentMethods.all());
  const [payments] = useState(() => db.payments.all());
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<PaymentMethodType>("card");
  const [holder, setHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [phone, setPhone] = useState("");

  const refresh = () => setMethods(db.paymentMethods.all());

  const add = () => {
    if (!holder.trim()) return toast.error("Titulaire requis");
    const isCard = type === "card";
    const isMobile = ["orange_money", "mtn_momo", "wave", "moov_money"].includes(type);
    if (isCard && (!cardNumber || cardNumber.replace(/\s/g, "").length < 12 || !expiry || !cvc)) {
      return toast.error("Informations carte incomplètes");
    }
    if (isMobile && !phone) return toast.error("Téléphone requis");
    const pm: PaymentMethod = {
      id: uid(),
      type,
      label: METHOD_LABELS[type],
      holder,
      last4: isCard ? cardNumber.replace(/\s/g, "").slice(-4) : undefined,
      expiry: isCard ? expiry : undefined,
      phone: isMobile ? phone : undefined,
      isDefault: methods.length === 0,
      createdAt: new Date().toISOString(),
    };
    db.paymentMethods.save([pm, ...db.paymentMethods.all()]);
    refresh();
    setOpen(false);
    setHolder(""); setCardNumber(""); setExpiry(""); setCvc(""); setPhone("");
    toast.success("Moyen de paiement ajouté");
  };

  const setDefault = (m: PaymentMethod) => {
    db.paymentMethods.save(db.paymentMethods.all().map((x) => ({ ...x, isDefault: x.id === m.id })));
    refresh();
    toast.success("Moyen par défaut mis à jour");
  };

  const remove = (m: PaymentMethod) => {
    if (!confirm("Supprimer ce moyen de paiement ?")) return;
    db.paymentMethods.save(db.paymentMethods.all().filter((x) => x.id !== m.id));
    refresh();
  };

  return (
    <AppShell title={t.billing}>
      <PageHeader title={t.billing} subtitle="Moyens de paiement, factures et abonnement." />

      <Tabs defaultValue="methods">
        <TabsList>
          <TabsTrigger value="methods">{t.paymentMethods}</TabsTrigger>
          <TabsTrigger value="invoices">{t.invoices}</TabsTrigger>
          <TabsTrigger value="plan">{t.plan}</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" />{t.addPayment}</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Ajouter un moyen de paiement</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as PaymentMethodType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(METHOD_LABELS) as PaymentMethodType[]).map((k) => (
                          <SelectItem key={k} value={k}>{METHOD_LABELS[k]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Titulaire</Label><Input value={holder} onChange={(e) => setHolder(e.target.value)} /></div>
                  {type === "card" && (
                    <>
                      <div className="space-y-1.5"><Label>Numéro de carte</Label><Input maxLength={19} placeholder="4242 4242 4242 4242" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5"><Label>Expiration</Label><Input placeholder="MM/AA" value={expiry} onChange={(e) => setExpiry(e.target.value)} /></div>
                        <div className="space-y-1.5"><Label>CVC</Label><Input maxLength={4} value={cvc} onChange={(e) => setCvc(e.target.value)} /></div>
                      </div>
                    </>
                  )}
                  {["orange_money", "mtn_momo", "wave", "moov_money"].includes(type) && (
                    <div className="space-y-1.5"><Label>Numéro mobile</Label><Input placeholder="+225 0102030405" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>{t.cancel}</Button>
                  <Button onClick={add}>{t.save}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {methods.map((m) => {
              const isCard = m.type === "card";
              return (
                <Card key={m.id} className={m.isDefault ? "border-primary" : ""}>
                  <CardContent className="flex items-start justify-between gap-3 p-5">
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {isCard ? <CreditCard className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-semibold">
                          {m.label}
                          {m.isDefault && <Badge variant="secondary">Par défaut</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">{m.holder}</div>
                        <div className="mt-1 font-mono text-xs text-muted-foreground">
                          {isCard ? `•••• •••• •••• ${m.last4} — exp ${m.expiry}` : m.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!m.isDefault && <Button size="sm" variant="ghost" onClick={() => setDefault(m)}><CheckCircle2 className="h-4 w-4" /></Button>}
                      <Button size="sm" variant="ghost" onClick={() => remove(m)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {methods.length === 0 && (
              <Card className="md:col-span-2"><CardContent className="p-10 text-center text-sm text-muted-foreground">Aucun moyen de paiement</CardContent></Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50"><tr className="text-left">
                  <th className="p-3 font-medium">N° facture</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium">Montant</th>
                  <th className="p-3 font-medium">Méthode</th>
                  <th className="p-3 font-medium">Statut</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3"></th>
                </tr></thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="p-3 font-mono text-xs">{p.invoiceNumber}</td>
                      <td className="p-3">{p.description}</td>
                      <td className="p-3 font-semibold">{p.amount} {p.currency}</td>
                      <td className="p-3 text-muted-foreground">{METHOD_LABELS[p.method]}</td>
                      <td className="p-3"><Badge variant={p.status === "succeeded" ? "default" : p.status === "pending" ? "secondary" : "destructive"}>{p.status}</Badge></td>
                      <td className="p-3 text-muted-foreground">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="p-3 text-right"><Button size="sm" variant="ghost"><Receipt className="h-4 w-4" /></Button></td>
                    </tr>
                  ))}
                  {payments.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-sm text-muted-foreground">Aucune facture</td></tr>}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Plan actuel</div>
              <div className="mt-1 text-3xl font-bold">Pro</div>
              <p className="mt-2 text-sm text-muted-foreground">Facturé mensuellement — prochain prélèvement le 1er du mois.</p>
              <div className="mt-5 flex gap-2">
                <Button>Mettre à niveau</Button>
                <Button variant="outline">Voir les plans</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
