import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export const revalidate = 60; // revalidation automatique (60 sec)

export default async function BlogPage({
    searchParams,
  }: {
    searchParams: Promise<{ categorie?: string }>;
  }) {
    const { categorie } = await searchParams;
    const selectedCategory = categorie || "Toutes";
  

  // --- Charger tous les articles ---
  const { data: posts, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <p className="text-center text-red-600 mt-10">
        ❌ Erreur lors du chargement des articles.
      </p>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Le blog du Pays Basque 🇫🇷
        </h1>
        <p className="text-gray-500">Aucun article publié pour le moment.</p>
      </main>
    );
  }

  // --- Extraire les catégories uniques ---
  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean))
  ) as string[];

  // --- Filtrer les articles si une catégorie est sélectionnée ---
  const filteredPosts =
    selectedCategory === "Toutes"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-8">
        Le blog du Pays Basque 🇫🇷
      </h1>

      {/* === FILTRES CATÉGORIES === */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <Link
          href="/blog"
          className={`px-4 py-2 rounded-full border text-sm transition ${
            selectedCategory === "Toutes"
              ? "bg-red-600 text-white border-red-600"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          Toutes
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?categorie=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selectedCategory === cat
                ? "bg-red-600 text-white border-red-600"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* === LISTE D’ARTICLES === */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block bg-white shadow hover:shadow-lg rounded-xl overflow-hidden transition"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              {post.category && (
                <span className="inline-block text-xs text-red-600 font-semibold mb-2 uppercase tracking-wide">
                  {post.category}
                </span>
              )}
              <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {post.excerpt}
              </p>
              <p className="text-xs text-gray-400">
                Publié le{" "}
                {new Date(post.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* === MESSAGE SI AUCUN ARTICLE TROUVÉ === */}
      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          Aucun article trouvé dans cette catégorie.
        </p>
      )}
    </main>
  );
}
