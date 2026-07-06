/**
 * FormField.tsx — Briques de formulaire cohérentes (label, champ, erreur).
 * -----------------------------------------------------------------------------
 * Ces composants sont "non contrôlés" (attribut `name`) : ils fonctionnent avec
 * les Server Actions et `useActionState`. Affichez les erreurs par champ via
 * <FieldError messages={state.fieldErrors?.email} />.
 */
import { cn } from "@/lib/utils";

// Style commun aux champs (input + textarea).
const fieldBase =
  "w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink placeholder:text-faint transition-colors focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

export function Label({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 block text-sm font-medium text-navy", className)}>
      {children}
    </label>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-32 resize-y", className)} {...props} />;
}

/** Affiche le premier message d'erreur d'un champ (ou rien). */
export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return <p className="mt-1 text-xs text-danger">{messages[0]}</p>;
}
