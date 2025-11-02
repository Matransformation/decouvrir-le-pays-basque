import { supabase } from "../../../lib/supabaseClient";
import LieuPageClient from "./LieuPageClient";
import Link from "next/link";

export const revalidate = 0; // désactive le cache

// 🧠 Métadonnées dynamiques enrichies pour le SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { slug } = resolvedParams;

  const { data } = await supabase
    .from("lieux")
    .select("nom, description, image_url, ville, categorie")
    .eq("slug", slug)
    .single();

  const title = data?.nom
    ? `${data.nom} (${data.ville}) - ${data.categorie || "Découverte au Pays Basque"}`
    : "Découvrir le Pays Basque";

  const description =
    data?.description ||
    `Découvrez ${data?.nom || "les plus beaux lieux"} du Pays Basque : randonnées, plages et bons plans.`;

  const keywords = [
    data?.nom,
    data?.ville,
    data?.categorie,
    "Pays Basque",
    "visite",
    "tourisme",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://decouvrirlepaysbasque.com/lieu/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      url: `https://decouvrirlepaysbasque.com/lieu/${slug}`,
      images: data?.image_url ? [data.image_url] : [],
    },
  };
}

export default async function LieuPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { slug } = resolvedParams;

  // 🔍 Récupération du lieu principal
  const { data: lieu, error } = await supabase
    .from("lieux")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !lieu) {
    console.error("Erreur Supabase :", error);
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center text-gray-700">
        <h1 className="text-3xl font-bold mb-3">Lieu introuvable 😢</h1>
        <p className="text-gray-500">Ce lieu n’existe pas ou a été supprimé.</p>
      </div>
    );
  }

  // 🖼️ Images filtrées (aucun carré vide)
  const images: string[] = (
    Array.isArray(lieu.image_urls)
      ? lieu.image_urls.filter((url: string) => !!url && url.trim() !== "")
      : lieu.image_url
      ? [lieu.image_url]
      : []
  ).length
    ? Array.isArray(lieu.image_urls)
      ? lieu.image_urls.filter((url: string) => !!url && url.trim() !== "")
      : [lieu.image_url]
    : ["https://res.cloudinary.com/demo/image/upload/sample.jpg"]; // fallback Cloudinary valide

  // 🗺️ Lieux de la même ville
  const { data: autresLieuxVille } = await supabase
    .from("lieux")
    .select("id, nom, slug, image_url, categorie, ville")
    .eq("ville", lieu.ville)
    .neq("id", lieu.id)
    .limit(6);

  // 🏖️ Lieux de la même catégorie
  const { data: autresLieuxCategorie } = await supabase
    .from("lieux")
    .select("id, nom, slug, image_url, categorie, ville")
    .eq("categorie", lieu.categorie)
    .neq("id", lieu.id)
    .limit(6);

  // ⭐ Notes & Avis depuis Supabase
  const { data: notes } = await supabase
    .from("notes")
    .select("note")
    .eq("lieu_id", lieu.id);

  const moyenne =
    notes && notes.length > 0
      ? (notes.reduce((acc, n) => acc + n.note, 0) / notes.length).toFixed(1)
      : null;

  const { data: commentaires } = await supabase
    .from("commentaires")
    .select("pseudo, message, note, created_at")
    .eq("lieu_id", lieu.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      <LieuPageClient lieu={lieu} images={images} />

      {/* Autres lieux de la même ville */}
      {autresLieuxVille && autresLieuxVille.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Autres lieux à <span className="text-red-600">{lieu.ville}</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {autresLieuxVille.map((autre) => (
              <Link
                key={autre.id}
                href={`/lieu/${autre.slug}`}
                className="block bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {autre.image_url ? (
                  <img
                    src={`${autre.image_url}?auto=format,compress,q_80`}
                    alt={`${autre.nom} - ${autre.ville}`}
                    className="w-full h-40 object-cover"
                  />
                ) : null}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{autre.nom}</h3>
                  <p className="text-sm text-gray-500">
                    {autre.categorie || autre.ville}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 💡 Transition UX */}
      {(autresLieuxVille?.length || autresLieuxCategorie?.length) && (
        <div className="max-w-4xl mx-auto text-center my-16 px-6">
          <div className="bg-gradient-to-r from-red-50 via-white to-red-50 p-8 rounded-2xl shadow-sm border border-red-100">
            <p className="text-xl font-semibold text-gray-800">
              💡 Tu pourrais aussi aimer...
            </p>
            <p className="text-gray-600 mt-2">
              D’autres lieux à découvrir tout près ou dans le même esprit 🌿
            </p>
          </div>
        </div>
      )}

      {/* Autres lieux de la même catégorie */}
      {lieu.categorie && autresLieuxCategorie && autresLieuxCategorie.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Autres lieux de la catégorie{" "}
            <span className="text-red-600">{lieu.categorie}</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {autresLieuxCategorie.map((autre) => (
              <Link
                key={autre.id}
                href={`/lieu/${autre.slug}`}
                className="block bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {autre.image_url ? (
                  <img
                    src={`${autre.image_url}?auto=format,compress,q_80`}
                    alt={`${autre.nom} - ${autre.ville}`}
                    className="w-full h-40 object-cover"
                  />
                ) : null}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{autre.nom}</h3>
                  <p className="text-sm text-gray-500">{autre.ville}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 🧭 Données structurées SEO Local enrichies */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type":
                lieu.categorie?.toLowerCase().includes("restaurant") ||
                lieu.categorie?.toLowerCase().includes("brunch")
                  ? "Restaurant"
                  : lieu.categorie?.toLowerCase().includes("plage")
                  ? "Beach"
                  : lieu.categorie?.toLowerCase().includes("randonnée")
                  ? "TouristAttraction"
                  : "Place",
              name: lieu.nom,
              description: lieu.description || "",
              address: {
                "@type": "PostalAddress",
                addressLocality: lieu.ville,
                streetAddress: lieu.adresse || undefined,
                addressCountry: "France",
              },
              geo:
                lieu.latitude && lieu.longitude
                  ? {
                      "@type": "GeoCoordinates",
                      latitude: lieu.latitude,
                      longitude: lieu.longitude,
                    }
                  : undefined,
              telephone: lieu.telephone || undefined,
              url:
                lieu.site_web ||
                `https://decouvrirlepaysbasque.com/lieu/${lieu.slug}`,
              sameAs: [lieu.instagram, lieu.facebook].filter(Boolean),
              image: images,
              aggregateRating:
                moyenne && notes?.length
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: moyenne,
                      reviewCount: notes.length,
                    }
                  : undefined,
              review:
                commentaires && commentaires.length > 0
                  ? commentaires.map((c) => ({
                      "@type": "Review",
                      author: c.pseudo,
                      datePublished: c.created_at,
                      reviewBody: c.message,
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: c.note,
                      },
                    }))
                  : undefined,
            },
            null,
            2
          ),
        }}
      />

      {/* 🧱 Fil d’Ariane JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Découvrir le Pays Basque",
                item: "https://decouvrirlepaysbasque.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: lieu.categorie || "Lieux",
                item: `https://decouvrirlepaysbasque.com/categorie/${encodeURIComponent(
                  lieu.categorie || "lieux"
                )}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: lieu.nom,
                item: `https://decouvrirlepaysbasque.com/lieu/${lieu.slug}`,
              },
            ],
          }),
        }}
      />
    </>
  );
}
