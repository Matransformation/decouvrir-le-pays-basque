"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // ✅ 1) Créer l'utilisateur dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
      setLoading(false);
      return;
    }

    // ✅ 2) Enregistrer le profil dans ta table `users_public`
    await supabase.from("users_public").upsert({
      auth_user_id: data.user?.id,
      email: email,
      prenom: "", // vide pour le moment
      avatar_url: null,
      slug: email.split("@")[0], // exemple temporaire
    });

    setMessage("✅ Compte créé ! Vérifie tes emails pour confirmer.");
    setLoading(false);

    // Option : Redirection après quelques secondes
    setTimeout(() => {
      router.push("/login");
    }, 1200);
  }

  return (
    <main className="max-w-sm mx-auto px-6 pt-20 font-dm">
      <h1 className="text-xl font-semibold mb-6 text-center">Créer un compte</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Ton email ✨"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <input
          type="password"
          placeholder="Choisis un mot de passe 🔒"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-medium"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
    </main>
  );
}
