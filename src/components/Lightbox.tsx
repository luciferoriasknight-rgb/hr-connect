import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

export default function Lightbox({
  images,
  startIndex = 0,
  onClose,
  title,
}: {
  images: string[];
  startIndex?: number;
  onClose: () => void;
  title?: string;
}) {
  const [i, setI] = useState(startIndex);

  const prev = useCallback(() => setI((n) => (n - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setI((n) => (n + 1) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/90 p-3 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={title ? `Capture d'écran : ${title}` : "Capture d'écran"}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Fermer l'aperçu"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <FiX className="h-5 w-5" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Image précédente"
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <motion.img
          key={i}
          src={images[i]}
          alt={title ? `${title} — capture ${i + 1}/${images.length}` : `Capture ${i + 1}/${images.length}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
        />

        {images.length > 1 && (
          <p className="mt-3 font-mono text-xs text-white/70">
            {i + 1} / {images.length}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
