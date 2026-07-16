import { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

/**
 * Charge le player Lottie uniquement lorsque le conteneur devient visible
 * (IntersectionObserver) et affiche un skeleton pendant l'attente.
 */
export default function LazyLottie({
  src,
  className,
  ariaLabel,
}: {
  src: string;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    // Diffère le montage d'un frame pour ne pas bloquer le rendu initial
    const id = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(id);
  }, [visible]);

  return (
    <div ref={ref} className={className} aria-label={ariaLabel} role="img">
      {mounted ? (
        <Player autoplay loop src={src} style={{ height: "100%", width: "100%" }} />
      ) : (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#161b22] to-[#0d1117]">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_30%_30%,rgba(126,231,135,0.08),transparent_60%)]" />
        </div>
      )}
    </div>
  );
}
