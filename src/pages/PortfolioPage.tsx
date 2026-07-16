import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import avatarUrl from "@/assets/avatar.jpg";
import ContactForm from "@/components/ContactForm";
import LazyLottie from "@/components/LazyLottie";
import Lightbox from "@/components/Lightbox";

import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, SiBootstrap,
  SiHtml5, SiCss, SiAngular, SiNodedotjs, SiExpress, SiNestjs, SiLaravel, SiPhp,
  SiPython, SiCplusplus, SiPrisma, SiExpo, SiIonic, SiAndroidstudio, SiPostgresql,
  SiMysql, SiSqlite, SiMongodb, SiRedis, SiFirebase, SiVercel, SiNetlify,
  SiDocker, SiGit, SiLinux, SiSupabase, SiCloudinary, SiStripe, SiResend,
  SiFigma, SiGithub, SiWhatsapp,
} from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import { TbCloudUpload } from "react-icons/tb";
const FaHeroku = TbCloudUpload;
import {
  FiMapPin, FiLink, FiUsers, FiDownload, FiPhone, FiMail, FiExternalLink,
  FiCode, FiCoffee, FiTarget, FiTrendingUp, FiAward, FiBriefcase,
  FiChevronRight, FiUser, FiUsers as FiUsersDup, FiGithub, FiX, FiGlobe, FiFilter,
  FiHeart, FiShoppingCart, FiBookOpen, FiLayout, FiImage,
} from "react-icons/fi";
import { HiOutlineLightBulb, HiOutlineSparkles } from "react-icons/hi";
import { IoRocketOutline, IoSchoolOutline } from "react-icons/io5";

/* ------------------------------- Data ----------------------------------- */

const skillGroups = [
  { title: "Front-End", items: [
    { name: "HTML5", color: "#E34F26", Icon: SiHtml5 },
    { name: "CSS3", color: "#1572B6", Icon: SiCss },
    { name: "JavaScript", color: "#F7DF1E", Icon: SiJavascript },
    { name: "TypeScript", color: "#3178c6", Icon: SiTypescript },
    { name: "React", color: "#61DAFB", Icon: SiReact },
    { name: "Next.js", color: "#ffffff", Icon: SiNextdotjs },
    { name: "Angular", color: "#DD0031", Icon: SiAngular },
    { name: "Tailwind", color: "#38BDF8", Icon: SiTailwindcss },
    { name: "Bootstrap", color: "#7952B3", Icon: SiBootstrap },
  ]},
  { title: "Back-End", items: [
    { name: "Node.js", color: "#3C873A", Icon: SiNodedotjs },
    { name: "Express", color: "#ffffff", Icon: SiExpress },
    { name: "Nest.js", color: "#E0234E", Icon: SiNestjs },
    { name: "Laravel", color: "#FF2D20", Icon: SiLaravel },
    { name: "PHP", color: "#777BB4", Icon: SiPhp },
    { name: "Python", color: "#3776AB", Icon: SiPython },
    { name: "C++", color: "#00599C", Icon: SiCplusplus },
    { name: "Prisma", color: "#5A67D8", Icon: SiPrisma },
  ]},
  { title: "Mobile", items: [
    { name: "React Native", color: "#61DAFB", Icon: SiReact },
    { name: "Expo", color: "#ffffff", Icon: SiExpo },
    { name: "Ionic", color: "#3880FF", Icon: SiIonic },
    { name: "Android Studio", color: "#3DDC84", Icon: SiAndroidstudio },
  ]},
  { title: "Bases de données", items: [
    { name: "PostgreSQL", color: "#4169E1", Icon: SiPostgresql },
    { name: "MySQL", color: "#4479A1", Icon: SiMysql },
    { name: "SQLite", color: "#66aadd", Icon: SiSqlite },
    { name: "MongoDB", color: "#47A248", Icon: SiMongodb },
    { name: "Redis", color: "#DC382D", Icon: SiRedis },
    { name: "Firebase", color: "#FFCA28", Icon: SiFirebase },
  ]},
  { title: "Cloud & Déploiement", items: [
    { name: "Vercel", color: "#ffffff", Icon: SiVercel },
    { name: "Netlify", color: "#00C7B7", Icon: SiNetlify },
    { name: "Heroku", color: "#a394d4", Icon: FaHeroku },
    { name: "Docker", color: "#2496ED", Icon: SiDocker },
    { name: "Git", color: "#F05032", Icon: SiGit },
    { name: "GitHub", color: "#ffffff", Icon: SiGithub },
    { name: "Linux", color: "#FCC624", Icon: SiLinux },
  ]},
  { title: "Services & Intégrations", items: [
    { name: "Supabase", color: "#3ECF8E", Icon: SiSupabase },
    { name: "Cloudinary", color: "#3448C5", Icon: SiCloudinary },
    { name: "Stripe", color: "#635BFF", Icon: SiStripe },
    { name: "Resend", color: "#ffffff", Icon: SiResend },
    { name: "OpenAI", color: "#10A37F", Icon: RiOpenaiFill },
    { name: "Figma", color: "#F24E1E", Icon: SiFigma },
  ]},
] as const;

const coreSkills = [
  { label: "Développement Front-End", value: 92, color: "#61DAFB" },
  { label: "Développement Back-End", value: 85, color: "#3C873A" },
  { label: "Mobile (React Native / Ionic)", value: 78, color: "#38BDF8" },
  { label: "UI / UX Design", value: 74, color: "#F24E1E" },
  { label: "DevOps & Cloud", value: 65, color: "#2496ED" },
];

type TimelineKind = "work" | "edu" | "project" | "award";
const timeline: {
  year: string; title: string; org: string; desc: string;
  Icon: React.ComponentType<{ className?: string }>; color: string; kind: TimelineKind; tag: string;
}[] = [
  { year: "2024 — présent", title: "Développeur Fullstack — Stagiaire", org: "Zola-Kimya",
    desc: "Conception et développement de plateformes web/mobiles au sein d'une équipe agile.",
    Icon: FiBriefcase, color: "#3fb950", kind: "work", tag: "Expérience" },
  { year: "2022 — présent", title: "Freelance & Projets personnels", org: "Open-Source · Clients directs",
    desc: "10+ projets livrés : CFI Link, Order Deal, RH Connect, Bénédicte ONG, Profil RH…",
    Icon: IoRocketOutline, color: "#e3b341", kind: "project", tag: "Projets" },
  { year: "2021 — 2024", title: "Licence Informatique (Génie-Logiciel)", org: "CFI-CIRAS · Pointe-Noire",
    desc: "Formation complète en génie logiciel, algorithmique, bases de données et architecture applicative.",
    Icon: IoSchoolOutline, color: "#58a6ff", kind: "edu", tag: "Formation" },
  { year: "2020 — 2021", title: "Baccalauréat Scientifique (Série C)", org: "Pointe-Noire, Congo",
    desc: "Mathématiques et sciences physiques — mention obtenue.",
    Icon: FiAward, color: "#f0883e", kind: "award", tag: "Diplôme" },
];

type ProjectType = "personal" | "collab";
type Project = {
  Icon: ComponentType<{ className?: string }>;
  iconColor: string;
  title: string; desc: string; longDesc: string; role: string;
  stack: string[]; href: string; github?: string; live?: string;
  type: ProjectType; year: string;
  screenshots?: string[];
};

const projects: Project[] = [
  { Icon: IoSchoolOutline, iconColor: "#58a6ff", title: "CFI Link", desc: "Étudiants ↔ opportunités du CFI-CIRAS.",
    longDesc: "Plateforme web/mobile reliant les étudiants du CFI-CIRAS aux opportunités professionnelles : offres de stage, alternances et premiers emplois. Système de matching, profils enrichis et messagerie interne.",
    role: "Développeur fullstack (front + API)", stack: ["React", "Ionic", "Laravel", "MySQL"],
    href: "https://github.com/Lord-Coding", github: "https://github.com/Lord-Coding", type: "collab", year: "2024" },
  { Icon: FiShoppingCart, iconColor: "#e3b341", title: "Order Deal", desc: "Suivi et gestion des commandes avec deals.",
    longDesc: "Application de suivi et gestion de commandes clients avec un module de deals et promotions temporelles, gestion des statuts et tableau de bord marchand.",
    role: "Développeur solo", stack: ["React", "Node.js", "Express", "MongoDB"],
    href: "https://github.com/Lord-Coding", github: "https://github.com/Lord-Coding", type: "personal", year: "2024" },
  { Icon: FiUsers, iconColor: "#bc8cff", title: "RH Connect", desc: "Recrutement RH — candidats & recruteurs.",
    longDesc: "Outil RH orienté candidats et recruteurs : dépôt de CV, offres d'emploi, pipeline de sélection, entretiens et notifications.",
    role: "Développeur fullstack", stack: ["Laravel", "React", "MySQL", "Tailwind"],
    href: "https://github.com/Lord-Coding", github: "https://github.com/Lord-Coding", type: "personal", year: "2023" },
  { Icon: FiBriefcase, iconColor: "#7ee787", title: "Zola-Kimya", desc: "Site institutionnel de l'entreprise.",
    longDesc: "Site institutionnel présentant la mission, les activités, l'équipe et les services de Zola-Kimya. SEO, formulaires de contact et back-office léger.",
    role: "Développeur front + intégration", stack: ["React", "Tailwind", "MySQL"],
    href: "https://github.com/Lord-Coding", github: "https://github.com/Lord-Coding", type: "collab", year: "2024" },
  { Icon: FiUser, iconColor: "#f0883e", title: "Profil RH", desc: "Profils, congés, évaluations, effectifs.",
    longDesc: "Application RH complète : gestion des profils employés, demandes de congés, évaluations de performance et suivi des effectifs avec rôles et permissions.",
    role: "Développeur fullstack", stack: ["React", "Node.js", "PostgreSQL", "Prisma"],
    href: "https://github.com/Lord-Coding", github: "https://github.com/Lord-Coding", type: "collab", year: "2023" },
  { Icon: FiHeart, iconColor: "#ff7b72", title: "Bénédicte ONG", desc: "Présentation + collecte de dons pour l'ONG.",
    longDesc: "Site vitrine et plateforme de collecte de dons pour l'ONG Bénédicte : présentation des actions, campagnes, paiements sécurisés et suivi transparent.",
    role: "Développeur solo", stack: ["React", "Next.js", "Tailwind", "Stripe"],
    href: "https://github.com/Lord-Coding", github: "https://github.com/Lord-Coding", type: "personal", year: "2023" },
  { Icon: FiLayout, iconColor: "#7ee787", title: "Portfolio Lord-Coding", desc: "Ce portfolio — React + TanStack.",
    longDesc: "Portfolio personnel construit avec React, TanStack Start, Tailwind et Framer Motion. PWA installable et cache offline via service worker.",
    role: "Concepteur & développeur", stack: ["React", "TanStack", "Tailwind", "Framer Motion"],
    href: "https://github.com/Lord-Coding", github: "https://github.com/Lord-Coding", live: "/", type: "personal", year: "2025",
    screenshots: [avatarUrl] },
  { Icon: FiBookOpen, iconColor: "#58a6ff", title: "Study Hub", desc: "Ressources académiques et TD partagés.",
    longDesc: "Espace collaboratif de partage de ressources académiques, travaux dirigés et corrections, avec authentification et modération.",
    role: "Développeur solo", stack: ["Next.js", "Supabase", "Tailwind"],
    href: "https://github.com/Lord-Coding", github: "https://github.com/Lord-Coding", type: "personal", year: "2023" },
];

const allSkillPct = [
  { name: "TypeScript", pct: 28, color: "#3178c6" },
  { name: "JavaScript", pct: 22, color: "#f1e05a" },
  { name: "PHP", pct: 18, color: "#777BB4" },
  { name: "Python", pct: 14, color: "#3572A5" },
  { name: "CSS", pct: 10, color: "#563d7c" },
  { name: "Shell", pct: 8, color: "#89e051" },
];

/* ---------------------------- UI primitives ----------------------------- */

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function Section({
  id, icon: Icon, title, kicker, action, children,
}: {
  id?: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  kicker?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-b border-[#21262d] pb-7 mb-7 scroll-mt-20"
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {kicker && <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#7ee787]">{kicker}</p>}
          <h2 id={id ? `${id}-title` : undefined} className="flex items-center gap-2 text-lg font-semibold text-white sm:text-xl md:text-2xl">
            <Icon className="h-5 w-5 text-[#7ee787]" aria-hidden="true" />
            <span>{title}</span>
          </h2>
        </div>
        {action}
      </div>
      <div className="text-[14px] leading-relaxed text-[#c9d1d9] sm:text-[15px]">{children}</div>
    </motion.section>
  );
}

function SkillPill({ name, color, Icon }: { name: string; color: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs font-medium text-[#c9d1d9]"
      style={{ boxShadow: `inset 0 0 0 1px ${color}33` }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden="true" />
      {name}
    </span>
  );
}

function Marquee({ children, duration = 30, reverse = false }: { children: React.ReactNode; duration?: number; reverse?: boolean }) {
  return (
    <div className="group relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex w-max gap-2"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* -------------------------- Project detail modal ------------------------ */

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 24 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-t-2xl border border-[#30363d] bg-[#0d1117] shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#21262d] p-4 sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-[#30363d]"
                  style={{ background: `${project.iconColor}22`, color: project.iconColor }}
                  aria-hidden="true"
                >
                  <project.Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 id="project-modal-title" className="truncate text-lg font-bold text-white sm:text-xl">{project.title}</h3>
                  <p className="mt-0.5 font-mono text-xs text-[#7d8590]">
                    {project.year} · {project.type === "personal" ? "Personnel" : "Collaboration"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer les détails du projet"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[#30363d] bg-[#161b22] text-[#c9d1d9] transition hover:bg-[#21262d] hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">
              <p className="text-sm leading-relaxed text-[#c9d1d9]">{project.longDesc}</p>

              <div className="mt-4">
                <h4 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#7ee787]">Rôle</h4>
                <p className="text-sm text-white">{project.role}</p>
              </div>

              <div className="mt-4">
                <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#7ee787]">Stack utilisée</h4>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span key={s} className="rounded-full border border-[#30363d] bg-[#161b22] px-2.5 py-1 font-mono text-[11px] text-[#c9d1d9]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {project.screenshots && project.screenshots.length > 0 && (
                <div className="mt-5">
                  <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#7ee787]">Captures</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {project.screenshots.map((src, idx) => (
                      <button
                        key={src + idx}
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        aria-label={`Ouvrir la capture ${idx + 1} en plein écran`}
                        className="group relative aspect-video overflow-hidden rounded-md border border-[#30363d] bg-[#161b22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]"
                      >
                        <img
                          src={src}
                          alt={`${project.title} — capture ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                          <FiImage className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-2 text-sm font-semibold text-white hover:bg-[#30363d]">
                    <FiGithub className="h-4 w-4" /> Code source
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#238636] to-[#2ea043] px-3 py-2 text-sm font-semibold text-white hover:brightness-110">
                    <FiGlobe className="h-4 w-4" /> Démo en ligne
                  </a>
                )}
                <a href={project.href} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm font-semibold text-[#58a6ff] hover:bg-[#21262d]">
                  <FiExternalLink className="h-4 w-4" /> Ouvrir
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {project && lightboxIndex !== null && project.screenshots && (
        <Lightbox
          images={project.screenshots}
          startIndex={lightboxIndex}
          title={project.title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </AnimatePresence>
  );
}

/* ------------------------------- Page ----------------------------------- */

export default function PortfolioPage() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeTypes, setActiveTypes] = useState<Set<ProjectType>>(new Set());
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const counts = useMemo(() => ({
    all: projects.length,
    personal: projects.filter((p) => p.type === "personal").length,
    collab: projects.filter((p) => p.type === "collab").length,
  }), []);

  const filteredProjects = useMemo(() =>
    activeTypes.size === 0 ? projects : projects.filter((p) => activeTypes.has(p.type)),
  [activeTypes]);

  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 4);

  const toggleType = (t: ProjectType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
    setShowAllProjects(true);
  };

  return (
    <div className="min-h-dvh bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-[#21262d] bg-[#010409]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-3 py-3 sm:px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10" aria-hidden="true">
              <SiGithub className="h-4 w-4 text-white" />
            </div>
            <span className="truncate font-mono text-sm font-semibold text-white">Lord-Coding</span>
          </div>
          <nav aria-label="Navigation principale" className="ml-auto hidden items-center gap-1 md:flex">
            {[
              { href: "#about", label: "À propos" },
              { href: "#stack", label: "Stack" },
              { href: "#parcours", label: "Parcours" },
              { href: "#projets", label: "Projets" },
              { href: "#contact", label: "Contact" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="rounded-md px-3 py-1.5 text-sm text-[#c9d1d9] transition hover:bg-[#161b22] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]">
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="/cv-lord.pdf"
            download
            aria-label="Télécharger mon CV au format PDF"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-r from-[#238636] to-[#2ea043] px-3 py-1.5 text-xs font-semibold text-white shadow shadow-[#238636]/30 hover:brightness-110 md:ml-2"
          >
            <FiDownload className="h-3.5 w-3.5" /> CV
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-3 py-5 sm:px-4 sm:py-8 md:px-6 md:py-10">
        {/* TOP AREA */}
        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)] md:items-start md:gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* SIDEBAR — profil only */}
          <aside className="space-y-4 sm:space-y-5" aria-label="Profil">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative mx-auto w-40 sm:w-56 md:w-full md:max-w-[300px]">
              <div className="overflow-hidden rounded-full ring-1 ring-[#30363d]">
                <img src={avatarUrl} alt="Portrait d'OLA Victoria Dicone (Lord-Coding)" width={300} height={300} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
              </div>
              <motion.span
                aria-label="Statut : disponible"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-[8%] right-[8%] h-4 w-4 rounded-full border-[3px] border-[#0d1117] sm:h-5 sm:w-5 md:h-6 md:w-6 md:border-4"
                style={{ background: "#3fb950", boxShadow: "0 0 0 2px rgba(63,185,80,0.35)" }}
              />
            </motion.div>

            <div className="text-center md:text-left">
              <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl">OLA Victoria Dicone</h1>
              <p className="text-base text-[#7d8590] sm:text-lg">Lord-Coding · he/him</p>
            </div>

            <p className="text-[14px] sm:text-[15px]">Je construis des expériences web & mobiles claires, rapides et bien pensées — du premier pixel à la mise en production.</p>

            <a href="/cv-lord.pdf" download aria-label="Télécharger le CV au format PDF"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] py-2 text-sm font-medium text-white transition hover:bg-[#30363d]">
              <FiDownload className="h-4 w-4" /> Télécharger le CV (PDF)
            </a>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[#7d8590]">
              <FiUsers className="h-4 w-4" aria-hidden="true" />
              <span><span className="font-semibold text-white">3+</span> ans</span>
              <span aria-hidden="true">·</span>
              <span><span className="font-semibold text-white">10+</span> projets</span>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><FiMapPin className="h-4 w-4 text-[#7d8590]" aria-hidden="true" /> Pointe-Noire, Congo 🇨🇬</li>
              <li className="flex items-center gap-2"><FiBriefcase className="h-4 w-4 text-[#7d8590]" aria-hidden="true" /> Stagiaire @ Zola-Kimya</li>
              <li className="flex items-center gap-2"><FiPhone className="h-4 w-4 text-[#7d8590]" aria-hidden="true" /> +242 06 433 5097</li>
              <li className="flex items-center gap-2 text-[#58a6ff]">
                <FiLink className="h-4 w-4 text-[#7d8590]" aria-hidden="true" />
                <a href="https://github.com/Lord-Coding" target="_blank" rel="noreferrer" className="break-all hover:underline">github.com/Lord-Coding</a>
              </li>
            </ul>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">Organizations</h3>
              <div className="flex flex-wrap gap-2">
                {["ZK", "CFI"].map((o) => (
                  <div key={o} className="grid h-8 w-8 place-items-center rounded-md bg-[#161b22] text-xs font-bold text-white ring-1 ring-[#30363d]">{o}</div>
                ))}
              </div>
            </div>
          </aside>

          {/* HERO + ABOUT */}
          <section className="min-w-0" aria-label="Présentation">
            <div className="rounded-md border border-[#30363d]">
              <div className="flex items-center justify-between border-b border-[#21262d] px-3 py-2 text-xs text-[#7d8590] sm:px-4">
                <span className="truncate font-mono">Lord-Coding / README<span className="text-[#7d8590]">.md</span></span>
                <span aria-hidden="true">✏️</span>
              </div>

              <div className="p-4 sm:p-6 md:p-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                  className="mb-8 grid items-center gap-6 md:grid-cols-[1fr_auto]">
                  <div className="min-w-0 text-center md:text-left">
                    <h2 className="mb-3 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold text-white sm:text-3xl md:justify-start md:text-4xl">
                      <motion.span animate={{ rotate: [0, 20, -10, 20, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} aria-hidden="true">👋</motion.span>
                      Salut, je suis Victoria
                    </h2>
                    <p className="italic text-[#7d8590]">
                      $ whoami — <span className="not-italic text-[#7ee787]">Lord-sama ▌</span>
                    </p>
                    <p className="mt-3 text-[14px] text-[#c9d1d9] sm:text-[15px]">
                      Je conçois et développe des produits web & mobiles utiles au quotidien : interfaces soignées,
                      code lisible, performance qui suit. Ma boussole : livrer vite <em>et</em> bien, en gardant l'UX
                      au centre.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                      <a href="#projets" className="inline-flex items-center gap-1.5 rounded-md bg-[#1f6feb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#388bfd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff]">
                        <IoRocketOutline className="h-4 w-4" /> Voir mes projets
                      </a>
                      <a href="#contact" className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#30363d]">
                        <FiMail className="h-4 w-4" /> Me contacter
                      </a>
                    </div>
                  </div>
                  <LazyLottie
                    className="mx-auto aspect-square w-40 sm:w-56 md:w-[260px] lg:w-[280px]"
                    src="https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json"
                    ariaLabel="Animation de développement"
                  />
                </motion.div>

                <Section id="about" icon={HiOutlineSparkles} title="À propos" kicker="Qui suis-je">
                  <p className="italic text-[#7d8590]">🇨🇬 Pointe-Noire · 🎧 Curieux · 💻 Rigoureux</p>
                  <p className="mt-2">
                    Originaire et résidant à <span className="font-semibold text-white">Pointe-Noire, République du Congo</span>,
                    récemment diplômé au CFI-CIRAS. Actuellement <span className="font-semibold text-white">stagiaire chez Zola-Kimya</span>,
                    je contribue à la conception et au développement de plateformes web/mobiles aux côtés d'une équipe agile.
                  </p>
                  <p className="mt-3">
                    Mon obsession : livrer des produits <span className="font-semibold text-white">rapides, accessibles et maintenables</span>.
                    Je pense architecture avant de coder, je teste avant d'expédier, et je m'attache aux détails d'UX qui font la différence.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
                    {[
                      { v: "3+", l: "Années", Icon: FiTrendingUp },
                      { v: "10+", l: "Projets", Icon: IoRocketOutline },
                      { v: "25+", l: "Technos", Icon: FiCode },
                      { v: "∞", l: "Cafés", Icon: FiCoffee },
                    ].map(({ v, l, Icon }) => (
                      <motion.div key={l} whileHover={{ y: -3 }} className="rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-center">
                        <Icon className="mx-auto mb-1 h-5 w-5 text-[#7ee787]" aria-hidden="true" />
                        <div className="text-xl font-bold text-white sm:text-2xl">{v}</div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-wide text-[#7d8590] sm:text-[11px]">{l}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <a href="#projets" className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#1f6feb] to-[#388bfd] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#1f6feb]/30 hover:brightness-110">
                      Découvrir mes projets <FiChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </Section>
              </div>
            </div>
          </section>
        </div>

        {/* FULL-WIDTH LOWER */}
        <div className="mt-8 rounded-md border border-[#30363d] md:mt-10">
          <div className="flex items-center justify-between border-b border-[#21262d] px-3 py-2 text-xs text-[#7d8590] sm:px-4">
            <span className="truncate font-mono">Lord-Coding / details<span className="text-[#7d8590]">.md</span></span>
            <span aria-hidden="true">📖</span>
          </div>

          <div className="p-4 sm:p-6 md:p-10">
            <Section icon={HiOutlineSparkles} title="Compétences clés" kicker="Expertise">
              <div className="grid gap-4 md:grid-cols-2">
                {coreSkills.map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-[#c9d1d9]">{s.label}</span>
                      <span className="text-[#7d8590]">{s.value}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#161b22]" role="progressbar" aria-valuenow={s.value} aria-valuemin={0} aria-valuemax={100} aria-label={s.label}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.value}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="stack" icon={FiCode} title="Stack de développement" kicker="Boîte à outils">
              <p className="mb-6">Chaque catégorie défile en boucle — survole pour explorer.</p>
              <div className="space-y-5 sm:space-y-6">
                {skillGroups.map((g, gi) => (
                  <div key={g.title}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#7ee787]">{g.title}</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#7ee787]/40 to-transparent" />
                      <span className="font-mono text-[10px] text-[#7d8590]">↓ carousel</span>
                    </div>
                    <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/60 py-2">
                      <Marquee duration={22 + gi * 3} reverse={gi % 2 === 1}>
                        {g.items.map((s) => <SkillPill key={s.name} {...s} />)}
                      </Marquee>
                    </div>
                    {gi < skillGroups.length - 1 && (
                      <div className="mt-3 flex justify-center text-[#30363d]" aria-hidden="true">
                        <FiChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* TIMELINE — mobile vertical chrono / desktop zig-zag */}
            <Section id="parcours" icon={FiTrendingUp} title="Mon parcours" kicker="Timeline">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#7ee787] via-[#58a6ff] to-[#e3b341] md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
                <ol className="space-y-6 md:space-y-8">
                  {timeline.map((t, i) => {
                    const rightSide = i % 2 === 1;
                    return (
                      <motion.li
                        key={t.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.45 }}
                        className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-10 ${rightSide ? "md:[&>div]:col-start-2" : ""}`}
                      >
                        <span
                          className="absolute left-0 top-2 grid h-9 w-9 place-items-center rounded-full ring-4 ring-[#0d1117] md:left-1/2 md:top-4 md:h-11 md:w-11 md:-translate-x-1/2"
                          style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}55)` }}
                          aria-hidden="true"
                        >
                          <t.Icon className="h-4 w-4 text-white md:h-5 md:w-5" />
                        </span>

                        <div
                          className={`relative rounded-xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-3.5 transition hover:border-[#484f58] hover:shadow-lg sm:p-4 md:p-5 md:text-left ${rightSide ? "" : "md:text-right"}`}
                          style={{ boxShadow: `0 0 0 1px ${t.color}22` }}
                        >
                          <div className={`mb-2 flex flex-wrap items-center gap-2 ${rightSide ? "" : "md:justify-end"}`}>
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              style={{ background: `${t.color}22`, color: t.color }}>
                              {t.tag}
                            </span>
                            <span className="font-mono text-[11px] text-[#7d8590] sm:text-xs">{t.year}</span>
                          </div>
                          <p className="text-sm font-semibold text-white sm:text-base">{t.title}</p>
                          <p className="text-xs text-[#58a6ff] sm:text-sm">{t.org}</p>
                          <p className="mt-2 text-[13px] text-[#c9d1d9] sm:text-sm">{t.desc}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
              </div>
            </Section>

            <Section icon={HiOutlineLightBulb} title="Langages les plus utilisés" kicker="Stats">
              <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4 sm:p-5">
                <div className="mb-4 flex h-2 w-full overflow-hidden rounded-full" role="img" aria-label="Répartition des langages">
                  {allSkillPct.map((l) => <span key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />)}
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs sm:grid-cols-3 sm:text-sm">
                  {allSkillPct.map((l) => (
                    <div key={l.name} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} aria-hidden="true" />
                      <span className="text-[#c9d1d9]">{l.name}</span>
                      <span className="text-[#7d8590]">{l.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* PROJECTS */}
            <Section id="projets" icon={IoRocketOutline} title="Projets" kicker="Réalisations">
              {/* Filter bar with counters — multi-select */}
              <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer les projets">
                <span className="inline-flex items-center gap-1 text-xs text-[#7d8590]">
                  <FiFilter className="h-3.5 w-3.5" aria-hidden="true" /> Filtres :
                </span>
                <button
                  onClick={() => { setActiveTypes(new Set()); setShowAllProjects(true); }}
                  aria-pressed={activeTypes.size === 0}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    activeTypes.size === 0
                      ? "border-[#7ee787] bg-[#7ee787]/10 text-[#7ee787]"
                      : "border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:border-[#484f58]"
                  }`}
                >
                  Tous <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">{counts.all}</span>
                </button>
                <button
                  onClick={() => toggleType("personal")}
                  aria-pressed={activeTypes.has("personal")}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    activeTypes.has("personal")
                      ? "border-[#3fb950] bg-[#3fb950]/15 text-[#3fb950]"
                      : "border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:border-[#484f58]"
                  }`}
                >
                  <FiUser className="h-3 w-3" aria-hidden="true" /> Perso
                  <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">{counts.personal}</span>
                </button>
                <button
                  onClick={() => toggleType("collab")}
                  aria-pressed={activeTypes.has("collab")}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    activeTypes.has("collab")
                      ? "border-[#bc8cff] bg-[#bc8cff]/15 text-[#bc8cff]"
                      : "border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:border-[#484f58]"
                  }`}
                >
                  <FiUsersDup className="h-3 w-3" aria-hidden="true" /> Collab
                  <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">{counts.collab}</span>
                </button>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((p, i) => {
                  const isPerso = p.type === "personal";
                  return (
                    <motion.li
                      key={p.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4 }}
                    >
                      <button
                        type="button"
                        onClick={() => setModalProject(p)}
                        aria-label={`Voir les détails du projet ${p.title}`}
                        className="group relative flex w-full flex-col rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-left transition hover:border-[#484f58] hover:bg-[#161b22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]"
                      >
                        <span
                          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isPerso
                              ? "bg-[#3fb950]/15 text-[#3fb950] ring-1 ring-[#3fb950]/40"
                              : "bg-[#bc8cff]/15 text-[#bc8cff] ring-1 ring-[#bc8cff]/40"
                          }`}
                        >
                          {isPerso ? <FiUser className="h-2.5 w-2.5" aria-hidden="true" /> : <FiUsersDup className="h-2.5 w-2.5" aria-hidden="true" />}
                          {isPerso ? "Perso" : "Collab"}
                        </span>

                        <div className="flex items-start gap-3 pr-16">
                          <span className="text-2xl" aria-hidden="true">{p.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-white group-hover:text-[#58a6ff]">{p.title}</p>
                            <p className="mt-0.5 font-mono text-[10px] text-[#7d8590]">{p.year}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-[#c9d1d9]">{p.desc}</p>
                        <p className="mt-2 line-clamp-1 font-mono text-xs text-[#7ee787]">{p.stack.join(" · ")}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#58a6ff]">
                          Voir les détails <FiChevronRight className="h-3 w-3" />
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#7d8590]" aria-live="polite">
                  {visibleProjects.length} / {filteredProjects.length} projet(s) affiché(s)
                </p>
                <div className="flex flex-wrap gap-2">
                  {filteredProjects.length > 4 && (
                    <button
                      onClick={() => setShowAllProjects((v) => !v)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#30363d]"
                    >
                      {showAllProjects ? "Réduire" : `Voir tous les projets (${filteredProjects.length})`}
                      <FiChevronRight className={`h-4 w-4 transition ${showAllProjects ? "-rotate-90" : "rotate-90"}`} />
                    </button>
                  )}
                  <a
                    href="https://github.com/Lord-Coding?tab=repositories"
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#238636] to-[#2ea043] px-4 py-2 text-sm font-semibold text-white shadow shadow-[#238636]/30 hover:brightness-110"
                  >
                    <SiGithub className="h-4 w-4" /> Tout voir sur GitHub
                  </a>
                </div>
              </div>
            </Section>

            <Section icon={FiTarget} title="Ce que je cherche" kicker="Objectifs">
              <ul className="space-y-2">
                <li>🧠 <span className="font-semibold text-white">En cours :</span> React Native, TypeScript avancé, Supabase et déploiement cloud.</li>
                <li>💼 <span className="font-semibold text-white">Objectif :</span> Rejoindre une équipe produit ambitieuse (fullstack / mobile).</li>
                <li>🏹 <span className="font-semibold text-white">Ouvert :</span> Freelance, stages avancés, collaborations long terme.</li>
              </ul>
            </Section>

            <section id="contact" className="scroll-mt-20 pb-2" aria-labelledby="contact-title">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#7ee787]">Contact</p>
              <h2 id="contact-title" className="mb-4 flex items-center gap-2 text-lg font-semibold text-white sm:text-xl md:text-2xl">
                <FiMail className="h-5 w-5 text-[#7ee787]" aria-hidden="true" />
                Un projet en tête ? Discutons-en.
              </h2>
              <p>Disponible pour freelance, stages avancés ou collaborations long terme. Réponse sous 24h.</p>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-3">
                  <a href="mailto:olavictoria016@gmail.com" className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition hover:border-[#484f58]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#EA4335]/20"><FiMail className="h-5 w-5 text-[#EA4335]" aria-hidden="true" /></div>
                    <div className="min-w-0"><p className="text-xs text-[#7d8590]">Email</p><p className="truncate text-sm font-semibold text-white">olavictoria016@gmail.com</p></div>
                  </a>
                  <a href="tel:+242064335097" className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition hover:border-[#484f58]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366]/20"><FiPhone className="h-5 w-5 text-[#25D366]" aria-hidden="true" /></div>
                    <div><p className="text-xs text-[#7d8590]">Téléphone</p><p className="text-sm font-semibold text-white">+242 06 433 5097</p></div>
                  </a>
                  <a href="https://wa.me/242064335097" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition hover:border-[#484f58]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366]/20"><SiWhatsapp className="h-5 w-5 text-[#25D366]" aria-hidden="true" /></div>
                    <div><p className="text-xs text-[#7d8590]">WhatsApp</p><p className="text-sm font-semibold text-white">Discuter maintenant</p></div>
                  </a>
                  <a href="https://github.com/Lord-Coding" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition hover:border-[#484f58]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><FiGithub className="h-5 w-5 text-white" aria-hidden="true" /></div>
                    <div><p className="text-xs text-[#7d8590]">GitHub</p><p className="text-sm font-semibold text-white">github.com/Lord-Coding</p></div>
                  </a>
                </div>
                <ContactForm />
              </div>
            </section>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#7d8590]">
          © {new Date().getFullYear()} OLA Victoria Dicone — Pointe-Noire · Built with React & TanStack ☕
        </p>
      </main>

      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </div>
  );
}
