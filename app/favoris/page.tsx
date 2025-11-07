"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import { Heart, MapPin } from "lucide-react";

export default function FavorisPage() {
  const [user, setUser] = useState<any>(null);
  const [favoris, setFavoris] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Récupère user connecté
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // ✅ Récupère les favoris liés au user_id
  useEffect(() => {
    if (!user) return;

    const fetchFavoris = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("favoris")
        .select(`
          id,
          lieu_id,
          lieux ( id, nom, ville, categorie, slug, image_url, image_urls )
        `)
        .eq("user_id", user.id);

      if (!error && data) {
        setFavoris(data.map((f: any) => f.lieux));
      }

      setLoading(false);
    };

    fetchFavoris();
  }, [user]);

  const removeFavori = async (lieuId: number) => {
    await supabase
      .from("favoris")
      .delete()
      .eq("lieu_id", lieuId)
      .eq("user_id", user.id);

    setFavoris((prev) => prev.filter((l) => l.id !== lieuId));
  };

  if (!user)
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-gray-500 text-center">
        <p className="mb-4">Connecte-toi pour voir tes favoris ❤️</p>
        <Link
          href="/login"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Se connecter
        </Link>
      </div>
    );

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
        <p className="text-center text-gray-500">Tu n’as encore ajouté aucun lieu.</p>
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
                <Link href={`/lieu/${lieu.slug}`} className="absolute inset-0 z-10" />
                <div className="relative w-full h-48">
                  <Image src={image} alt={lieu.nom} fill className="object-cover" />
                </div>
                <div className="p-4 flex justify-between items-center z-20 relative">
                  <div>
                    <h2 className="text-lg font-semibold">{lieu.nom}</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {lieu.ville}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavori(lieu.id);
                    }}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Heart className="w-5 h-5 fill-red-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
