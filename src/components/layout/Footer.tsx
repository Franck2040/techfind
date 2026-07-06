/**
 * Footer.tsx — Pied de page du site (statique, rendu côté serveur).
 * Contient : bloc newsletter, coordonnées, colonnes de liens, réseaux sociaux.
 * Où modifier les liens/coordonnées : src/lib/site.ts (FOOTER_LINKS, SITE).
 */
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Newsletter } from "@/components/layout/Newsletter";
import { GoogleIcon, FacebookIcon, WhatsappIcon } from "@/components/ui/SocialIcons";
import { SITE, FOOTER_LINKS } from "@/lib/site";

const socials = [
  { label: "Google", href: "https://google.com", Icon: GoogleIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  {
    label: "WhatsApp",
    href: `https://wa.me/${SITE.phone.replace(/[^0-9]/g, "")}`,
    Icon: WhatsappIcon,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-navy text-white">
      <Container className="py-10">
        <Newsletter />

        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Marque + adresse + réseaux */}
          <div>
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              {SITE.addressLine1}
              <br />
              {SITE.addressLine2}
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-white transition-transform hover:scale-110"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {Object.values(FOOTER_LINKS).map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-heading text-base font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-orange-light">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5 text-center text-sm text-white/70">
          © {year} {SITE.name}. Tous droits réservés.
        </Container>
      </div>
    </footer>
  );
}
