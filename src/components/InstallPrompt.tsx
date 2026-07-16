import { useEffect, useState } from "react";
import { FiDownload, FiX } from "react-icons/fi";

const STORAGE_KEY = "lc.pwa-install.dismissed-at";
const COOLDOWN_MS = 1000 * 60 * 60 * 24 * 14; // 14 jours

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ne pas re-proposer si récemment fermé
    const dismissed = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const recently = dismissed && Date.now() - dismissed < COOLDOWN_MS;

    // Déjà installée ? (standalone)
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS
      window.navigator.standalone === true;
    if (standalone) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      if (!recently) setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setEvt(null);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!evt) return;
    try {
      await evt.prompt();
      const choice = await evt.userChoice;
      if (choice.outcome === "dismissed") {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    } finally {
      setVisible(false);
      setEvt(null);
    }
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Installer l'application"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-[#30363d] bg-[#161b22]/95 p-3 shadow-2xl backdrop-blur sm:inset-x-auto sm:right-4"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#238636] to-[#2ea043] text-white">
        <FiDownload className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">Installer Lord-Coding</p>
        <p className="truncate text-xs text-[#7d8590]">Accès rapide depuis l'écran d'accueil, hors ligne.</p>
      </div>
      <button
        onClick={install}
        className="rounded-md bg-gradient-to-r from-[#238636] to-[#2ea043] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
      >
        Installer
      </button>
      <button
        onClick={dismiss}
        aria-label="Ne plus proposer maintenant"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#7d8590] hover:bg-[#21262d] hover:text-white"
      >
        <FiX className="h-4 w-4" />
      </button>
    </div>
  );
}
