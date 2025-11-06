"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) return setMessage("❌ " + error.message);

    setMessage("📩 Vérifie tes emails ! Clique sur le lien pour changer ton mot de passe.");
  }

  return (
    <main className="max-w-sm mx-auto px-6 pt-20 font-dm">
      <h1 className="text-xl font-semibold mb-4 text-center">Mot de passe oublié</h1>

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          placeholder="Ton email ✨"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium"
        >
          Envoyer le lien
        </button>
      </form>

      {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
    </main>
  );
}
