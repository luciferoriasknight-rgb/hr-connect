import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineUser, HiOutlinePaperAirplane } from "react-icons/hi";
import { FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80),
  email: z.string().trim().email("Email invalide").max(160),
  subject: z.string().trim().min(3, "Sujet trop court").max(120),
  message: z.string().trim().min(10, "Message trop court").max(2000),
});
type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // Opens the user's mail client with a prefilled message — no backend needed.
    const body = `Bonjour Victoria,%0D%0A%0D%0A${encodeURIComponent(data.message)}%0D%0A%0D%0A—%0D%0A${encodeURIComponent(data.name)}%0D%0A${encodeURIComponent(data.email)}`;
    const mailto = `mailto:olavictoria016@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${body}`;
    window.location.href = mailto;
    toast.success("Message prêt à envoyer dans votre client mail.");
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 4000);
  };

  const inputCls =
    "w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 pl-10 text-sm text-white placeholder-[#6e7681] outline-none transition focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/30";

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="grid gap-4 rounded-lg border border-[#30363d] bg-[#0d1117] p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#c9d1d9]">Nom</label>
          <div className="relative">
            <HiOutlineUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8590]" />
            <input {...register("name")} className={inputCls} placeholder="Votre nom" />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#c9d1d9]">Email</label>
          <div className="relative">
            <HiOutlineMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8590]" />
            <input {...register("email")} className={inputCls} placeholder="vous@exemple.com" />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-[#c9d1d9]">Sujet</label>
        <div className="relative">
          <FiMessageSquare className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8590]" />
          <input {...register("subject")} className={inputCls} placeholder="Proposition, mission, question…" />
        </div>
        {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-[#c9d1d9]">Message</label>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full resize-y rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-white placeholder-[#6e7681] outline-none transition focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/30"
          placeholder="Parlez-moi de votre projet…"
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#238636] to-[#2ea043] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#238636]/20 transition hover:brightness-110 disabled:opacity-50"
      >
        {sent ? (
          <>
            <FiCheckCircle className="h-4 w-4" /> Envoyé
          </>
        ) : (
          <>
            <HiOutlinePaperAirplane className="h-4 w-4 rotate-90" /> Envoyer le message
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
