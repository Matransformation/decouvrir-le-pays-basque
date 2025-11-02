// app/sitemap.ts
import { supabase } from "../lib/supabaseClient";

export const revalidate = 3600; // ♻️ régénération toutes les 1h

export default async function sitemap() {
  // 🔍 On récupère tous les slugs depuis la table "lieux"
  const { data: lieux } = await supabase
    .from("lieux")
    .select("slug, updated_at");

  // 🔗 On crée les entrées du sitemap
  const lieuUrls =
    lieux?.map((lieu) => ({
      url: `https://decouvrirlepaysbasque.com/lieu/${lieu.slug}`,
      lastModified: lieu.updated_at ? new Date(lieu.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })) || [];

  // 🏠 Page d’accueil + autres pages statiques éventuelles
  const staticUrls = [
    {
      url: "https://decouvrirlepaysbasque.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  return [...staticUrls, ...lieuUrls];
}
