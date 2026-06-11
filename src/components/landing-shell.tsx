import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Building2, Globe2, Moon, Sun, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function LandingShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctaTarget = user
    ? user.role === "candidate" ? "/jobs" : "/dashboard"
    : "/auth";

  const navLinks = [
    { to: "/features", label: t.nav.features },
    { to: "/pricing", label: t.nav.pricing },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Global decorative blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[oklch(0.7_0.2_280)] opacity-30 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-[oklch(0.78_0.18_330)] opacity-25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[440px] w-[440px] rounded-full bg-[oklch(0.78_0.17_200)] opacity-25 blur-3xl" />
        <div className="absolute top-2/3 left-10 h-[360px] w-[360px] rounded-full bg-[oklch(0.82_0.15_150)] opacity-20 blur-3xl" />
      </div>

      {/* Solid header */}
      <header className={cn("sticky top-0 z-50 border-b bg-background transition-shadow", scrolled && "shadow-sm")}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.45_0.22_310)] text-primary-foreground shadow-lg shadow-primary/25">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold tracking-tight">{t.appName}</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-foreground font-medium" }}
                className="hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="hidden sm:inline-flex">
              <Globe2 className="mr-1.5 h-4 w-4" /> {lang.toUpperCase()}
            </Button>
            <Link to={ctaTarget}>
              <Button size="sm" className="gap-1.5">
                {t.nav.getStarted} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenu((v) => !v)} aria-label="Menu">
              {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {menu && (
          <div className="border-t bg-background md:hidden">
            <nav className="flex flex-col px-4 py-3 text-sm">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMenu(false)} className="py-2">{l.label}</Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t bg-background/80 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">{t.appName}</span>
            <span className="hidden md:inline">— {t.landing.footerTagline}</span>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/features">{t.nav.features}</Link>
            <Link to="/pricing">{t.nav.pricing}</Link>
            <Link to="/about">{t.nav.about}</Link>
            <Link to="/contact">{t.nav.contact}</Link>
          </div>
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} RHConnect</div>
        </div>
      </footer>
    </div>
  );
}
