"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ " + error.message);
      return;
    }

    // ✅ Connexion réussie → redirection
    window.location.href = "/mon-profil";
  }

  return (
    <main className="max-w-sm mx-auto px-6 pt-20 font-dm">
      <h1 className="text-xl font-semibold mb-4 text-center">Connexion</h1>

      <form onSubmit={handleLogin} className="space-y-4">
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
          placeholder="Ton mot de passe 🔒"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium"
        >
          Se connecter
        </button>
      </form>

      {message && <p className="text-center mt-4 text-gray-700">{message}</p>}

      <p className="text-center mt-6 text-sm text-gray-600">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-blue-600 underline">
          S’inscrire
        </Link>
      </p>

      <p className="text-center mt-2 text-sm text-gray-600">
        <Link href="/reset-password" className="text-gray-500 underline">
          Mot de passe oublié ?
        </Link>
      </p>
    </main>
  );
}
