import avatarUrl from "@/assets/avatar.jpg";
import {
  MapPin, Link as LinkIcon, Twitter, Send, Users,
  Headphones, Wrench, BarChart3, Rocket, Target, Handshake,
  Github, Mail, ExternalLink, Star, GitCommit, GitPullRequest,
  AlertCircle, Flame, Circle,
} from "lucide-react";

const skills = [
  { name: "Python", color: "#3776AB" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "MongoDB", color: "#47A248" },
  { name: "FastAPI", color: "#009688" },
  { name: "Pandas", color: "#150458" },
  { name: "Backtrader", color: "#8b5cf6" },
  { name: "TradingView", color: "#2962FF" },
  { name: "PineScript", color: "#00d4ff" },
  { name: "Telegram Bot", color: "#26A5E4" },
];

const languages = [
  { name: "Shell", pct: 47.09, color: "#89e051" },
  { name: "Python", pct: 23.92, color: "#3572A5" },
  { name: "JavaScript", pct: 13.56, color: "#f1e05a" },
  { name: "TypeScript", pct: 8.06, color: "#3178c6" },
  { name: "CSS", pct: 4.09, color: "#563d7c" },
  { name: "GLSL", pct: 3.28, color: "#5686a5" },
];

const projects = [
  { emoji: "🎯", title: "Crypto Scanner Bot", desc: "Real-time market scanner with Telegram alerts, ninja-fast." },
  { emoji: "📈", title: "TradingView RSI + Trend Strategy", desc: "PineScript strat with SL/TP and partial exits for max gains." },
  { emoji: "🤖", title: "AI Chart Pattern Shinobi", desc: "TensorFlow-powered pattern recognition for trading edges." },
  { emoji: "⚔️", title: "Swing Trading Auto Scanner", desc: "Screener bot for spotting high-probability setups." },
  { emoji: "📱", title: "Desi Social Media Bot", desc: "Posting bot with Indian flair, powered by FastAPI + MongoDB." },
  { emoji: "🥷", title: "Backtrader AI Framework", desc: "MongoDB-backed backtesting system with AI-driven insights." },
];

const contribGrid = Array.from({ length: 7 * 26 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  const level = r < 0.55 ? 0 : r < 0.75 ? 1 : r < 0.88 ? 2 : r < 0.96 ? 3 : 4;
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
      {/* Top nav bar (GitHub-ish) */}
      <div className="border-b border-[#21262d] bg-[#010409]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
              <Github className="h-4 w-4 text-white" />
            </div>
            <span className="font-mono text-sm font-semibold text-white">denoroy737</span>
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
                  alt="Deno Roy"
                  width={296}
                  height={296}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <span
                aria-label="En ligne"
                className="absolute bottom-3 right-3 h-6 w-6 rounded-full border-4 border-[#0d1117]"
                style={{ background: "#f5a623" }}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">Deno Roy</h1>
              <p className="text-lg text-[#7d8590]">Denoroy737 · he/him</p>
            </div>

            <p className="text-[15px] text-[#c9d1d9]">
              Vibing to epic beats 🎧 Coding trading bots 🤖 Charting markets like a shinobi 🥷
            </p>

            <button className="w-full rounded-md border border-[#30363d] bg-[#21262d] py-1.5 text-sm font-medium text-white hover:bg-[#30363d]">
              Edit profile
            </button>

            <div className="flex items-center gap-2 text-sm text-[#7d8590]">
              <Users className="h-4 w-4" />
              <span><span className="font-semibold text-white">8</span> followers</span>
              <span>·</span>
              <span><span className="font-semibold text-white">40</span> following</span>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-[#c9d1d9]"><MapPin className="h-4 w-4 text-[#7d8590]" /> CryptoEarth</li>
              <li className="flex items-center gap-2 text-[#c9d1d9]"><Circle className="h-4 w-4 text-[#7d8590]" /> Earth</li>
              <li className="flex items-center gap-2 text-[#c9d1d9]"><Twitter className="h-4 w-4 text-[#7d8590]" /> @denoroy737</li>
              <li className="flex items-center gap-2 text-[#58a6ff] hover:underline">
                <LinkIcon className="h-4 w-4 text-[#7d8590]" />
                <a href="#contact">https://telegram.me/Denoroy737</a>
              </li>
            </ul>

            {/* Achievements */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#c9d1d9]">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { emoji: "🦈", ring: "#3fb950" },
                  { emoji: "🎯", ring: "#f1e05a" },
                  { emoji: "🍾", ring: "#e3b341" },
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
                  <span className="grid h-5 w-5 place-items-center rounded bg-[#1f6feb] text-[10px] font-bold text-white">D</span>
                  Developer Program Member
                </li>
                <li className="flex items-center gap-2 text-[#c9d1d9]">
                  <Star className="h-4 w-4 text-[#f1e05a]" />
                  <span className="rounded bg-[#1f2937] px-1.5 text-xs font-bold text-[#f0883e]">PRO</span>
                </li>
              </ul>
            </div>

            {/* Organizations */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#c9d1d9]">Organizations</h3>
              <div className="flex flex-wrap gap-2">
                {["DC", "D", "U"].map((o, i) => (
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
              {/* README header */}
              <div className="flex items-center justify-between border-b border-[#21262d] px-4 py-2 text-xs text-[#7d8590]">
                <div className="flex items-center gap-2">
                  <span className="font-mono">denoroy737 / README<span className="text-[#7d8590]">.md</span></span>
                </div>
                <button className="text-[#7d8590] hover:text-white">✏️</button>
              </div>

              <div className="p-6 md:p-10">
                {/* Title */}
                <div className="mb-8 text-center">
                  <h1 className="mb-3 flex flex-wrap items-center justify-center gap-3 text-3xl font-bold text-white md:text-4xl">
                    <span>👋</span>
                    <span>Deno Roy!</span>
                    <span>🎮</span>
                    <span className="text-[#f0883e]">✨</span>
                  </h1>
                  <p className="italic text-[#7d8590]">
                    Vibing to epic beats 🎧 | Coding trading bots 🤖 | Charting markets like a shinobi 🥷
                  </p>
                  <p className="mt-3 text-[#c9d1d9]">
                    A Python-slinging, algo-trading, anime-loving dreamer on a quest to conquer code and markets! 🚀
                  </p>
                  <div className="mt-5 flex justify-center">
                    <div className="grid h-16 w-16 place-items-center rounded-lg bg-gradient-to-br from-[#3776AB] to-[#FFD43B] text-3xl shadow-lg">
                      🐍
                    </div>
                  </div>
                </div>

                {/* Vibe Statement */}
                <Section icon={Headphones} title="My Vibe Statement">
                  <p className="italic text-[#7d8590]">🧘 + 🎧 + 💻 = <span className="not-italic text-white">Ultimate Flow State</span></p>
                  <p className="mt-2">
                    From slicing through Python code like a samurai to backtesting strategies with ninja precision,
                    I'm always chasing the next level. Add a lo-fi anime OST, and I'm unstoppable. Let's grind, trade, and vibe! 🎵
                  </p>
                </Section>

                {/* Tech Stack */}
                <Section icon={Wrench} title="Tech Stack & Arsenal">
                  <p className="mb-3">My toolkit for coding, trading, and slaying projects:</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => <SkillPill key={s.name} {...s} />)}
                  </div>
                </Section>

                {/* GitHub Stats */}
                <Section icon={BarChart3} title="GitHub Stats & Grind">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Stats card */}
                    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5">
                      <p className="mb-3 text-sm font-semibold text-[#58a6ff]">Deno Roy's GitHub Stats</p>
                      <ul className="space-y-1.5 font-mono text-xs">
                        {[
                          { label: "Total Stars Earned", val: 11, i: "⭐" },
                          { label: "Total Commits (last year)", val: 37, i: "🕒" },
                          { label: "Total PRs", val: 3, i: "🔀" },
                          { label: "Total Issues", val: 6, i: "❗" },
                          { label: "Contributed to (last year)", val: 4, i: "👥" },
                        ].map((r) => (
                          <li key={r.label} className="flex justify-between text-[#c9d1d9]">
                            <span>{r.i} {r.label}:</span>
                            <span className="font-bold text-white">{r.val}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex justify-end">
                        <div className="grid h-14 w-14 place-items-center rounded-full border-4 border-[#f0883e] font-bold text-[#f0883e]">C+</div>
                      </div>
                    </div>

                    {/* Contributions card */}
                    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-white">301</div>
                          <div className="mt-1 text-[11px] uppercase tracking-wide text-[#7d8590]">Total Contributions</div>
                        </div>
                        <div>
                          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-[#39d353] text-2xl">🔥</div>
                          <div className="mt-1 text-[11px] uppercase tracking-wide text-[#7d8590]">Current Streak</div>
                          <div className="text-[10px] text-[#7d8590]">Oct 16 · Oct 17</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white">5</div>
                          <div className="mt-1 text-[11px] uppercase tracking-wide text-[#7d8590]">Longest Streak</div>
                          <div className="text-[10px] text-[#7d8590]">Apr 13 · Apr 17 '22</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contribution graph */}
                  <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117] p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Contribution graph</p>
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
                    <p className="mb-4 text-sm font-semibold text-white">Most Used Languages</p>
                    <div className="mb-4 flex h-2 w-full overflow-hidden rounded-full">
                      {languages.map((l) => (
                        <span key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      {languages.map((l) => (
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
                <Section icon={Rocket} title="Epic Projects & Quests">
                  <ul className="space-y-2.5">
                    {projects.map((p) => (
                      <li key={p.title} className="flex gap-2 rounded-md border border-transparent p-2 hover:border-[#30363d] hover:bg-[#161b22]">
                        <span className="text-lg leading-6">{p.emoji}</span>
                        <p><span className="font-semibold text-white">{p.title}</span>: {p.desc}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 italic text-[#7d8590]">
                    Level up with my <a href="#" className="text-[#58a6ff] hover:underline">repos</a>!
                  </p>
                </Section>

                {/* Mission */}
                <Section icon={Target} title="My Mission & Endgame">
                  <ul className="space-y-2">
                    <li>🧠 <span className="font-semibold text-white">Grinding Now:</span> Mastering AI x Finance for next-gen trading systems.</li>
                    <li>💰 <span className="font-semibold text-white">Ultimate Quest:</span> Build an AI-powered "Aladdin" to dominate markets and automation.</li>
                    <li>🏹 <span className="font-semibold text-white">Side Quests:</span> Sharpening trading edges, conquering college, and indie hacking like a pro.</li>
                  </ul>
                </Section>

                {/* Team Up */}
                <section id="contact" className="pb-2">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                    <Handshake className="h-5 w-5 text-[#7ee787]" />
                    Let's Team Up!
                  </h2>
                  <p>Ready to vibe on code, charts, or anime? Hit me up! 🚀</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      { label: "LinkedIn", color: "#0A66C2", icon: ExternalLink, href: "#" },
                      { label: "Twitter/X", color: "#1DA1F2", icon: Twitter, href: "#" },
                      { label: "Telegram", color: "#26A5E4", icon: Send, href: "https://telegram.me/Denoroy737" },
                      { label: "Email", color: "#EA4335", icon: Mail, href: "mailto:hello@denoroy.dev" },
                    ].map((b) => (
                      <a
                        key={b.label}
                        href={b.href}
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
              © {new Date().getFullYear()} Deno Roy — Built with React, TanStack & lots of ☕
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
