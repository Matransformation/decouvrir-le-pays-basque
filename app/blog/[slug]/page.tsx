import { supabase } from "../../../lib/supabaseClient";
import "../../../styles/prose.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("articles")
    .select("title, excerpt, image_url, category")
    .eq("slug", slug)
    .single();

  if (!post)
    return {
      title: "Article introuvable - Découvrir le Pays Basque",
      description:
        "Découvrez les plus beaux lieux, balades et activités au Pays Basque.",
    };

  const url = `https://decouvrirlepaysbasque.fr/blog/${slug}`;

  return {
    title: `${post.title} - Découvrir le Pays Basque`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      images: [{ url: post.image_url }],
      type: "article",
      siteName: "Découvrir le Pays Basque",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // === ARTICLE PRINCIPAL ===
  const { data: post, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post)
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Article introuvable
        </h1>
        <p className="text-gray-600">
          L’article que vous cherchez n’existe plus ou a été déplacé.
        </p>
      </div>
    );

  // === ARTICLES DE LA MÊME CATÉGORIE ===
  const { data: sameCategory } = await supabase
    .from("articles")
    .select("id, title, slug, image_url, excerpt")
    .eq("category", post.category)
    .neq("slug", post.slug)
    .limit(3);

  let recommendations = sameCategory || [];

  // === SI MOINS DE 3 ARTICLES, COMPLÉTER AVEC LES PLUS RÉCENTS ===
  if (recommendations.length < 3) {
    const { data: others } = await supabase
      .from("articles")
      .select("id, title, slug, image_url, excerpt")
      .neq("slug", post.slug)
      .order("created_at", { ascending: false })
      .limit(3 - recommendations.length);

    if (others) {
      recommendations = [...recommendations, ...others];
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* === IMAGE DE COUVERTURE === */}
      {post.image_url && (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 flex flex-col justify-center items-center text-center px-4">
            {post.category && (
              <p className="text-sm uppercase text-white font-semibold mb-2 tracking-wide">
                {post.category}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg max-w-2xl leading-snug">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      {/* === CONTENU === */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-gray-500 text-sm mb-6 text-center">
          Publié le{" "}
          {new Date(post.created_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>

        <article
          className="
            prose 
            prose-lg 
            max-w-none 
            prose-headings:mt-10 
            prose-headings:mb-4 
            prose-p:leading-relaxed 
            prose-p:mb-5 
            prose-li:mb-2 
            prose-ul:my-5 
            prose-img:rounded-lg 
            prose-strong:text-gray-900 
            prose-h2:text-2xl 
            prose-h2:text-red-600 
            prose-h3:text-xl 
            prose-h3:text-gray-800 
            prose-a:text-red-600 hover:prose-a:underline
          "
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />

        {/* === PARTAGE === */}
        <div className="mt-10 border-t pt-6">
          <p className="text-gray-600 mb-2">Partager cet article :</p>
          <div className="flex gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                `https://decouvrirlepaysbasque.fr/blog/${post.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                `https://decouvrirlepaysbasque.fr/blog/${post.slug}`
              )}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600 text-sm"
            >
              Twitter
            </a>
          </div>
        </div>

        {/* === ARTICLES RECOMMANDÉS === */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-16 border-t pt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🔎 Articles recommandés
            </h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {recommendations.map((r) => (
                <a
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="block rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white"
                >
                  {r.image_url && (
                    <img
                      src={r.image_url}
                      alt={r.title}
                      className="w-full h-36 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-red-600 mb-2 line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {r.excerpt}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
