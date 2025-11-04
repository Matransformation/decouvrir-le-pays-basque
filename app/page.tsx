import { supabase } from "../lib/supabaseClient";
import SearchBar from "./components/SearchBar";
import LieuCard from "./components/LieuCard";
import Link from "next/link";
import Image from "next/image";
import HomeMiniMap from "./components/HomeMiniMap";

async function BlogPreview() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, slug, image_url, excerpt, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Erreur Supabase (articles):", error);
    return <p className="text-center text-gray-500">Erreur lors du chargement du blog.</p>;
  }

  if (!articles || articles.length === 0) {
    return <p className="text-center text-gray-500">Aucun article pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/blog/${article.slug}`}
          className="block rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition"
        >
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-red-600 mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {article.excerpt}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(article.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export const revalidate = 0;

export const metadata = {
  title: "Découvrir le Pays Basque – Guide local, plages, villages et bons plans",
  description:
    "Le guide local pour explorer le Pays Basque 🇫🇷 : plages, villages, randonnées, restaurants et bons plans. Découvrez les plus belles adresses entre océan et montagne.",
  keywords:
    "Pays Basque, guide local, Biarritz, Bayonne, Saint-Jean-de-Luz, randonnées, plages, restaurants, villages, bons plans",
  robots: "index,follow",
  alternates: {
    canonical: "https://decouvrirlepaysbasque.fr/",
    languages: { fr: "https://decouvrirlepaysbasque.fr/" },
  },
};


export default async function Home() {
  const { data: lieux, error } = await supabase
    .from("lieux")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) console.error("Erreur Supabase:", error);

  // ✅ Images compressées Cloudinary (q_60)
  const categories = [
    { name: "Plages", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761918619/Plages_co%CC%82te_basque_hczizy.jpg" },
    { name: "Restaurants", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761918620/Restaurants_co%CC%82te_basque_bf6zir.jpg" },
    { name: "Randonnées", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761918620/Randonne%CC%81es_co%CC%82te_basque_gffivs.jpg" },
    { name: "Villages", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761918620/Villages_co%CC%82te_basque_gsu6gp.jpg" },
    { name: "Hébergements", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761918619/Hebergements_co%CC%82te_basque_ioz58z.jpg" },
    { name: "Culture & traditions", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761918619/Cultures_et_tradition_co%CC%82te_basque_czpj9h.jpg" },
    { name: "Activités", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761941411/activite%CC%81s_co%CC%82te_basque_dee5qx.jpg" },
    { name: "Activités enfants", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761941733/activite%CC%81s_enfants_co%CC%82te_basque_wutbh4.jpg" },
    { name: "Brunch", image: "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400,c_fill/v1761942132/Brunch_co%CC%82te_basque_mgcedp.jpg" },
  ];

  return (
    <main className="bg-[#fafafa] text-gray-800">
      {/* === HERO === */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <Image
          src="https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_70,w_1600,h_900,c_fill/v1761916136/Votre_texte_de_paragraphe_wt8w7a.jpg"
          alt="Pays Basque – entre mer et montagne"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4 text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-xl mb-4">
            Quelle destination au Pays Basque ? 🇫🇷
          </h1>
          <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
            Des idées locales pour savourer, explorer et s’évader entre montagne et océan.
          </p>

          {/* ✅ Barre de recherche */}
          <div className="w-full max-w-xl mt-2 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 104.38 9.05l3.04 3.04a.75.75 0 101.06-1.06l-3.04-3.04A5.5 5.5 0 009 3.5zM4.5 9a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"
                clipRule="evenodd"
              />
            </svg>
            <div className="relative backdrop-blur-sm">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* === CATÉGORIES === */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Explore par univers</h2>
        <p className="text-center text-gray-500 mb-10">
          Que tu sois plutôt plage, montagne ou bonne table, le Pays Basque a tout pour toi 🌶️
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categorie/${encodeURIComponent(cat.name)}`}
              className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg group"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-36 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
              <h3 className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* === LIEUX RÉCENTS === */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-white rounded-3xl shadow-sm">
        <h2 className="text-3xl font-bold mb-8 text-center">Les derniers lieux ajoutés</h2>
        {lieux && lieux.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {lieux.map((lieu) => (
      <LieuCard
        key={lieu.slug}
        lieu={{
          ...lieu,
          image_url:
            lieu.image_url
              ? `${lieu.image_url}?f_auto,q_60,w_600,h_400,c_fill`
              : "https://res.cloudinary.com/diccvjf98/image/upload/f_auto,q_60,w_600,h_400/v1730364100/fallback.jpg",
        }}
      />
    ))}
  </div>
) : (
  <p className="text-center text-gray-500">Aucun lieu n’a encore été ajouté.</p>
)}


        <div className="text-center mt-10">
          <Link
            href="/categorie/Plages"
            className="inline-block bg-[#e63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d62839] transition"
          >
            Voir la carte complète →
          </Link>
        </div>
      </section>

      {/* === DERNIERS ARTICLES DE BLOG === */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Les derniers articles du blog</h2>
        <p className="text-center text-gray-500 mb-10">
          Inspirations, balades et bons plans pour découvrir le Pays Basque autrement 🌿
        </p>

        {/* 🔥 Chargement des articles depuis Supabase */}
        {/** On ajoute ce bloc juste avant la carte */}
        <BlogPreview />
      </section>

      {/* === APERÇU CARTE === */}
      <HomeMiniMap />
    </main>
  );
}
