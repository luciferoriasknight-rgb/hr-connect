import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/PortfolioPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLA Victoria Dicone — Développeur Fullstack | Lord-Coding" },
      { name: "description", content: "Portfolio d'OLA Victoria Dicone (Lord-Coding) — développeur fullstack web & mobile basé à Pointe-Noire, Congo. React, Next.js, Laravel, React Native." },
      { property: "og:title", content: "OLA Victoria Dicone — Lord-Coding" },
      { property: "og:description", content: "Développeur fullstack — React, Next.js, Laravel, Node.js, React Native." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "OLA Victoria Dicone — Lord-Coding" },
      { name: "twitter:description", content: "Développeur fullstack — web & mobile." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "OLA Victoria Dicone",
        alternateName: "Lord-Coding",
        jobTitle: "Développeur Fullstack",
        url: "/",
        address: { "@type": "PostalAddress", addressLocality: "Pointe-Noire", addressCountry: "CG" },
        sameAs: [
          "https://github.com/Lord-Coding",
          "https://linkedin.com/in/lord-coding",
        ],
      }),
    }],
  }),
  component: Page,
});
