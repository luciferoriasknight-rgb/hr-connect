// Editable landing/marketing content (managed by super_admin)
// Two stores: a published version (used by the public pages) and a draft
// version (edited in the admin console). The draft must be explicitly
// published before it is visible on the public site.
const KEY_PUBLISHED = "hr.landingContent";
const KEY_DRAFT = "hr.landingContent.draft";

export interface LandingPlan {
  name: string;
  price: string;
  per?: string;
  desc: string;
  features: string[];
  cta: string;
  contactCta?: boolean; // if true → CTA links to /contact
  highlight?: boolean;
}

export interface LandingContent {
  hero: { tagline: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  about: { title: string; intro: string; mission: string; values: string; vision: string };
  contact: { email: string; phone: string; address: string };
  pricing: { title: string; subtitle: string; plans: LandingPlan[] };
}

export const DEFAULT_LANDING: LandingContent = {
  hero: {
    tagline: "Plateforme RH nouvelle génération",
    title: "Toute la RH de votre entreprise, enfin sur une seule plateforme.",
    subtitle:
      "Recrutement, employés, congés, paie, performances. RHConnect centralise et automatise vos process RH du premier candidat jusqu'à la retraite.",
    ctaPrimary: "Connexion",
    ctaSecondary: "Voir les fonctionnalités",
  },
  about: {
    title: "La RH moderne, accessible à toutes les entreprises.",
    intro:
      "RHConnect est né d'un constat simple : les outils RH actuels sont soit trop complexes, soit trop limités. Nous avons construit une plateforme qui réunit le meilleur des deux mondes.",
    mission: "Digitaliser toute la chaîne RH, du recrutement au reporting.",
    values: "Transparence, simplicité, et respect des collaborateurs.",
    vision: "Devenir la référence RH pour les équipes ambitieuses.",
  },
  contact: {
    email: "hello@rhconnect.io",
    phone: "+33 1 23 45 67 89",
    address: "1 rue de la Paix, 75002 Paris",
  },
  pricing: {
    title: "Des tarifs simples, à la taille de votre équipe",
    subtitle: "Démarrez gratuitement, montez en puissance quand vous le souhaitez.",
    plans: [
      { name: "Starter", price: "Gratuit", desc: "Pour démarrer.", features: ["Jusqu'à 10 employés", "Recrutement de base", "Congés & présences", "1 administrateur"], cta: "Commencer" },
      { name: "Pro", price: "12€", per: "/ employé / mois", desc: "Pour les équipes en croissance.", features: ["Employés illimités", "Pipeline complet", "Performances & formations", "Reporting avancé", "Multi-administrateurs", "Paiement carte & mobile money"], cta: "Essai 14 jours", highlight: true },
      { name: "Enterprise", price: "Sur devis", desc: "Pour les grandes organisations.", features: ["Multi-entreprises", "SSO & sécurité avancée", "Intégrations sur-mesure", "Support dédié 24/7", "Conformité RGPD"], cta: "Nous contacter", contactCta: true },
    ],
  },
};

function merge(parsed: Partial<LandingContent> | null | undefined): LandingContent {
  if (!parsed) return DEFAULT_LANDING;
  return {
    hero: { ...DEFAULT_LANDING.hero, ...(parsed.hero ?? {}) },
    about: { ...DEFAULT_LANDING.about, ...(parsed.about ?? {}) },
    contact: { ...DEFAULT_LANDING.contact, ...(parsed.contact ?? {}) },
    pricing: {
      ...DEFAULT_LANDING.pricing,
      ...(parsed.pricing ?? {}),
      plans: parsed.pricing?.plans?.length ? parsed.pricing.plans : DEFAULT_LANDING.pricing.plans,
    },
  };
}

function readKey(key: string): LandingContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return merge(JSON.parse(raw) as Partial<LandingContent>);
  } catch {
    return null;
  }
}

/** Returns the PUBLISHED version (what visitors see). */
export function getLanding(): LandingContent {
  return readKey(KEY_PUBLISHED) ?? DEFAULT_LANDING;
}

/** Returns the DRAFT version. Falls back to published, then default. */
export function getLandingDraft(): LandingContent {
  return readKey(KEY_DRAFT) ?? readKey(KEY_PUBLISHED) ?? DEFAULT_LANDING;
}

/** Save a draft (NOT visible on public pages until publish). */
export function saveLandingDraft(v: LandingContent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_DRAFT, JSON.stringify(v));
}

/** Publish the given content (or the current draft if omitted). */
export function publishLanding(v?: LandingContent) {
  if (typeof window === "undefined") return;
  const draft = v ?? getLandingDraft();
  localStorage.setItem(KEY_PUBLISHED, JSON.stringify(draft));
  localStorage.removeItem(KEY_DRAFT);
}

/** Discard the current draft (revert editor to published). */
export function discardLandingDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_DRAFT);
}

/** Whether the draft differs from the published version. */
export function hasUnpublishedChanges(): boolean {
  if (typeof window === "undefined") return false;
  const d = localStorage.getItem(KEY_DRAFT);
  if (!d) return false;
  const p = localStorage.getItem(KEY_PUBLISHED);
  return d !== p;
}

// Backwards-compat: older code that called saveLanding() now writes & publishes.
export function saveLanding(v: LandingContent) {
  publishLanding(v);
}
