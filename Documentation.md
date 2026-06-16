# Documentation — RHConnect

> Plateforme RH SaaS **multi-entreprises** (multi-tenant) construite avec
> **TanStack Start v1**, **React 19**, **Vite 7**, **TypeScript**,
> **Tailwind CSS v4** et **shadcn/ui**.

Cette documentation couvre l'architecture, les rôles, les modules
fonctionnels, le stockage des données, le système de notifications et
d'audit, ainsi que les conventions de code à respecter.

---

## 1. Vue d'ensemble

RHConnect centralise toute la chaîne RH d'une entreprise :

- Site public : Landing, Fonctionnalités, Tarifs, À propos, Contact.
- Application authentifiée : Dashboard, Recrutement, Employés, Congés,
  Présences, Performances, Formations, Documents, Reporting.
- Console plateforme (super admin) : entreprises clientes, utilisateurs
  globaux, facturation cross-tenant, édition du contenu public.

L'application fonctionne **100 % côté client** (localStorage) — c'est un
prototype de démonstration. Aucun backend distant n'est requis pour
l'utiliser ; tout l'état est persisté dans le navigateur via une
abstraction `db` (`src/lib/storage.ts`).

---

## 2. Stack technique

| Couche              | Technologie                                        |
|---------------------|----------------------------------------------------|
| Framework           | TanStack Start v1 (SSR + file-based routing)       |
| UI                  | React 19 + shadcn/ui (Radix UI)                    |
| Styles              | Tailwind CSS v4 (`src/styles.css`)                 |
| Build               | Vite 7                                             |
| Routing             | TanStack Router (file-based, `src/routes/`)        |
| Data fetching       | TanStack Query (préparé, peu utilisé en démo)      |
| État global         | React Context (`AuthProvider`, `I18nProvider`,…)   |
| Persistance         | `localStorage` (via `src/lib/storage.ts`)          |
| Notifications UI    | `sonner`                                           |
| Icônes              | `lucide-react`                                     |

---

## 3. Arborescence du projet

```
src/
├── assets/                Images statiques (hero-bg.jpg, …)
├── components/
│   ├── app-nav.tsx        Side-menu (Accordion) + role-based visibility
│   ├── app-shell.tsx      Layout app authentifié (sidebar + header)
│   ├── landing-shell.tsx  Layout public (landing pages)
│   └── ui/                Primitives shadcn (button, card, dialog, …)
├── hooks/                 Hooks utilitaires
├── lib/
│   ├── auth.tsx           AuthProvider, login/register/logout, switchCompany
│   ├── i18n.tsx           Traductions FR/EN
│   ├── theme.tsx          Light/dark
│   ├── landing-content.ts CMS public : draft / publish / discard
│   ├── storage.ts         `db.*` scoped multi-tenant + audit + notify
│   ├── types.ts           Types métier (User, Employee, Attendance, …)
│   ├── utils.ts           cn(), helpers
│   └── export.ts          Export Excel / CSV
├── pages/                 Composants de page (logique UI)
│   ├── IndexPage.tsx              → "/"
│   ├── FeaturesPage / PricingPage / AboutPage / ContactPage
│   ├── AuthPage                   Connexion + inscription multi-step
│   ├── DashboardPage              Tableau de bord (par rôle)
│   ├── EmployeesPage / EmployeesDetailPage
│   ├── JobsPage / CandidatesPage / OffersPage / InterviewsPage
│   ├── LeavesPage / AttendancePage
│   ├── PerformancePage / TrainingsPage / DocumentsPage / OrgPage
│   ├── NotificationsPage / InvitationsPage
│   ├── BillingPage                Facturation entreprise
│   ├── ProfilePage                Profil utilisateur
│   ├── AdminPage / ReportsPage
│   ├── PlatformPage               Console super_admin (cross-tenant)
│   └── LandingContentPage         CMS public (draft/publish)
├── routes/                Wrappers ultra-minces (file-based routing)
│   ├── __root.tsx
│   ├── _app.*.tsx         Routes authentifiées (guard via AppShell)
│   ├── index.tsx, auth.tsx, about.tsx, …
│   └── api/               (réservé aux endpoints publics)
├── router.tsx             Configuration TanStack Router
├── routeTree.gen.ts       AUTO-GÉNÉRÉ — ne pas éditer
└── styles.css             Tokens Tailwind v4 + design system
```

### Convention "routes minces / pages riches"

Chaque fichier sous `src/routes/_app.<name>.tsx` se contente d'importer
le composant correspondant dans `src/pages/` :

```tsx
// src/routes/_app.dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/DashboardPage";

export const Route = createFileRoute("/_app/dashboard")({
  component: Page,
});
```

Cette séparation reproduit l'expérience d'un projet Vite + React
"classique" : on travaille dans `src/pages/` au quotidien, et le
file-routing reste découplé.

---

## 4. Rôles utilisateurs

Six rôles sont définis dans `src/lib/types.ts` (`Role`) :

| Rôle          | Périmètre                                                            |
|---------------|----------------------------------------------------------------------|
| `super_admin` | Plateforme entière. Switch d'entreprise, console multi-tenant, CMS.  |
| `admin`       | Gère sa propre entreprise : utilisateurs, invitations, facturation.  |
| `hr`          | Recrutement, employés, congés, performances, formations.             |
| `manager`     | Voit/valide les présences et congés de son équipe.                   |
| `employee`    | Self-service : pointage, congés perso, formations, documents perso.  |
| `candidate`   | Job board public + suivi de ses candidatures.                        |

### Restrictions notables

- **`employee` sur Attendance** : ne voit jamais le pointage des
  collègues. Seuls son pointage du jour, son historique personnel et
  ses statistiques mensuelles personnelles sont affichés.
- **`super_admin`** : seul à voir le sélecteur d'entreprise (en haut de
  la sidebar) et la console "Platform".
- **`admin`** : gère uniquement les utilisateurs de **sa** companyId.

Le helper `hasRole(...roles)` exposé par `useAuth()` est la primitive
recommandée pour conditionner l'UI.

---

## 5. Multi-tenant (cloisonnement par entreprise)

- Chaque entité métier porte un champ optionnel `companyId`.
- `setActiveCompanyId(id)` détermine la "lentille" courante.
- L'utilitaire `scoped<T>(key)` dans `storage.ts` :
  - Au **read** : filtre les éléments où `companyId === active`.
  - Au **save** : tague automatiquement les éléments sans `companyId`
    et **préserve** les autres tenants pour éviter tout écrasement
    cross-entreprise.
- Le `super_admin` peut basculer librement (impersonation contextuelle)
  via la méthode `switchCompany(id)` de `AuthProvider`.

---

## 6. Authentification & inscription

Implémentée intégralement dans `src/lib/auth.tsx` (localStorage).

Trois modes d'inscription :

1. **Candidat** : pas de companyId, accès au job board uniquement.
2. **Rejoindre une entreprise** : via un code d'invitation
   (`makeInviteCode()` génère un code à 8 caractères).
3. **Créer une entreprise** : l'utilisateur devient `admin` d'une
   nouvelle company (plan `free` par défaut).

L'inscription est gérée **en plusieurs étapes** dans
`src/pages/AuthPage.tsx` pour réduire la friction.

API exposée :

```ts
const { user, company, login, register, logout, hasRole,
        switchCompany, updateProfile, changePassword } = useAuth();
```

---

## 7. Stockage des données (`db.*`)

`src/lib/storage.ts` expose un objet `db` qui regroupe tous les
"repositories" : `companies`, `users`, `employees`, `departments`,
`offers`, `candidates`, `interviews`, `leaves`, `attendance`,
`objectives`, `evaluations`, `trainings`, `documents`, `invitations`,
`notifications`, `paymentMethods`, `payments`, `audit`, `settings`.

Chaque repo expose : `all()` (scopé), `raw()` (non-scopé), `save(list)`,
`get(id)`.

### Seed

`seedIfEmpty()` initialise un jeu de données complet (2 entreprises,
employés, candidats, congés, présences, paiements, …) au premier
lancement et marque la clé `hr.seeded.v3`.

---

## 8. Système de notifications

Module `notify(entry)` (storage.ts) qui pousse un message dans
`hr.notifications`. Une notification cible un `userId` ou est diffusée
à toute une `companyId`. L'UI les affiche dans
`NotificationsPage` et via le compteur dans le header.

Les pages métier produisent des notifications contextuelles :

- Pointage d'arrivée / départ / télétravail → manager + admin + HR.
- Demande de congé → manager direct.
- Nouvelle candidature → recruteurs.
- Changement de plan → admin.

---

## 9. Audit (`db.audit`)

`db.audit.log({ userId, userName, action, entity })` enregistre un
événement horodaté (max 500 conservés). Convention pour `entity` :

```
attendance:<employeeId>
leave:<leaveId>
employee:<employeeId>
...
```

Affichage :

- **AttendancePage → onglet "Journal d'audit"** (admin/hr/manager) :
  liste les check-in / check-out / télétravail avec date, auteur,
  employé concerné et destinataires des notifications.
- **AttendancePage → onglet "Mon historique"** (employee) : l'employé
  voit uniquement ses propres événements.

---

## 10. CMS public (Landing / Pricing / About / Contact)

Géré par `src/lib/landing-content.ts` + page super_admin
`LandingContentPage`.

Deux versions sont persistées :

- `hr.landingContent`        → version **publiée** (vue par les visiteurs).
- `hr.landingContent.draft`  → version **brouillon** (sandbox du super_admin).

API :

```ts
getLanding()             // publié (utilisé par les pages publiques)
getLandingDraft()        // brouillon (utilisé par l'éditeur)
saveLandingDraft(v)      // auto-save brouillon
publishLanding(v?)       // brouillon → publié
discardLandingDraft()    // annuler le brouillon
hasUnpublishedChanges()  // badge "Brouillon non publié"
```

L'éditeur offre :

1. Édition par onglets (Hero / Tarifs / À propos / Contact).
2. **Auto-save brouillon** à chaque frappe.
3. **Aperçu** (Dialog plein écran rendant le brouillon).
4. **Publier** (active la version visible publiquement).
5. **Abandonner** (purge le brouillon).
6. **Défaut** (restaure le contenu d'origine en brouillon).

---

## 11. Paiements & facturation (statiques)

Modélisés dans `types.ts` : `PaymentMethod` (carte, Orange Money, MTN
Mobile Money, Wave, Moov Money, PayPal) et `Payment`. Aucun PSP réel
n'est branché — c'est un simulateur pour la démo.

Pages :

- `BillingPage` (par entreprise) : moyens de paiement, factures,
  changement de plan (upgrade / voir les plans).
- `PlatformPage → onglet Facturation` (super_admin) : agrégat
  cross-tenant, MRR estimé, distribution des plans.

---

## 12. Internationalisation (i18n)

`src/lib/i18n.tsx` expose `useI18n()` avec les locales **fr** et **en**.
Tous les libellés clés transitent par `t.xxx`. Le langue est persistée
dans `hr.lang`.

---

## 13. Thème (light / dark)

`src/lib/theme.tsx`. Persistance dans `hr.theme`. Toggle disponible dans
`ProfilePage → Préférences`.

---

## 14. Accessibilité

- Toutes les actions à icône (boutons "modifier", "voir", …) portent un
  `aria-label` ET un `<Tooltip>` shadcn.
- `TooltipProvider` est monté globalement dans `src/routes/__root.tsx`.
- Couleurs via tokens (`text-foreground`, `bg-background`, …), jamais
  de couleurs Tailwind arbitraires.
- Navigation clavier complète (Radix UI sous le capot).

---

## 15. Conventions de code

- **Pages** dans `src/pages/`, **routes** ultra-minces dans
  `src/routes/`.
- Imports absolus via l'alias `@/` (configuré dans `tsconfig.json`).
- **Ne jamais éditer** `src/routeTree.gen.ts` (auto-généré).
- **Ne jamais hardcoder** de couleurs (`bg-white`, `#ffffff`) — utiliser
  les tokens du design system.
- Tout nouveau composant UI passe par `src/components/ui/*`
  (shadcn).
- Toute action mutative doit :
  1. mettre à jour le store (`db.xxx.save(...)`),
  2. rafraîchir l'état local,
  3. émettre une notification (`toast.success(...)` + `notify(...)` si
     pertinent),
  4. logger l'audit (`db.audit.log(...)`) si l'action a un impact RH.

---

## 16. Comptes de démonstration

| Rôle          | Email                  | Mot de passe |
|---------------|------------------------|--------------|
| super_admin   | owner@rhconnect.io     | owner123     |
| admin (Acme)  | admin@acme.fr          | admin123     |
| hr            | sophie@acme.fr         | rh123        |
| manager       | thomas@acme.fr         | manager123   |
| employee      | lucas@acme.fr          | emp123       |
| candidate     | candidat@example.com   | cand123      |
| admin (Globex)| admin@globex.fr        | admin123     |

---

## 17. Roadmap / Améliorations possibles

- Brancher Lovable Cloud (Supabase) pour persister côté serveur.
- Brancher Stripe / Paddle pour les paiements réels.
- SSO entreprise (SAML, Google Workspace).
- Module Paie complet (bulletins, déclarations).
- API publique (`src/routes/api/public/*`) avec webhooks signés.
- Tests E2E (Playwright) sur les parcours clés.

---

Pour toute question d'architecture, commencer par `src/lib/storage.ts`
(le modèle de données) et `src/components/app-nav.tsx` (la carte des
modules par rôle).
