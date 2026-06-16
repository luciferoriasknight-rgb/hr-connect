# RHConnect

Plateforme RH multi-entreprises (recrutement, employés, congés, présences,
performances, formations, documents, paie & facturation).

Stack : **TanStack Start v1** (React 19 + Vite 7) · TypeScript · Tailwind v4 · shadcn/ui.

---

## Créer un projet Vite + React + TanStack Start en ligne de commande

> Pré-requis : Node.js ≥ 20, `npm` (ou `pnpm` / `bun` / `yarn`).

### 1. Méthode rapide (recommandée) — starter officiel TanStack Start

```cmd
:: 1. Créer le projet à partir du starter officiel
npx create-tsrouter-app@latest mon-app --template file-router --tailwind

:: 2. Entrer dans le dossier
cd mon-app

:: 3. Installer les dépendances
npm install

:: 4. Lancer le serveur de développement
npm run dev
```

Le projet est dispo sur http://localhost:3000.

### 2. Méthode manuelle — Vite + React + TanStack Router

```cmd
:: 1. Scaffolder un projet Vite + React + TypeScript
npm create vite@latest mon-app -- --template react-ts

:: 2. Aller dans le dossier
cd mon-app

:: 3. Installer les dépendances de base
npm install

:: 4. Ajouter TanStack Router et son plugin Vite
npm install @tanstack/react-router
npm install -D @tanstack/router-plugin @tanstack/router-devtools

:: 5. (Optionnel) TanStack Query
npm install @tanstack/react-query

:: 6. (Optionnel) Tailwind v4
npm install -D tailwindcss @tailwindcss/vite

:: 7. Lancer
npm run dev
```

Puis activer le plugin dans `vite.config.ts` :

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tailwindcss()],
});
```

### 3. Variante SSR/Full-stack — TanStack **Start**

```cmd
npm create @tanstack/start@latest mon-app
cd mon-app
npm install
npm run dev
```

### Scripts utiles

```cmd
npm run dev       :: serveur de développement
npm run build     :: build de production
npm run preview   :: prévisualiser le build
npm run lint      :: ESLint
```

---

## Lancer ce projet (RHConnect)

```cmd
npm install
npm run dev
```

Comptes de démonstration (seedés au premier lancement) :

| Rôle         | Email                  | Mot de passe |
|--------------|------------------------|--------------|
| super_admin  | owner@rhconnect.io     | owner123     |
| admin        | admin@acme.fr          | admin123     |
| hr           | sophie@acme.fr         | rh123        |
| manager      | thomas@acme.fr         | manager123   |
| employee     | lucas@acme.fr          | emp123       |
| candidate    | candidat@example.com   | cand123      |

Documentation complète : voir [`Documentation.md`](./Documentation.md).
