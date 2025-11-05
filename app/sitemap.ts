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
     2️⃣ Catégories de lieux (dynamiques dans Supabase)
  ============================================================ */
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at");

  const categorieUrls =
    categories?.map((cat) => ({
      url: `${baseUrl}/categorie/${cat.slug}`,
      lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) ?? [];

  /* ============================================================
     3️⃣ Villes
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
     4️⃣ Articles de blog
  ============================================================ */
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at");

  const postUrls =
    posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  /* ============================================================
     5️⃣ Catégories du blog
  ============================================================ */
  const { data: blogCategories } = await supabase
    .from("blog_categories")
    .select("slug, updated_at");

  const blogCategorieUrls =
    blogCategories?.map((c) => ({
      url: `${baseUrl}/blog/categorie/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) ?? [];

  /* ============================================================
     6️⃣ Pages statiques (dont Agenda)
  ============================================================ */
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/agenda`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
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
     ✅ Fusion & retour
  ============================================================ */
  return [
    ...staticUrls,
    ...categorieUrls,
    ...villeUrls,
    ...lieuUrls,
    ...postUrls,
    ...blogCategorieUrls,
  ];
}
