"use client";

import { useEffect, useState } from "react";
import ShareButton from "../../components/ShareButton";
import ProfileMap from "./ProfileMap";
import { supabase } from "@/lib/supabaseClient";
import { Heart } from "lucide-react";

export default function ProfileClient({ user, slug }: { user: any; slug: string }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(user.likes_count || 0);
  const [lieux, setLieux] = useState<any[]>([]);
  const [lieuxForMap, setLieuxForMap] = useState<any[]>([]);

  // ✅ Déjà liké ?
  useEffect(() => {
    const alreadyLiked = localStorage.getItem(`liked-profile-${user.id}`);
    if (alreadyLiked === "true") setLiked(true);
  }, [user.id]);

  // ❤️ Like profil
  async function toggleLike() {
    if (liked) return;
    setLiked(true);
    setLikesCount((n) => n + 1);
    localStorage.setItem(`liked-profile-${user.id}`, "true");

    await supabase.from("users_public").update({ likes_count: likesCount + 1 }).eq("id", user.id);
  }

  // ✅ Charger les recommandations (favoris) EN CLIENT comme /favoris
  useEffect(() => {
    async function loadFavoris() {
      const { data, error } = await supabase
        .from("favoris")
        .select(`
          lieu_id,
          lieux ( id, nom, slug, ville, latitude, longitude, image_url, image_urls )
        `)
        .eq("user_id", user.session_id);

      if (!error && data) {
        const list = data.map((f: any) => f.lieux).filter(Boolean);
        setLieux(list);

        setLieuxForMap(
          list
            .filter((l: any) => l.latitude && l.longitude)
            .map((l: any) => ({
              id: l.id,
              nom: l.nom,
              slug: l.slug,
              lat: Number(l.latitude),
              lng: Number(l.longitude),
              image: l.image_url ?? l.image_urls?.[0] ?? null,
              ville: l.ville ?? null,
            }))
        );
      }
    }

    loadFavoris();
  }, [user.id]);

  return (
    <main className="max-w-3xl mx-auto pb-20 px-6 font-dm">

      {/* --- HEADER --- */}
      <section className="flex flex-col items-center text-center space-y-4 pt-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 to-purple-500">
            <img
              src={
                user.avatar_url?.length > 5
                  ? user.avatar_url
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${user.prenom || "U"}`
              }
              alt={user.prenom}
              className="w-full h-full rounded-full object-cover border-4 border-white"
            />
          </div>

          <button
            onClick={toggleLike}
            className={`absolute -right-4 -bottom-2 bg-white rounded-full shadow p-2 transition ${
              liked ? "scale-110" : "hover:scale-110"
            }`}
          >
            <Heart className={liked ? "text-red-600 fill-red-600" : "text-gray-500"} size={22} />
          </button>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">{user.prenom}</h1>
        <p className="text-sm text-gray-500">❤️ {likesCount} likes</p>
        <ShareButton url={`https://decouvrirlepaysbasque.fr/u/${slug}`} />

        <p className="text-[14px] text-gray-800 font-medium">📍 {lieux.length} recommandations</p>
      </section>

      {/* --- LISTE DES RECOMMANDATIONS --- */}
      <section className="mt-10">
        <h2 className="text-[16px] font-semibold mb-4">Mes recommandations</h2>

        {lieux.length === 0 && <p className="text-gray-500 text-sm text-center">Aucune recommandation encore ✨</p>}

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {lieux.map((lieu) => (
            <a
              key={lieu.id}
              href={`/lieu/${lieu.slug}`}
              className="min-w-[200px] rounded-xl bg-white shadow-sm hover:shadow-md transition p-2"
            >
              <div className="rounded-lg overflow-hidden h-36 bg-gray-100">
                <img src={lieu.image_urls?.[0] || lieu.image_url || ""} className="w-full h-full object-cover" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 truncate">{lieu.nom}</p>
              {lieu.ville && <p className="text-xs text-gray-500 truncate">📍 {lieu.ville}</p>}
            </a>
          ))}
        </div>
      </section>

      {/* --- CARTE --- */}
      {lieuxForMap.length > 0 && (
        <div className="mt-14">
          <h2 className="text-[16px] font-semibold mb-4">Sur la carte 🗺️</h2>
          <ProfileMap lieux={lieuxForMap} />
        </div>
      )}
    </main>
  );
}
