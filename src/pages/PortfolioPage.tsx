import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { useState } from "react";
import avatarUrl from "@/assets/avatar.jpg";
import ContactForm from "@/components/ContactForm";

// Real brand icons — Simple Icons
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, SiBootstrap,
  SiHtml5, SiCss, SiAngular, SiNodedotjs, SiExpress, SiNestjs, SiLaravel, SiPhp,
  SiPython, SiCplusplus, SiPrisma, SiExpo, SiIonic, SiAndroidstudio, SiPostgresql,
  SiMysql, SiSqlite, SiMongodb, SiRedis, SiFirebase, SiVercel, SiNetlify,
  SiDocker, SiGit, SiLinux, SiSupabase, SiCloudinary, SiStripe, SiResend,
  SiFigma, SiGithub, SiWhatsapp, SiX, SiFacebook, SiInstagram,
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { RiOpenaiFill } from "react-icons/ri";
import { TbCloudUpload } from "react-icons/tb";
const FaHeroku = TbCloudUpload;
import {
  FiMapPin, FiLink, FiUsers, FiDownload, FiPhone, FiMail, FiExternalLink,
  FiCode, FiCoffee, FiHeadphones, FiBookOpen, FiCamera, FiZap, FiTarget,
  FiTrendingUp, FiAward, FiBriefcase, FiGithub, FiChevronRight, FiUser, FiUsers as FiUsersDup,
} from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineLightBulb, HiOutlineHeart } from "react-icons/hi";
import { IoRocketOutline, IoSchoolOutline } from "react-icons/io5";

/* ------------------------------- Data ----------------------------------- */

const skillGroups = [
  {
    title: "Front-End",
    items: [
      { name: "HTML5", color: "#E34F26", Icon: SiHtml5 },
      { name: "CSS3", color: "#1572B6", Icon: SiCss },
      { name: "JavaScript", color: "#F7DF1E", Icon: SiJavascript },
      { name: "TypeScript", color: "#3178c6", Icon: SiTypescript },
      { name: "React", color: "#61DAFB", Icon: SiReact },
      { name: "Next.js", color: "#ffffff", Icon: SiNextdotjs },
      { name: "Angular", color: "#DD0031", Icon: SiAngular },
      { name: "Tailwind", color: "#38BDF8", Icon: SiTailwindcss },
      { name: "Bootstrap", color: "#7952B3", Icon: SiBootstrap },
    ],
  },
  {
    title: "Back-End",
    items: [
      { name: "Node.js", color: "#3C873A", Icon: SiNodedotjs },
      { name: "Express", color: "#ffffff", Icon: SiExpress },
      { name: "Nest.js", color: "#E0234E", Icon: SiNestjs },
      { name: "Laravel", color: "#FF2D20", Icon: SiLaravel },
      { name: "PHP", color: "#777BB4", Icon: SiPhp },
      { name: "Python", color: "#3776AB", Icon: SiPython },
      { name: "C++", color: "#00599C", Icon: SiCplusplus },
      { name: "Prisma", color: "#5A67D8", Icon: SiPrisma },
    ],
  },
  {
    title: "Mobile",
    items: [
      { name: "React Native", color: "#61DAFB", Icon: SiReact },
      { name: "Expo", color: "#ffffff", Icon: SiExpo },
      { name: "Ionic", color: "#3880FF", Icon: SiIonic },
      { name: "Android Studio", color: "#3DDC84", Icon: SiAndroidstudio },
    ],
  },
  {
    title: "Bases de données",
    items: [
      { name: "PostgreSQL", color: "#4169E1", Icon: SiPostgresql },
      { name: "MySQL", color: "#4479A1", Icon: SiMysql },
      { name: "SQLite", color: "#66aadd", Icon: SiSqlite },
      { name: "MongoDB", color: "#47A248", Icon: SiMongodb },
      { name: "Redis", color: "#DC382D", Icon: SiRedis },
      { name: "Firebase", color: "#FFCA28", Icon: SiFirebase },
    ],
  },
  {
    title: "Cloud & Déploiement",
    items: [
      { name: "Vercel", color: "#ffffff", Icon: SiVercel },
      { name: "Netlify", color: "#00C7B7", Icon: SiNetlify },
      { name: "Heroku", color: "#a394d4", Icon: FaHeroku },
      { name: "Docker", color: "#2496ED", Icon: SiDocker },
      { name: "Git", color: "#F05032", Icon: SiGit },
      { name: "GitHub", color: "#ffffff", Icon: SiGithub },
      { name: "Linux", color: "#FCC624", Icon: SiLinux },
    ],
  },
  {
    title: "Services & Intégrations",
    items: [
      { name: "Supabase", color: "#3ECF8E", Icon: SiSupabase },
      { name: "Cloudinary", color: "#3448C5", Icon: SiCloudinary },
      { name: "Stripe", color: "#635BFF", Icon: SiStripe },
      { name: "Resend", color: "#ffffff", Icon: SiResend },
      { name: "OpenAI", color: "#10A37F", Icon: RiOpenaiFill },
      { name: "Figma", color: "#F24E1E", Icon: SiFigma },
    ],
  },
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
  {
    year: "2024 — présent", title: "Développeur Fullstack — Stagiaire", org: "Zola-Kimya",
    desc: "Conception et développement de plateformes web/mobiles au sein d'une équipe agile.",
    Icon: FiBriefcase, color: "#3fb950", kind: "work", tag: "Expérience",
  },
  {
    year: "2022 — présent", title: "Freelance & Projets personnels", org: "Open-Source · Clients directs",
    desc: "10+ projets livrés : CFI Link, Order Deal, RH Connect, Bénédicte ONG, Profil RH…",
    Icon: IoRocketOutline, color: "#e3b341", kind: "project", tag: "Projets",
  },
  {
    year: "2021 — 2024", title: "Licence Informatique (Génie-Logiciel)", org: "CFI-CIRAS · Pointe-Noire",
    desc: "Formation complète en génie logiciel, algorithmique, bases de données et architecture applicative.",
    Icon: IoSchoolOutline, color: "#58a6ff", kind: "edu", tag: "Formation",
  },
  {
    year: "2020 — 2021", title: "Baccalauréat Scientifique (Série C)", org: "Pointe-Noire, Congo",
    desc: "Mathématiques et sciences physiques — mention obtenue.",
    Icon: FiAward, color: "#f0883e", kind: "award", tag: "Diplôme",
  },
];

type ProjectType = "personal" | "collab";
const projects: {
  emoji: string; title: string; desc: string; stack: string; href: string; type: ProjectType; year: string;
}[] = [
  { emoji: "🎓", title: "CFI Link", desc: "Plateforme reliant les étudiants du CFI-CIRAS aux opportunités professionnelles.", stack: "React · Ionic · Laravel", href: "https://github.com/Lord-Coding", type: "collab", year: "2024" },
  { emoji: "🛒", title: "Order Deal", desc: "Suivi et gestion des commandes clients avec système de deals et promotions.", stack: "React · Node.js · Express", href: "https://github.com/Lord-Coding", type: "personal", year: "2024" },
  { emoji: "👥", title: "RH Connect", desc: "Outil de recrutement RH orienté candidats et recruteurs.", stack: "Laravel · React · MySQL", href: "https://github.com/Lord-Coding", type: "personal", year: "2023" },
  { emoji: "🏢", title: "Zola-Kimya", desc: "Site institutionnel présentant la mission et les activités de Zola-Kimya.", stack: "React · Tailwind · MySQL", href: "https://github.com/Lord-Coding", type: "collab", year: "2024" },
  { emoji: "🧑‍💼", title: "Profil RH", desc: "Gestion des profils, congés, évaluations et suivi des effectifs.", stack: "React · Node.js · PostgreSQL", href: "https://github.com/Lord-Coding", type: "collab", year: "2023" },
  { emoji: "❤️", title: "Bénédicte ONG", desc: "Plateforme de présentation et de collecte de dons pour l'ONG Bénédicte.", stack: "React · Next.js · Tailwind", href: "https://github.com/Lord-Coding", type: "personal", year: "2023" },
  { emoji: "🎨", title: "Portfolio Lord-Coding", desc: "Ce portfolio — React + TanStack + Framer Motion.", stack: "React · TanStack · Tailwind", href: "https://github.com/Lord-Coding", type: "personal", year: "2025" },
  { emoji: "📚", title: "Study Hub", desc: "Espace de partage de ressources académiques et travaux dirigés.", stack: "Next.js · Supabase", href: "https://github.com/Lord-Coding", type: "personal", year: "2023" },
];

const hobbies = [
  { label: "Coder tard le soir", Icon: FiCode, color: "#7ee787" },
  { label: "Café & focus", Icon: FiCoffee, color: "#f0883e" },
  { label: "Musique / Lo-fi", Icon: FiHeadphones, color: "#bc8cff" },
  { label: "Lecture tech", Icon: FiBookOpen, color: "#58a6ff" },
  { label: "Photographie", Icon: FiCamera, color: "#f778ba" },
  { label: "Sport / Marche", Icon: FiZap, color: "#e3b341" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/Lord-Coding", color: "#ffffff", bg: "#24292f", Icon: SiGithub },
  { label: "LinkedIn", href: "https://linkedin.com/in/lord-coding", color: "#ffffff", bg: "#0A66C2", Icon: FaLinkedinIn },
  { label: "WhatsApp", href: "https://wa.me/242064335097", color: "#ffffff", bg: "#25D366", Icon: SiWhatsapp },
  { label: "Twitter / X", href: "https://x.com/Lord_Coding", color: "#ffffff", bg: "#000000", Icon: SiX },
  { label: "Instagram", href: "https://instagram.com/lord.coding", color: "#ffffff", bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)", Icon: SiInstagram },
  { label: "Facebook", href: "https://facebook.com/lord.coding", color: "#ffffff", bg: "#1877F2", Icon: SiFacebook },
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
      className="border-b border-[#21262d] pb-8 mb-8 scroll-mt-20"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {kicker && <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#7ee787]">{kicker}</p>}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
            <Icon className="h-5 w-5 text-[#7ee787]" />
            <span>{title}</span>
          </h2>
        </div>
        {action}
      </div>
      <div className="text-[15px] leading-relaxed text-[#c9d1d9]">{children}</div>
    </motion.section>
  );
}

function SkillPill({ name, color, Icon }: { name: string; color: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs font-medium text-[#c9d1d9]"
      style={{ boxShadow: `inset 0 0 0 1px ${color}33` }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color }} />
      {name}
    </span>
  );
}

/** Horizontal infinite marquee — duplicates children twice, animates -50% */
function Marquee({
  children, duration = 30, reverse = false,
}: { children: React.ReactNode; duration?: number; reverse?: boolean }) {
  return (
    <div className="group relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex w-max gap-2"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        style={{ animationPlayState: "running" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------- Page ----------------------------------- */

export default function PortfolioPage() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [projectFilter, setProjectFilter] = useState<"all" | ProjectType>("all");

  const filteredProjects = projects.filter(p => projectFilter === "all" ? true : p.type === projectFilter);
  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Top nav bar */}
      <div className="sticky top-0 z-40 border-b border-[#21262d] bg-[#010409]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-3 py-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10">
              <SiGithub className="h-4 w-4 text-white" />
            </div>
            <span className="truncate font-mono text-sm font-semibold text-white">Lord-Coding</span>
          </div>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {[
              { href: "#about", label: "À propos" },
              { href: "#stack", label: "Stack" },
              { href: "#parcours", label: "Parcours" },
              { href: "#projets", label: "Projets" },
              { href: "#contact", label: "Contact" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="rounded-md px-3 py-1.5 text-sm text-[#c9d1d9] transition hover:bg-[#161b22] hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="/cv-lord.pdf"
            download
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-r from-[#238636] to-[#2ea043] px-3 py-1.5 text-xs font-semibold text-white shadow shadow-[#238636]/30 hover:brightness-110 md:ml-2"
          >
            <FiDownload className="h-3.5 w-3.5" /> CV
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
        {/* ============== TOP AREA: sidebar + hero/about ============== */}
        <div className="grid gap-8 md:grid-cols-[296px_minmax(0,1fr)] md:items-start">
          {/* LEFT SIDEBAR — profil + hobbies + socials */}
          <aside className="space-y-5">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative mx-auto w-full max-w-[296px]">
              <div className="overflow-hidden rounded-full ring-1 ring-[#30363d]">
                <img src={avatarUrl} alt="OLA Victoria Dicone" width={296} height={296} className="aspect-square w-full object-cover" />
              </div>
              <motion.span
                aria-label="Disponible"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-3 right-3 h-6 w-6 rounded-full border-4 border-[#0d1117]"
                style={{ background: "#3fb950" }}
              />
            </motion.div>

            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">OLA Victoria Dicone</h1>
              <p className="text-lg text-[#7d8590]">Lord-Coding · he/him</p>
            </div>

            <p className="text-[15px]">Développeur Fullstack — Licence Informatique (Génie Logiciel). Web & mobile, de l'UI à l'API. 🚀</p>

            <a href="/cv-lord.pdf" download className="flex w-full items-center justify-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] py-2 text-sm font-medium text-white transition hover:bg-[#30363d]">
              <FiDownload className="h-4 w-4" /> Télécharger le CV (PDF)
            </a>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[#7d8590]">
              <FiUsers className="h-4 w-4" />
              <span><span className="font-semibold text-white">3+</span> ans</span>
              <span>·</span>
              <span><span className="font-semibold text-white">10+</span> projets</span>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><FiMapPin className="h-4 w-4 text-[#7d8590]" /> Pointe-Noire, Congo 🇨🇬</li>
              <li className="flex items-center gap-2"><FiBriefcase className="h-4 w-4 text-[#7d8590]" /> Stagiaire @ Zola-Kimya</li>
              <li className="flex items-center gap-2"><FiPhone className="h-4 w-4 text-[#7d8590]" /> +242 06 433 5097</li>
              <li className="flex items-center gap-2 text-[#58a6ff]">
                <FiLink className="h-4 w-4 text-[#7d8590]" />
                <a href="https://github.com/Lord-Coding" target="_blank" rel="noreferrer" className="hover:underline break-all">github.com/Lord-Coding</a>
              </li>
            </ul>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {[{ e: "🎓", r: "#3fb950" }, { e: "💼", r: "#58a6ff" }, { e: "🏆", r: "#e3b341" }].map((a, i) => (
                  <motion.div key={i} whileHover={{ rotate: 8, scale: 1.1 }} className="grid h-11 w-11 place-items-center rounded-full text-xl" style={{ background: `radial-gradient(circle at 30% 30%, ${a.r}, #161b22 80%)` }}>
                    <span>{a.e}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">Organizations</h3>
              <div className="flex flex-wrap gap-2">
                {["ZK", "CFI"].map((o) => (
                  <div key={o} className="grid h-8 w-8 place-items-center rounded-md bg-[#161b22] text-xs font-bold text-white ring-1 ring-[#30363d]">{o}</div>
                ))}
              </div>
            </div>

            {/* Hobbies (moved here) */}
            <div className="border-t border-[#21262d] pt-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <HiOutlineHeart className="h-4 w-4 text-[#f778ba]" /> Hobbies
              </h3>
              <ul className="space-y-2">
                {hobbies.map((h) => (
                  <motion.li
                    key={h.label}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-3 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: `${h.color}22` }}>
                      <h.Icon className="h-4 w-4" style={{ color: h.color }} />
                    </span>
                    <span className="text-sm text-[#c9d1d9]">{h.label}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Socials (moved here) */}
            <div className="border-t border-[#21262d] pt-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <FiLink className="h-4 w-4 text-[#58a6ff]" /> Réseaux
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    whileHover={{ y: -2, scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="grid h-10 w-full place-items-center rounded-md text-white shadow"
                    style={{ background: s.bg }}
                  >
                    <s.Icon className="h-4 w-4" style={{ color: s.color }} />
                  </motion.a>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN TOP — hero + about only */}
          <main className="min-w-0">
            <div className="rounded-md border border-[#30363d]">
              <div className="flex items-center justify-between border-b border-[#21262d] px-3 py-2 text-xs text-[#7d8590] sm:px-4">
                <span className="truncate font-mono">Lord-Coding / README<span className="text-[#7d8590]">.md</span></span>
                <span>✏️</span>
              </div>

              <div className="p-4 sm:p-6 md:p-10">
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 grid items-center gap-6 md:grid-cols-[1fr_auto]">
                  <div className="min-w-0 text-center md:text-left">
                    <h1 className="mb-3 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold text-white sm:text-3xl md:justify-start md:text-4xl">
                      <motion.span animate={{ rotate: [0, 20, -10, 20, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>👋</motion.span>
                      Salut, je suis Victoria
                    </h1>
                    <p className="italic text-[#7d8590]">
                      $ whoami — <span className="not-italic text-[#7ee787]">Lord-sama ▌</span>
                    </p>
                    <p className="mt-3 text-[#c9d1d9]">
                      Développeur fullstack diplômé en Licence Informatique (Génie-Logiciel), je conçois des applications
                      web et mobiles modernes — de l'interface à l'API. Curieux, rigoureux et obsédé par l'UX. ✨
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                      <a href="#projets" className="inline-flex items-center gap-1.5 rounded-md bg-[#1f6feb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#388bfd]">
                        <IoRocketOutline className="h-4 w-4" /> Voir mes projets
                      </a>
                      <a href="#contact" className="inline-flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#30363d]">
                        <FiMail className="h-4 w-4" /> Me contacter
                      </a>
                    </div>
                  </div>
                  <div className="mx-auto w-full max-w-[240px] md:max-w-[280px]">
                    <Player
                      autoplay
                      loop
                      src="https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json"
                      style={{ height: "100%", width: "100%" }}
                    />
                  </div>
                </motion.div>

                {/* ABOUT */}
                <Section id="about" icon={HiOutlineSparkles} title="À propos" kicker="Qui suis-je">
                  <p className="italic text-[#7d8590]">🇨🇬 Pointe-Noire · 🎧 Curieux · 💻 Rigoureux</p>
                  <p className="mt-2">
                    Originaire et résidant à <span className="font-semibold text-white">Pointe-Noire, République du Congo</span>,
                    récemment diplômé au CFI-CIRAS. Actuellement <span className="font-semibold text-white">stagiaire chez Zola-Kimya</span>,
                    je contribue à la conception et au développement de plateformes web/mobiles aux côtés d'une équipe agile.
                  </p>
                  <p className="mt-3">
                    Mon obsession : livrer des produits <span className="text-white font-semibold">rapides, accessibles et maintenables</span>.
                    Je pense architecture avant de coder, je teste avant d'expédier, et je m'attache aux détails d'UX
                    qui font la différence.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { v: "3+", l: "Années", Icon: FiTrendingUp },
                      { v: "10+", l: "Projets", Icon: IoRocketOutline },
                      { v: "25+", l: "Technos", Icon: FiCode },
                      { v: "∞", l: "Cafés", Icon: FiCoffee },
                    ].map(({ v, l, Icon }) => (
                      <motion.div key={l} whileHover={{ y: -3 }} className="rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-center">
                        <Icon className="mx-auto mb-1 h-5 w-5 text-[#7ee787]" />
                        <div className="text-2xl font-bold text-white">{v}</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-wide text-[#7d8590]">{l}</div>
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
          </main>
        </div>

        {/* ============== FULL-WIDTH LOWER AREA ============== */}
        <div className="mt-10 rounded-md border border-[#30363d]">
          <div className="flex items-center justify-between border-b border-[#21262d] px-3 py-2 text-xs text-[#7d8590] sm:px-4">
            <span className="truncate font-mono">Lord-Coding / details<span className="text-[#7d8590]">.md</span></span>
            <span>📖</span>
          </div>

          <div className="p-4 sm:p-6 md:p-10">
            {/* CORE SKILLS */}
            <Section icon={HiOutlineSparkles} title="Compétences clés" kicker="Expertise">
              <div className="grid gap-4 md:grid-cols-2">
                {coreSkills.map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-[#c9d1d9]">{s.label}</span>
                      <span className="text-[#7d8590]">{s.value}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#161b22]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* STACK — vertical categories, each a horizontal marquee */}
            <Section id="stack" icon={FiCode} title="Stack de développement" kicker="Boîte à outils">
              <p className="mb-6">Chaque catégorie défile en boucle — survole pour explorer.</p>
              <div className="space-y-6">
                {skillGroups.map((g, gi) => (
                  <div key={g.title}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#7ee787]">
                        {g.title}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#7ee787]/40 to-transparent" />
                      <span className="font-mono text-[10px] text-[#7d8590]">↓ carousel</span>
                    </div>
                    <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/60 py-2">
                      <Marquee duration={22 + gi * 3} reverse={gi % 2 === 1}>
                        {g.items.map((s) => <SkillPill key={s.name} {...s} />)}
                      </Marquee>
                    </div>
                    {gi < skillGroups.length - 1 && (
                      <div className="mt-3 flex justify-center text-[#30363d]">
                        <FiChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* TIMELINE — improved: alternating cards on desktop, colored central spine */}
            <Section id="parcours" icon={FiTrendingUp} title="Mon parcours" kicker="Timeline">
              <div className="relative">
                {/* Central spine (desktop) / left spine (mobile) */}
                <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#7ee787] via-[#58a6ff] to-[#e3b341] md:left-1/2 md:-translate-x-1/2" />
                <ul className="space-y-8">
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
                        {/* Node */}
                        <span
                          className="absolute left-0 top-2 grid h-9 w-9 place-items-center rounded-full ring-4 ring-[#0d1117] md:left-1/2 md:top-4 md:h-11 md:w-11 md:-translate-x-1/2"
                          style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}55)` }}
                        >
                          <t.Icon className="h-4 w-4 text-white md:h-5 md:w-5" />
                        </span>

                        {/* Card */}
                        <div
                          className={`relative rounded-xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-4 transition hover:border-[#484f58] hover:shadow-lg md:p-5 ${rightSide ? "md:text-left" : "md:text-right"}`}
                          style={{ boxShadow: `0 0 0 1px ${t.color}22` }}
                        >
                          <div className={`mb-2 flex items-center gap-2 ${rightSide ? "" : "md:justify-end"}`}>
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              style={{ background: `${t.color}22`, color: t.color }}
                            >
                              {t.tag}
                            </span>
                            <span className="font-mono text-xs text-[#7d8590]">{t.year}</span>
                          </div>
                          <p className="text-base font-semibold text-white">{t.title}</p>
                          <p className="text-sm text-[#58a6ff]">{t.org}</p>
                          <p className="mt-2 text-sm text-[#c9d1d9]">{t.desc}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </Section>

            {/* LANGUAGES (kept, heatmap removed) */}
            <Section icon={HiOutlineLightBulb} title="Langages les plus utilisés" kicker="Stats">
              <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5">
                <div className="mb-4 flex h-2 w-full overflow-hidden rounded-full">
                  {allSkillPct.map((l) => <span key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />)}
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-3">
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

            {/* PROJECTS — with badges + filter + show all */}
            <Section
              id="projets"
              icon={IoRocketOutline}
              title="Projets"
              kicker="Réalisations"
              action={
                <div className="flex flex-wrap items-center gap-2">
                  {(["all", "personal", "collab"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => { setProjectFilter(f); setShowAllProjects(true); }}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        projectFilter === f
                          ? "border-[#7ee787] bg-[#7ee787]/10 text-[#7ee787]"
                          : "border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:border-[#484f58]"
                      }`}
                    >
                      {f === "all" ? "Tous" : f === "personal" ? "Personnels" : "Collaborations"}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((p, i) => {
                  const isPerso = p.type === "personal";
                  return (
                    <motion.a
                      key={p.title}
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4 }}
                      className="group relative flex flex-col rounded-lg border border-[#30363d] bg-[#0d1117] p-4 transition hover:border-[#484f58] hover:bg-[#161b22]"
                    >
                      {/* Type badge */}
                      <span
                        className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isPerso
                            ? "bg-[#3fb950]/15 text-[#3fb950] ring-1 ring-[#3fb950]/40"
                            : "bg-[#bc8cff]/15 text-[#bc8cff] ring-1 ring-[#bc8cff]/40"
                        }`}
                      >
                        {isPerso ? <FiUser className="h-2.5 w-2.5" /> : <FiUsersDup className="h-2.5 w-2.5" />}
                        {isPerso ? "Perso" : "Collab"}
                      </span>

                      <div className="flex items-start gap-3 pr-16">
                        <span className="text-2xl">{p.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white group-hover:text-[#58a6ff]">{p.title}</p>
                          <p className="mt-0.5 font-mono text-[10px] text-[#7d8590]">{p.year}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-[#c9d1d9]">{p.desc}</p>
                      <p className="mt-2 font-mono text-xs text-[#7ee787]">{p.stack}</p>
                      <FiExternalLink className="absolute bottom-3 right-3 h-4 w-4 text-[#7d8590] opacity-0 transition group-hover:opacity-100" />
                    </motion.a>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#7d8590]">
                  {visibleProjects.length} / {filteredProjects.length} projet(s) affiché(s)
                </p>
                <div className="flex gap-2">
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
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#238636] to-[#2ea043] px-4 py-2 text-sm font-semibold text-white shadow shadow-[#238636]/30 hover:brightness-110"
                  >
                    <SiGithub className="h-4 w-4" /> Tout voir sur GitHub
                  </a>
                </div>
              </div>
            </Section>

            {/* MISSION */}
            <Section icon={FiTarget} title="Ce que je cherche" kicker="Objectifs">
              <ul className="space-y-2">
                <li>🧠 <span className="font-semibold text-white">En cours :</span> React Native, TypeScript avancé, Supabase et déploiement cloud.</li>
                <li>💼 <span className="font-semibold text-white">Objectif :</span> Rejoindre une équipe produit ambitieuse (fullstack / mobile).</li>
                <li>🏹 <span className="font-semibold text-white">Ouvert :</span> Freelance, stages avancés, collaborations long terme.</li>
              </ul>
            </Section>

            {/* CONTACT */}
            <section id="contact" className="scroll-mt-20 pb-2">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#7ee787]">Contact</p>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
                <FiMail className="h-5 w-5 text-[#7ee787]" />
                Un projet en tête ? Discutons-en.
              </h2>
              <p>Disponible pour freelance, stages avancés ou collaborations long terme. Réponse sous 24h.</p>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-3">
                  <a href="mailto:olavictoria016@gmail.com" className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition hover:border-[#484f58]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#EA4335]/20"><FiMail className="h-5 w-5 text-[#EA4335]" /></div>
                    <div className="min-w-0"><p className="text-xs text-[#7d8590]">Email</p><p className="truncate text-sm font-semibold text-white">olavictoria016@gmail.com</p></div>
                  </a>
                  <a href="tel:+242064335097" className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition hover:border-[#484f58]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366]/20"><FiPhone className="h-5 w-5 text-[#25D366]" /></div>
                    <div><p className="text-xs text-[#7d8590]">Téléphone</p><p className="text-sm font-semibold text-white">+242 06 433 5097</p></div>
                  </a>
                  <a href="https://wa.me/242064335097" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition hover:border-[#484f58]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366]/20"><SiWhatsapp className="h-5 w-5 text-[#25D366]" /></div>
                    <div><p className="text-xs text-[#7d8590]">WhatsApp</p><p className="text-sm font-semibold text-white">Discuter maintenant</p></div>
                  </a>
                  <a href="https://github.com/Lord-Coding" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition hover:border-[#484f58]">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><FiGithub className="h-5 w-5 text-white" /></div>
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
      </div>
    </div>
  );
}
