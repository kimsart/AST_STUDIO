export const SUPPLY_CATEGORIES = [
  {
    label: "Paint",
    value: "Paint",
    subcategories: ["Watercolor", "Acrylic", "Oil", "Gouache", "Ink", "Encaustic"],
  },
  {
    label: "Brushes & Tools",
    value: "Brush",
    subcategories: ["Watercolor brushes", "Acrylic brushes", "Oil brushes", "Detail brushes", "Palette knives", "Palette", "Easel"],
  },
  {
    label: "Pastels",
    value: "Pastel",
    subcategories: ["Oil pastel", "Soft pastel", "Chalk pastel", "Pan pastel"],
  },
  {
    label: "Paper",
    value: "Paper",
    subcategories: ["Watercolor paper", "Drawing paper", "Mixed media", "Bristol", "Sketchbook"],
  },
  {
    label: "Canvas & Board",
    value: "Canvas",
    subcategories: ["Stretched canvas", "Canvas board", "Linen", "Wood panel", "Gessoed board"],
  },
  {
    label: "Mediums",
    value: "Medium",
    subcategories: ["Gels", "Varnishes", "Solvents", "Pastes", "Gesso", "Fixative"],
  },
  {
    label: "Other",
    value: "Other",
    subcategories: [],
  },
];

/**
 * Returns the full category option list for dropdowns:
 * default categories → custom categories from saved supplies (sorted) → Other.
 * Custom categories are values not in SUPPLY_CATEGORIES that users previously typed.
 */
export function buildCategoryOptions(sessionSupplies = []) {
  const knownValues = new Set(SUPPLY_CATEGORIES.map(c => c.value));
  const customSet = new Set();
  for (const s of sessionSupplies) {
    if (s.category && !knownValues.has(s.category) && s.category !== "Other") {
      customSet.add(s.category);
    }
  }
  const customEntries = [...customSet].sort().map(name => ({ label: name, value: name, subcategories: [] }));
  const base = SUPPLY_CATEGORIES.filter(c => c.value !== "Other");
  return [...base, ...customEntries, { label: "Other", value: "Other", subcategories: [] }];
}

/**
 * Returns the subcategory option list for a given category: preset
 * subcategories (if any) plus any custom subcategory a user has previously
 * typed for that same category, sorted. Works for both preset categories
 * (e.g. "Paint") and user-created custom categories (e.g. "Ceramics") —
 * a custom category is not second-class and can accumulate its own reusable
 * subcategory list the same way preset categories do.
 */
export function buildSubcategoryOptions(category, sessionSupplies = []) {
  if (!category || category === "Other") return [];
  const preset = SUPPLY_CATEGORIES.find(c => c.value === category)?.subcategories ?? [];
  const knownValues = new Set(preset);
  const customSet = new Set();
  for (const s of sessionSupplies) {
    if (s?.category === category && s.subcategory && !knownValues.has(s.subcategory)) {
      customSet.add(s.subcategory);
    }
  }
  return [...preset, ...[...customSet].sort()];
}
