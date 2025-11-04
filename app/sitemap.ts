// app/sitemap.ts
import { MetadataRoute } from "next";
import { supabase } from "../lib/supabaseClient";

export const revalidate = 3600; // ♻️ Régénération toutes les 1h

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://decouvrirlepaysbasque.fr";

  /* ============================================================
     1️⃣ Lieux dynamiques
  ============================================================ */
  const { data: lieux } = await supabase
    .from("lieux")
    .select("slug, updated_at");

  const lieuUrls =
    lieux?.map((lieu) => ({
      url: `${baseUrl}/lieu/${lieu.slug}`,
      lastModified: lieu.updated_at ? new Date(lieu.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  /* ============================================================
     2️⃣ Catégories principales (fixes)
  ============================================================ */
  const categories = [
    "Plages",
    "Restaurants",
    "Randonnées",
    "Villages",
    "Hébergements",
    "Culture & traditions",
    "Activités",
    "Activités enfants",
    "Brunch",
  ];

  const categorieUrls = categories.map((cat) => ({
    url: `${baseUrl}/categorie/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* ============================================================
     3️⃣ Villes (récupérées depuis Supabase)
  ============================================================ */
  const { data: villes } = await supabase
    .from("lieux")
    .select("ville")
    .not("ville", "is", null);

  const uniqueVilles = Array.from(new Set(villes?.map((v) => v.ville).filter(Boolean)));

  const villeUrls = uniqueVilles.map((ville) => ({
    url: `${baseUrl}/ville/${encodeURIComponent(ville!)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  /* ============================================================
     4️⃣ Pages statiques
  ============================================================ */
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/mes-favoris`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/mes-interactions`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  /* ============================================================
     ✅ Fusion et retour du sitemap complet
  ============================================================ */
  return [...staticUrls, ...categorieUrls, ...villeUrls, ...lieuUrls];
}
