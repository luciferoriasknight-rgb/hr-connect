import { useState } from "react";
import { LandingShell } from "@/components/landing-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { getLanding } from "@/lib/landing-content";

function Page() {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message envoyé ! Nous vous répondrons sous 24h.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };
  return (
    <LandingShell>
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Contact</Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">Parlons de votre projet RH</h1>
          <p className="mt-4 text-muted-foreground">Notre équipe répond sous 24h.</p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-5">
          <Card className="bg-card/70 backdrop-blur md:col-span-3">
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Nom</Label><Input required maxLength={100} /></div>
                  <div className="space-y-1.5"><Label>Email</Label><Input type="email" required maxLength={255} /></div>
                </div>
                <div className="space-y-1.5"><Label>Entreprise</Label><Input maxLength={100} /></div>
                <div className="space-y-1.5"><Label>Message</Label><Textarea required rows={5} maxLength={1000} /></div>
                <Button type="submit" disabled={submitting} size="lg">{submitting ? "Envoi..." : "Envoyer"}</Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-4 md:col-span-2">
            {(() => {
              const { contact } = getLanding();
              return [
                { icon: Mail, title: "Email", value: contact.email },
                { icon: Phone, title: "Téléphone", value: contact.phone },
                { icon: MapPin, title: "Adresse", value: contact.address },
              ];
            })().map(({ icon: Icon, title, value }) => (
              <Card key={title} className="bg-card/70 backdrop-blur">
                <CardContent className="flex items-start gap-3 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="text-sm text-muted-foreground">{value}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </LandingShell>
  );
}

export default Page;
