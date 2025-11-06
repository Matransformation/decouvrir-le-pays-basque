"use client";

import { useEffect, useState } from "react";
import ShareButton from "../../components/ShareButton";
import ProfileMap from "./ProfileMap";
import { supabase } from "@/lib/supabaseClient";
import { Heart } from "lucide-react";

export default function ProfileClient({
  user,
  lieux,
  lieuxForMap,
  slug,
}: {
  user: any;
  lieux: any[];
  lieuxForMap: any[];
  slug: string;
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(user.likes_count || 0);

  // Vérifier si déjà liké via localStorage
  useEffect(() => {
    const alreadyLiked = localStorage.getItem(`liked-profile-${user.session_id}`);
    if (alreadyLiked === "true") {
      setLiked(true);
    }
  }, [user.session_id]);

  async function toggleLike() {
    // Si on a déjà liké → on empêche le unlike pour simplifier
    if (liked) return;

    setLiked(true);
    setLikesCount(likesCount + 1);

    localStorage.setItem(`liked-profile-${user.session_id}`, "true");

    await supabase
      .from("users_public")
      .update({ likes_count: likesCount + 1 })
      .eq("session_id", user.session_id);
  }

  return (
    <main className="max-w-3xl mx-auto pb-20 px-6 font-dm">

      {/* --- HEADER --- */}
      <section className="flex flex-col items-center text-center space-y-4 pt-10">

        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 to-purple-500">
            <img
              src={
                user.avatar_url && user.avatar_url.length > 5
                  ? user.avatar_url
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user.prenom || user.email || "U"
                    )}`
              }
              alt={user.prenom}
              className="w-full h-full rounded-full object-cover border-4 border-white"
            />
          </div>

          {/* ❤️ Like */}
          <button
            onClick={toggleLike}
            className={`absolute -right-4 -bottom-2 bg-white rounded-full shadow p-2 transition ${
              liked ? "scale-110" : "hover:scale-110"
            }`}
          >
            <Heart
              className={liked ? "text-red-600 fill-red-600" : "text-gray-500"}
              size={22}
            />
          </button>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">{user.prenom}</h1>

        <p className="text-sm text-gray-500">❤️ {likesCount} likes</p>

        {user.bio && (
          <p className="text-gray-600 text-[15px] leading-snug max-w-md">
            {user.bio}
          </p>
        )}

        {user.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {user.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-[4px] text-[13px] bg-gray-100 rounded-full border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <ShareButton url={`https://decouvrirlepaysbasque.fr/u/${slug}`} />

        <p className="text-[14px] text-gray-800 font-medium">
          📍 {lieux.length} recommandations
        </p>
      </section>

      {/* --- RECOMMANDATIONS + SLIDER --- */}
<section className="mt-10">
  <h2 className="text-[16px] font-semibold mb-4">Mes recommandations</h2>

  {lieux.length === 0 && (
    <p className="text-gray-500 text-sm text-center">Aucune recommandation encore ✨</p>
  )}

  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
    {lieux.map((lieu: any) => (
      <a
        key={lieu.id}
        href={`/lieu/${lieu.slug}`}
        className="min-w-[200px] sm:min-w-[230px] flex-shrink-0 rounded-xl bg-white shadow-sm hover:shadow-md transition p-2"
      >
        <div className="rounded-lg overflow-hidden h-36 sm:h-40 bg-gray-100">
          <img
            src={lieu.image_urls?.[0] || ""}
            alt={lieu.nom}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
          />
        </div>

        <p className="mt-2 text-sm font-medium text-gray-800 truncate">
          {lieu.nom}
        </p>

        {lieu.ville && (
          <p className="text-xs text-gray-500 truncate">
            📍 {lieu.ville}
          </p>
        )}
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
