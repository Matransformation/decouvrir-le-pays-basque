export function slugify(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric
      .replace(/^-+|-+$/g, "") // trim - at start/end
      .slice(0, 30); // avoid super long slugs
  }
  