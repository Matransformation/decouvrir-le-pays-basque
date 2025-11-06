"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { slugify } from "@/lib/slugify";
import AvatarUpload from "../components/AvatarUpload";

export default function MonProfilPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [prenom, setPrenom] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string>("");
  const [slug, setSlug] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Charger la session + profil
  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/login";
        return;
      }

      const userId = session.user.id;
      const userEmail = session.user.email ?? "";

      setSessionId(userId);
      setEmail(userEmail);

      // Vérifier si profil existe
      const { data: existing } = await supabase
        .from("users_public")
        .select("*")
        .eq("session_id", userId)
        .maybeSingle();

      // Sinon -> créer
      if (!existing) {
        await supabase.from("users_public").insert({
          session_id: userId,
          email: userEmail,
        });
      }

      // Charger profil
      const { data } = await supabase
        .from("users_public")
        .select("*")
        .eq("session_id", userId)
        .single();

      if (data) {
        setPrenom(data.prenom ?? "");
        setBio(data.bio ?? "");
        setSlug(data.slug ?? "");
        setAvatar(data.avatar_url ?? "");
        setTags(data.tags?.join(", ") ?? "");
      }
    }

    load();
  }, []);

  // Enregistrer
  async function save() {
    if (!sessionId) return setStatus("❌ Pas de session détectée");

    const cleanedSlug = slugify(slug);

    const { data: exists } = await supabase
      .from("users_public")
      .select("id")
      .neq("session_id", sessionId)
      .eq("slug", cleanedSlug)
      .maybeSingle();

    if (exists) return setStatus("⚠️ Ce nom est déjà utilisé.");

    const payload = {
      session_id: sessionId,
      email,
      slug: cleanedSlug,
      prenom,
      bio,
      avatar_url: avatar,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const { error } = await supabase
      .from("users_public")
      .upsert(payload, { onConflict: "session_id" });

    setStatus(error ? "❌ Erreur lors de l’enregistrement" : "✅ Profil mis à jour !");
  }

  return (
    <div className="max-w-xl mx-auto py-14 px-6 font-dm">
      <div className="bg-white shadow-md rounded-3xl p-8 space-y-10 border border-gray-100">

        {/* Avatar + Header */}
        <div className="flex flex-col items-center gap-3">
          <AvatarUpload avatarUrl={avatar} onChange={setAvatar} />

          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>

          <div className="bg-pink-50 text-pink-700 text-xs px-3 py-1.5 rounded-full">
            {email}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-800">Prénom</label>
            <input
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ton prénom"
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Parle un peu de toi..."
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 h-28 resize-none focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="brunch, rando, plages..."
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">Nom de profil (URL)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: romain-basque"
              className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              https://decouvrirlepaysbasque.fr/u/{slugify(slug) || "mon-profil"}
            </p>
          </div>
        </div>

        {status && (
          <p className="text-center text-sm font-semibold text-gray-700 bg-gray-50 border rounded-lg py-2">
            {status}
          </p>
        )}

        <button
          onClick={save}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition shadow-md bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
        >
          Sauvegarder
        </button>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            localStorage.removeItem("session_id");
            window.location.href = "/login";
          }}
          className="w-full py-3 rounded-xl text-gray-700 border font-medium hover:bg-gray-50 transition"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
