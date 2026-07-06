"use client";
/**
 * contact/page.tsx — Page "Nous contacter".
 * Carte d'infos (téléphone / email) + formulaire de contact.
 * Le formulaire utilise `useActionState` avec l'action serveur `contactAction`.
 */
import { useActionState } from "react";
import { Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, FieldError } from "@/components/ui/FormField";
import { contactAction } from "@/lib/actions/contact";
import { initialFormState } from "@/lib/types";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  const [state, action, pending] = useActionState(contactAction, initialFormState);

  return (
    <Container className="space-y-8 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />
      <h1 className="font-heading text-3xl font-bold text-navy sm:text-4xl">Nous contacter</h1>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        {/* Infos */}
        <div className="space-y-8 rounded-xl border border-line p-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-orange text-white">
                <Phone className="size-5" aria-hidden />
              </span>
              <h2 className="font-heading font-semibold text-navy">Nous appeler</h2>
            </div>
            <p className="mt-3 text-sm text-muted">Service client disponible 24/7.</p>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-sm font-medium text-navy">
              {SITE.phone}
            </a>
          </div>

          <hr className="border-line" />

          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-orange text-white">
                <Mail className="size-5" aria-hidden />
              </span>
              <h2 className="font-heading font-semibold text-navy">Nous écrire</h2>
            </div>
            <p className="mt-3 text-sm text-muted">Nous répondons sous 24 heures.</p>
            <a href={`mailto:${SITE.email}`} className="break-all text-sm font-medium text-navy">
              {SITE.email}
            </a>
          </div>
        </div>

        {/* Formulaire */}
        <form action={action} className="space-y-4 rounded-xl border border-line p-6">
          {state.ok && (
            <p className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success" role="status">
              {state.message}
            </p>
          )}
          {!state.ok && state.message && (
            <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
              {state.message}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Input name="name" placeholder="Votre nom *" aria-label="Votre nom" />
              <FieldError messages={state.fieldErrors?.name} />
            </div>
            <div>
              <Input name="city" placeholder="Votre ville *" aria-label="Votre ville" />
              <FieldError messages={state.fieldErrors?.city} />
            </div>
            <div>
              <Input name="phone" type="tel" placeholder="Téléphone *" aria-label="Téléphone" />
              <FieldError messages={state.fieldErrors?.phone} />
            </div>
          </div>

          <div>
            <Textarea name="message" placeholder="Votre message *" aria-label="Votre message" />
            <FieldError messages={state.fieldErrors?.message} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={pending}>
              Envoyer
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
