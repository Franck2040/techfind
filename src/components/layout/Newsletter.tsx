"use client";
/**
 * Newsletter.tsx — Bloc d'inscription à la newsletter (haut du footer).
 * -----------------------------------------------------------------------------
 * Démo front-end : à la soumission on affiche un message de confirmation.
 * Pour une vraie inscription, branchez ici un appel à votre service d'emailing
 * (ex : Server Action qui enregistre l'email en base ou l'envoie à Mailchimp).
 */
import { useState } from "react";
import { Send, Headphones } from "lucide-react";
import { SITE } from "@/lib/site";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-8">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
        <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
          Souscrire à notre newsletter
        </h2>

        <form onSubmit={handleSubmit} className="relative w-full">
          <label htmlFor="newsletter-email" className="sr-only">
            Adresse email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse Email"
            className="w-full rounded-full bg-orange py-3 pl-5 pr-14 text-white placeholder:text-white/80 focus:outline-none focus:ring-2 focus:ring-orange-light"
          />
          <button
            type="submit"
            aria-label="S'inscrire à la newsletter"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/20"
          >
            <Send className="size-5" aria-hidden />
          </button>
        </form>
      </div>

      {/* Contact 24/7 */}
      <div className="flex items-center gap-3 md:border-l md:border-line md:pl-8">
        <Headphones className="size-8 text-orange" aria-hidden />
        <div className="text-sm">
          <p className="text-muted">Contactez-nous 24/7 :</p>
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-navy">
            {SITE.phone}
          </a>
        </div>
      </div>

      {/* Confirmation après inscription */}
      {subscribed && (
        <p className="text-sm font-medium text-success md:col-span-2" role="status">
          Merci ! Votre inscription a bien été prise en compte.
        </p>
      )}
    </div>
  );
}
