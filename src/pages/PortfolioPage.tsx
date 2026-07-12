import avatarUrl from "@/assets/avatar.jpg";
import {
  MapPin, Link as LinkIcon, Send, Users,
  Headphones, Wrench, BarChart3, Rocket, Target, Handshake,
  Github, Mail, ExternalLink, Star, Phone, Linkedin, FileText, Circle,
} from "lucide-react";

const skillGroups: { title: string; items: { name: string; color: string }[] }[] = [
  {
    title: "Front-End",
    items: [
      { name: "HTML5", color: "#E34F26" },
      { name: "CSS3", color: "#1572B6" },
      { name: "JavaScript", color: "#F7DF1E" },
      { name: "TypeScript", color: "#3178c6" },
      { name: "React", color: "#61DAFB" },
      { name: "Next.js", color: "#ffffff" },
      { name: "Angular", color: "#DD0031" },
      { name: "Tailwind", color: "#38BDF8" },
      { name: "Bootstrap", color: "#7952B3" },
    ],
  },
  {
    title: "Back-End",
    items: [
      { name: "Node.js", color: "#3C873A" },
      { name: "Express", color: "#ffffff" },
      { name: "Nest.js", color: "#E0234E" },
      { name: "Laravel", color: "#FF2D20" },
      { name: "PHP", color: "#777BB4" },
      { name: "Python", color: "#3776AB" },
      { name: "C++", color: "#00599C" },
      { name: "Prisma", color: "#2D3748" },
    ],
  },
  {
    title: "Mobile",
    items: [
      { name: "React Native", color: "#61DAFB" },
      { name: "Expo", color: "#ffffff" },
      { name: "Ionic", color: "#3880FF" },
      { name: "Android Studio", color: "#3DDC84" },
    ],
  },
  {
    title: "Bases de données",
    items: [
      { name: "PostgreSQL", color: "#336791" },
      { name: "MySQL", color: "#4479A1" },
      { name: "SQLite", color: "#003B57" },
      { name: "MongoDB", color: "#47A248" },
      { name: "Redis", color: "#DC382D" },
      { name: "Firebase", color: "#FFCA28" },
    ],
  },
  {
    title: "Cloud & Déploiement",
    items: [
      { name: "Vercel", color: "#ffffff" },
      { name: "Netlify", color: "#00C7B7" },
      { name: "Heroku", color: "#430098" },
      { name: "Docker", color: "#2496ED" },
      { name: "Git", color: "#F05032" },
      { name: "GitHub", color: "#ffffff" },
      { name: "Linux", color: "#FCC624" },
    ],
  },
  {
    title: "Services & Intégrations",
    items: [
      { name: "Supabase", color: "#3ECF8E" },
      { name: "Cloudinary", color: "#3448C5" },
      { name: "Stripe", color: "#635BFF" },
      { name: "CinetPay", color: "#00B140" },
      { name: "Resend", color: "#ffffff" },
      { name: "OpenAI", color: "#10A37F" },
      { name: "Figma", color: "#F24E1E" },
    ],
  },
];

const allSkillPct = [
  { name: "TypeScript", pct: 28, color: "#3178c6" },
  { name: "JavaScript", pct: 22, color: "#f1e05a" },
  { name: "PHP", pct: 18, color: "#777BB4" },
  { name: "Python", pct: 14, color: "#3572A5" },
  { name: "CSS", pct: 10, color: "#563d7c" },
  { name: "Shell", pct: 8, color: "#89e051" },
];

const projects = [
  { emoji: "🎓", title: "CFI Link", desc: "Plateforme reliant les étudiants du CFI-CIRAS aux opportunités professionnelles. (React · Ionic · Laravel)" },
  { emoji: "🛒", title: "Order Deal", desc: "Suivi et gestion des commandes clients avec système de deals et promotions. (React · Node.js · Express)" },
  { emoji: "👥", title: "RH Connect", desc: "Outil de recrutement RH orienté candidats et recruteurs. (Laravel · React · MySQL)" },
  { emoji: "🏢", title: "Zola-Kimya", desc: "Site institutionnel présentant la mission et les activités de Zola-Kimya. (React · Tailwind · MySQL)" },
  { emoji: "🧑‍💼", title: "Profil RH", desc: "Gestion des profils, congés, évaluations et suivi des effectifs. (React · Node.js · PostgreSQL)" },
  { emoji: "❤️", title: "Bénédicte ONG", desc: "Plateforme de présentation et de collecte de dons pour l'ONG Bénédicte. (React · Next.js · Tailwind)" },
];

const contribGrid = Array.from({ length: 7 * 26 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  const level = r < 0.5 ? 0 : r < 0.72 ? 1 : r < 0.87 ? 2 : r < 0.96 ? 3 : 4;
  return level;
});
const levelColor = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-[#21262d] pb-8 mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
        <Icon className="h-5 w-5 text-[#7ee787]" />
        <span>{title}</span>
      </h2>
      <div className="text-[15px] leading-relaxed text-[#c9d1d9]">{children}</div>
    </section>
  );
}

function SkillPill({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#161b22] px-2.5 py-1 text-xs font-medium text-[#c9d1d9] transition hover:border-[#484f58] hover:-translate-y-0.5"
      style={{ boxShadow: `inset 0 0 0 1px ${color}22` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {name}
    </span>
  );
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Top nav bar */}
      <div className="border-b border-[#21262d] bg-[#010409]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
              <Github className="h-4 w-4 text-white" />
            </div>
            <span className="font-mono text-sm font-semibold text-white">Lord-Coding</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-[#7d8590]">
            <span className="hidden sm:inline">/ README.md</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-8 md:grid-cols-[296px_1fr]">
          {/* LEFT SIDEBAR */}
          <aside className="space-y-5">
            <div className="relative">
              <div className="overflow-hidden rounded-full ring-1 ring-[#30363d]">
                <img
                  src={avatarUrl}
                  alt="OLA Victoria Dicone"
                  width={296}
                  height={296}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <span
                aria-label="Disponible"
                className="absolute bottom-3 right-3 h-6 w-6 rounded-full border-4 border-[#0d1117]"
                style={{ background: "#3fb950" }}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">OLA Victoria Dicone</h1>
              <p className="text-lg text-[#7d8590]">Lord-Coding · he/him</p>
            </div>

            <p className="text-[15px] text-[#c9d1d9]">
              Développeur Fullstack — Licence Informatique (Génie Logiciel). Web & mobile, de l'UI à l'API. 🚀
            </p>

            <a
              href="/cv-lord.pdf"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] py-1.5 text-sm font-medium text-white hover:bg-[#30363d]"
            >
              <FileText className="h-4 w-4" /> Télécharger le CV
            </a>

            <div className="flex items-center gap-2 text-sm text-[#7d8590]">
              <Users className="h-4 w-4" />
              <span><span className="font-semibold text-white">3+</span> ans</span>
              <span>·</span>
              <span><span className="font-semibold text-white">10+</span> projets</span>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-[#c9d1d9]"><MapPin className="h-4 w-4 text-[#7d8590]" /> Pointe-Noire, Congo 🇨🇬</li>
              <li className="flex items-center gap-2 text-[#c9d1d9]"><Circle className="h-4 w-4 text-[#7d8590]" /> Stagiaire @ Zola-Kimya</li>
              <li className="flex items-center gap-2 text-[#c9d1d9]"><Phone className="h-4 w-4 text-[#7d8590]" /> +242 06 433 5097</li>
              <li className="flex items-center gap-2 text-[#58a6ff] hover:underline">
                <LinkIcon className="h-4 w-4 text-[#7d8590]" />
                <a href="https://github.com/Lord-Coding" target="_blank" rel="noreferrer">github.com/Lord-Coding</a>
              </li>
            </ul>

            {/* Achievements */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#c9d1d9]">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { emoji: "🎓", ring: "#3fb950" },
                  { emoji: "💼", ring: "#58a6ff" },
                  { emoji: "🏆", ring: "#e3b341" },
                ].map((a, i) => (
                  <div key={i} className="grid h-11 w-11 place-items-center rounded-full text-xl" style={{ background: `radial-gradient(circle at 30% 30%, ${a.ring}, #161b22 80%)` }}>
                    <span>{a.emoji}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#c9d1d9]">Highlights</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-[#c9d1d9]">
                  <span className="grid h-5 w-5 place-items-center rounded bg-[#1f6feb] text-[10px] font-bold text-white">L</span>
                  Licence Informatique — CFI-CIRAS
                </li>
                <li className="flex items-center gap-2 text-[#c9d1d9]">
                  <Star className="h-4 w-4 text-[#f1e05a]" />
                  <span className="rounded bg-[#1f2937] px-1.5 text-xs font-bold text-[#f0883e]">DISPO</span>
                </li>
              </ul>
            </div>

            {/* Organizations */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#c9d1d9]">Organizations</h3>
              <div className="flex flex-wrap gap-2">
                {["ZK", "CFI"].map((o, i) => (
                  <div key={i} className="grid h-8 w-8 place-items-center rounded-md bg-[#161b22] text-xs font-bold text-white ring-1 ring-[#30363d]">
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN — README */}
          <main>
            <div className="rounded-md border border-[#30363d]">
              <div className="flex items-center justify-between border-b border-[#21262d] px-4 py-2 text-xs text-[#7d8590]">
                <div className="flex items-center gap-2">
                  <span className="font-mono">Lord-Coding / README<span className="text-[#7d8590]">.md</span></span>
                </div>
                <button className="text-[#7d8590] hover:text-white">✏️</button>
              </div>

              <div className="p-6 md:p-10">
                {/* Title */}
                <div className="mb-8 text-center">
                  <h1 className="mb-3 flex flex-wrap items-center justify-center gap-3 text-3xl font-bold text-white md:text-4xl">
                    <span>👋</span>
                    <span>Salut, je suis OLA Victoria Dicone</span>
                  </h1>
                  <p className="italic text-[#7d8590]">
                    $ whoami — <span className="not-italic text-[#7ee787]">Lord-sama ▌</span>
                  </p>
                  <p className="mt-3 text-[#c9d1d9]">
                    Développeur fullstack diplômé en Licence Informatique (Génie-Logiciel), je conçois des applications
                    web et mobiles modernes — de l'interface à l'API. Curieux, rigoureux et obsédé par l'UX. ✨
                  </p>
                  <div className="mt-5 flex justify-center">
                    <div className="grid h-16 w-16 place-items-center rounded-lg bg-gradient-to-br from-[#3178c6] to-[#61DAFB] text-3xl shadow-lg">
                      ⚡
                    </div>
                  </div>
                </div>

                {/* Vibe */}
                <Section icon={Headphones} title="À propos">
                  <p className="italic text-[#7d8590]">
                    🇨🇬 Pointe-Noire · 🎧 Curieux · 💻 Rigoureux
                  </p>
                  <p className="mt-2">
                    Originaire et résidant à <span className="text-white font-semibold">Pointe-Noire, République du Congo</span>,
                    récemment diplômé au CFI-CIRAS. Actuellement <span className="text-white font-semibold">stagiaire chez
                    Zola-Kimya</span>, je contribue à la conception et au développement de plateformes web/mobiles
                    aux côtés d'une équipe agile.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { v: "3+", l: "Années de pratique" },
                      { v: "10+", l: "Projets réalisés" },
                      { v: "25+", l: "Technos maîtrisées" },
                      { v: "∞", l: "Cafés consommés" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-center">
                        <div className="text-2xl font-bold text-white">{s.v}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-wide text-[#7d8590]">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Tech Stack */}
                <Section icon={Wrench} title="Stack de développement">
                  <p className="mb-4">Tout ce qui entre dans la composition d'un produit :</p>
                  <div className="space-y-4">
                    {skillGroups.map((g) => (
                      <div key={g.title}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#7d8590]">{g.title}</p>
                        <div className="flex flex-wrap gap-2">
                          {g.items.map((s) => <SkillPill key={s.name} {...s} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Stats */}
                <Section icon={BarChart3} title="Parcours & Stats">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5">
                      <p className="mb-3 text-sm font-semibold text-[#58a6ff]">Parcours</p>
                      <ul className="space-y-2 text-sm">
                        <li><span className="text-[#7d8590]">2024 — présent ·</span> <span className="text-white font-semibold">Dév. Fullstack Stagiaire</span> — Zola-Kimya</li>
                        <li><span className="text-[#7d8590]">2021 — 2024 ·</span> <span className="text-white font-semibold">Licence Informatique</span> — CFI-CIRAS</li>
                        <li><span className="text-[#7d8590]">2020 — 2021 ·</span> <span className="text-white font-semibold">Bac Scientifique (C)</span> — Pointe-Noire</li>
                        <li><span className="text-[#7d8590]">Continu ·</span> <span className="text-white font-semibold">Auto-formation</span> — React Native, TS, Supabase</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-white">13</div>
                          <div className="mt-1 text-[11px] uppercase tracking-wide text-[#7d8590]">Projets</div>
                        </div>
                        <div>
                          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-[#39d353] text-2xl">🔥</div>
                          <div className="mt-1 text-[11px] uppercase tracking-wide text-[#7d8590]">Streak</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white">24h</div>
                          <div className="mt-1 text-[11px] uppercase tracking-wide text-[#7d8590]">Réponse</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contribution graph */}
                  <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117] p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Activité (12 derniers mois)</p>
                      <div className="flex items-center gap-1 text-[10px] text-[#7d8590]">
                        Less
                        {levelColor.map((c) => <span key={c} className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />)}
                        More
                      </div>
                    </div>
                    <div
                      className="grid gap-[3px]"
                      style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))", gridAutoFlow: "column", gridTemplateRows: "repeat(7, 1fr)" }}
                    >
                      {contribGrid.map((lvl, i) => (
                        <span key={i} className="aspect-square rounded-[2px]" style={{ background: levelColor[lvl] }} />
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117] p-5">
                    <p className="mb-4 text-sm font-semibold text-white">Langages les plus utilisés</p>
                    <div className="mb-4 flex h-2 w-full overflow-hidden rounded-full">
                      {allSkillPct.map((l) => (
                        <span key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      {allSkillPct.map((l) => (
                        <div key={l.name} className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
                          <span className="text-[#c9d1d9]">{l.name}</span>
                          <span className="text-[#7d8590]">{l.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>

                {/* Projects */}
                <Section icon={Rocket} title="Projets sélectionnés">
                  <ul className="space-y-2.5">
                    {projects.map((p) => (
                      <li key={p.title} className="flex gap-2 rounded-md border border-transparent p-2 hover:border-[#30363d] hover:bg-[#161b22]">
                        <span className="text-lg leading-6">{p.emoji}</span>
                        <p><span className="font-semibold text-white">{p.title}</span> — {p.desc}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 italic text-[#7d8590]">
                    Voir tous les projets sur mon <a href="https://github.com/Lord-Coding" target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline">GitHub</a>.
                  </p>
                </Section>

                {/* Mission */}
                <Section icon={Target} title="Ce que je cherche">
                  <ul className="space-y-2">
                    <li>🧠 <span className="font-semibold text-white">En cours :</span> React Native, TypeScript avancé, Supabase et déploiement cloud.</li>
                    <li>💼 <span className="font-semibold text-white">Objectif :</span> Rejoindre une équipe produit ambitieuse (fullstack / mobile).</li>
                    <li>🏹 <span className="font-semibold text-white">Ouvert :</span> Freelance, stages avancés, collaborations long terme.</li>
                  </ul>
                </Section>

                {/* Contact */}
                <section id="contact" className="pb-2">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                    <Handshake className="h-5 w-5 text-[#7ee787]" />
                    Un projet en tête ? Discutons-en.
                  </h2>
                  <p>Disponible pour freelance, stages avancés ou collaborations long terme. Réponse sous 24h.</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      { label: "Email", color: "#EA4335", icon: Mail, href: "mailto:olavictoria016@gmail.com" },
                      { label: "Téléphone", color: "#25D366", icon: Phone, href: "tel:+242064335097" },
                      { label: "GitHub", color: "#24292f", icon: Github, href: "https://github.com/Lord-Coding" },
                      { label: "LinkedIn", color: "#0A66C2", icon: Linkedin, href: "https://github.com/Lord-Coding" },
                      { label: "CV PDF", color: "#f0883e", icon: ExternalLink, href: "/cv-lord.pdf" },
                    ].map((b) => (
                      <a
                        key={b.label}
                        href={b.href}
                        target={b.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
                        style={{ background: b.color }}
                      >
                        <b.icon className="h-3.5 w-3.5" />
                        {b.label}
                      </a>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-[#7d8590]">
              © {new Date().getFullYear()} OLA Victoria Dicone — Pointe-Noire · Built with React & TanStack ☕
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
