"use client";
/**
 * FilterSidebar.tsx — Filtres de la page Produits.
 * -----------------------------------------------------------------------------
 * Principe : les filtres sont stockés dans l'URL (?categorie=...&stock=1&tri=...).
 * En changeant l'URL, la page (Server Component) recharge la liste filtrée.
 * Avantage : les filtres sont partageables, on peut revenir en arrière, etc.
 *
 * Filtres câblés : catégories (multi), disponibilité, tri. (On a volontairement
 * simplifié par rapport à la maquette pour ne garder que des filtres réellement
 * fonctionnels ; couleur/taille pourront être ajoutés de la même manière.)
 */
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Cat = { slug: string; name: string; count: number };

export function FilterSidebar({
  categories,
  totalCount,
}: {
  categories: Cat[];
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const selectedCats = (params.get("categorie") ?? "").split(",").filter(Boolean);
  const inStock = params.get("stock") === "1";
  const sort = params.get("tri") ?? "recent";

  // Met à jour l'URL avec les nouveaux paramètres (valeur null/"" = suppression).
  function update(next: Record<string, string | null>) {
    const p = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") p.delete(key);
      else p.set(key, value);
    }
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }

  function toggleCategory(slug: string) {
    const set = new Set(selectedCats);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    update({ categorie: Array.from(set).join(",") || null });
  }

  return (
    <div className="space-y-8">
      {/* Catégories */}
      <fieldset>
        <div className="mb-3 flex items-center justify-between">
          <legend className="font-heading font-semibold text-navy">Catégories</legend>
          {selectedCats.length > 0 && (
            <button
              type="button"
              onClick={() => update({ categorie: null })}
              className="text-xs text-muted hover:text-orange"
            >
              Réinitialiser
            </button>
          )}
        </div>
        <ul className="space-y-2.5">
          <CheckRow
            label="Toutes les catégories"
            count={totalCount}
            checked={selectedCats.length === 0}
            onChange={() => update({ categorie: null })}
          />
          {categories.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.name}
              count={c.count}
              checked={selectedCats.includes(c.slug)}
              onChange={() => toggleCategory(c.slug)}
            />
          ))}
        </ul>
      </fieldset>

      {/* Disponibilité */}
      <fieldset>
        <legend className="mb-3 font-heading font-semibold text-navy">Disponibilité</legend>
        <ul className="space-y-2.5">
          <CheckRow
            label="En stock"
            checked={inStock}
            onChange={() => update({ stock: inStock ? null : "1" })}
          />
        </ul>
      </fieldset>

      {/* Tri */}
      <div>
        <label htmlFor="tri" className="mb-3 block font-heading font-semibold text-navy">
          Trier par
        </label>
        <select
          id="tri"
          value={sort}
          onChange={(e) => update({ tri: e.target.value === "recent" ? null : e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
        >
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Meilleures notes</option>
        </select>
      </div>
    </div>
  );
}

/** Une ligne de case à cocher avec libellé et compteur optionnel. */
function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-ink">
        <span className="flex items-center gap-2.5">
          <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
          {/* Case personnalisée (bleu ciel -> navy quand cochée) */}
          <span className="flex size-5 items-center justify-center rounded bg-sky peer-checked:bg-navy peer-focus-visible:ring-2 peer-focus-visible:ring-orange">
            {checked && (
              <svg viewBox="0 0 12 12" className="size-3 text-white" aria-hidden>
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 6l3 3 5-6"
                />
              </svg>
            )}
          </span>
          {label}
        </span>
        {count !== undefined && <span className="text-muted">{count}</span>}
      </label>
    </li>
  );
}
