"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilsPage() {
  const [profils, setProfils] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("users_public")
        .select("session_id, slug, prenom, bio, tags, avatar_url, likes_count") // ✅ ajouté
        .order("likes_count", { ascending: false }); // ✅ les + aimés en premier

      setProfils(data || []);
    }
    load();
  }, []);

  const filtered = profils.filter((u) => {
    const text = `${u.prenom} ${u.bio} ${u.tags?.join(" ")}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 font-dm">
      <h1 className="text-2xl font-semibold mb-6 text-center">Explorer les profils</h1>

      {/* 🔍 Barre de recherche */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Rechercher un profil, une passion, un style… ✨"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-full shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
        />
      </div>

      {/* 🟣 Grille style Instagram */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {filtered.map((user) => (
          <Link
            key={user.session_id}
            href={`/u/${user.slug || user.session_id}`}
            className="flex flex-col items-center group"
          >
            {/* Avatar cercle gradient */}
            <div className="p-[3px] rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 group-hover:scale-105 transition transform">
              <img
                src={
                  user.avatar_url && user.avatar_url.length > 5
                    ? user.avatar_url
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        user.prenom || user.email || "U"
                      )}`
                }
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white"
              />
            </div>

            {/* Nom */}
            <p className="mt-3 font-medium text-sm sm:text-base">
              {user.prenom || "Sans nom"}
            </p>

            {/* Tags */}
            {user.tags?.length > 0 && (
              <p className="text-[13px] text-gray-500 line-clamp-1">
                {user.tags.join(" • ")}
              </p>
            )}

            {/* ❤️ Likes */}
            <p className="text-xs text-gray-400 mt-1">
              ❤️ {user.likes_count ?? 0} likes
            </p>
          </Link>
        ))}
      </div>

      {/* Aucun résultat */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Aucun profil ne correspond à ta recherche 😢
        </p>
      )}
    </main>
  );
}
