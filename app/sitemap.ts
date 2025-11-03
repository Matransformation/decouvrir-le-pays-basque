// app/sitemap.ts
import { MetadataRoute } from "next";
import { supabase } from "../lib/supabaseClient";

export const revalidate = 3600; // ♻️ régénération automatique toutes les 1h

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://decouvrirlepaysbasque.fr"; // 🔹 ton domaine officiel

  // 🔍 Récupération des lieux dans Supabase
  const { data: lieux } = await supabase
    .from("lieux")
    .select("slug, updated_at");

  // 🔗 Génération des URLs dynamiques
  const lieuUrls =
    lieux?.map((lieu) => ({
      url: `${baseUrl}/lieu/${lieu.slug}`,
      lastModified: lieu.updated_at ? new Date(lieu.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  // 🏠 Pages statiques (accueil, autres si tu veux en ajouter plus tard)
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];

  // ✅ Fusion et retour du sitemap complet
  return [...staticUrls, ...lieuUrls];
}
