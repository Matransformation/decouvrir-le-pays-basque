"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import { Heart, MapPin } from "lucide-react";

interface Lieu {
  id: number;
  nom: string;
  ville: string;
  categorie?: string;
  slug: string;
  image_url?: string;
  image_urls?: string[];
}

export default function FavorisPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [favoris, setFavoris] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);

  // 🆔 Récupère le session_id du client
  useEffect(() => {
    const id = localStorage.getItem("session_id");
    if (id) setSessionId(id);
  }, []);

  // 🔹 Récupère les favoris depuis Supabase
  useEffect(() => {
    if (!sessionId) return;

    const fetchFavoris = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("favoris")
        .select(
          `
          id,
          lieu_id,
          lieux ( id, nom, ville, categorie, slug, image_url, image_urls )
        `
        )
        .eq("session_id", sessionId);

      if (!error && data) {
        const lieux = data.map((f: any) => f.lieux);
        setFavoris(lieux);
      }

      setLoading(false);
    };

    fetchFavoris();
  }, [sessionId]);

  // ❤️ Supprimer un favori
  const removeFavori = async (lieuId: number) => {
    await supabase
      .from("favoris")
      .delete()
      .eq("lieu_id", lieuId)
      .eq("session_id", sessionId);

    setFavoris((prev) => prev.filter((l) => l.id !== lieuId));
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-gray-500">
        Chargement...
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        ❤️ Mes favoris
      </h1>

      {favoris.length === 0 ? (
        <p className="text-center text-gray-500">
          Vous n’avez encore ajouté aucun lieu à vos favoris.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoris.map((lieu) => {
            const image =
              lieu.image_urls?.[0] ||
              lieu.image_url ||
              "https://res.cloudinary.com/diccvjf98/image/upload/v1730364100/fallback.jpg";

            return (
              <div
                key={lieu.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative group"
              >
                {/* === Lien global sur toute la carte === */}
                <Link href={`/lieu/${lieu.slug}`} className="absolute inset-0 z-10" />

                {/* === Image === */}
                <div className="relative w-full h-48">
                  <Image
                    src={image}
                    alt={lieu.nom}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* === Contenu === */}
                <div className="p-4 flex flex-col justify-between h-full relative z-20">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      {lieu.nom}
                    </h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {lieu.ville}
                    </p>
                    {lieu.categorie && (
                      <p className="text-xs text-gray-400 mt-1 italic">
                        {lieu.categorie}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition">
                      Voir le lieu →
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeFavori(lieu.id);
                      }}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Heart className="w-5 h-5 fill-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
