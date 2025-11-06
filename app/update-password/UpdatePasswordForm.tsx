"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const params = useSearchParams();

  useEffect(() => {
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      });
    }
  }, [params]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    setMessage("✅ Mot de passe mis à jour !");
    setTimeout(() => (window.location.href = "/login"), 1000);
  }

  return (
    <main className="max-w-sm mx-auto px-6 pt-20 font-dm">
      <h1 className="text-xl font-semibold mb-4 text-center">Nouveau mot de passe</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="password"
          placeholder="Ton nouveau mot de passe 🔒"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium"
        >
          Mettre à jour
        </button>
      </form>

      {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
    </main>
  );
}
