import { supabase } from "../../../lib/supabaseClient";
import LieuxClient from "../../lieux/LieuxClient";
import LieuCard from "../../components/LieuCard";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 0;

// 🧠 SEO dynamique
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ville = decodeURIComponent(slug);

  return {
    title: `${ville} au Pays Basque : les plus beaux lieux à découvrir`,
    description: `Découvrez ${ville}, l’un des joyaux du Pays Basque : plages, randonnées, gastronomie et traditions locales.`,
    alternates: { canonical: `https://decouvrirllepaysbasque.fr/ville/${encodeURIComponent(ville)}` },
  };
}

export default async function VillePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ville = decodeURIComponent(slug);

  const { data: lieux, error } = await supabase
    .from("lieux")
    .select("*")
    .eq("ville", ville)
    .order("created_at", { ascending: false });

  if (error) console.error("Erreur Supabase :", error);

  return (
    <main className="bg-[#fafafa] text-gray-800">
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Découvrir {ville}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Les meilleurs lieux à visiter, les activités à faire et les bonnes adresses à {ville}.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-6 bg-white rounded-3xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Lieux à {ville}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lieux?.map((lieu) => (
            <LieuCard
              key={lieu.slug}
              lieu={{
                ...lieu,
                image_url: lieu.image_urls?.[0] || "https://res.cloudinary.com/diccvjf98/image/upload/v1730364100/fallback.jpg",
              }}
            />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-16 mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-3">🗺️ Explore {ville} sur la carte</h2>
        <LieuxClient lieux={lieux || []} />
      </section>

      {/* === JSON-LD STRUCTURÉ === */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            name: `${ville}, Pays Basque`,
            description: `Découvrez les plus beaux lieux et activités à ${ville}.`,
            image: lieux?.[0]?.image_urls?.[0] || "https://res.cloudinary.com/diccvjf98/image/upload/v1730364100/fallback.jpg",
            geo: {
              "@type": "GeoCoordinates",
              latitude: lieux?.[0]?.latitude || 43.4832,
              longitude: lieux?.[0]?.longitude || -1.5586,
            },
            hasPart: lieux?.map((lieu, i) => ({
              "@type": "TouristAttraction",
              name: lieu.nom,
              url: `https://decouvrirllepaysbasque.fr/lieu/${lieu.slug}`,
              position: i + 1,
            })),
          }),
        }}
      />
    </main>
  );
}
