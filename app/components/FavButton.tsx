"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

interface FavButtonProps {
  lieuId: number;
}

export default function FavButton({ lieuId }: FavButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 1. Crée ou récupère le session_id local
  useEffect(() => {
    let storedId = localStorage.getItem("session_id");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("session_id", storedId);
    }
    setSessionId(storedId);
  }, []);

  // 🔹 2. Vérifie si le lieu est déjà dans les favoris
  useEffect(() => {
    const checkFav = async () => {
      if (!sessionId) return;
      const { data, error } = await supabase
        .from("favoris")
        .select("id")
        .eq("lieu_id", lieuId)
        .eq("session_id", sessionId)
        .maybeSingle();

      if (!error && data) setIsFav(true);
    };
    checkFav();
  }, [lieuId, sessionId]);

  // 🔹 3. Ajout / suppression de favori
  const toggleFav = async () => {
    if (!sessionId || loading) return;
    setLoading(true);
    setMessage(null);

    try {
      if (isFav) {
        // 🔸 Retirer le favori
        const { error } = await supabase
          .from("favoris")
          .delete()
          .eq("lieu_id", lieuId)
          .eq("session_id", sessionId);

        if (error) throw error;

        setIsFav(false);
        setMessage("Retiré des favoris 💔");
      } else {
        // 🔸 Ajouter le favori
        const { error } = await supabase.from("favoris").insert({
          lieu_id: lieuId,
          session_id: sessionId,
        });

        if (error) {
          if (error.message.includes("duplicate key value"))
            setMessage("Ce lieu est déjà dans tes favoris ❤️");
          else throw error;
        } else {
          setIsFav(true);
          setMessage("Ajouté aux favoris ❤️");
        }
      }
    } catch (err) {
      console.error("Erreur favoris :", err);
      setMessage("Une erreur est survenue 😔");
    } finally {
      setLoading(false);
      // Message temporaire (3s)
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={toggleFav}
        disabled={loading}
        className="relative group"
        title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart
          className={`w-7 h-7 cursor-pointer transition ${
            isFav
              ? "fill-red-600 text-red-600 scale-110"
              : "text-gray-300 group-hover:text-red-500"
          } ${loading ? "opacity-50 cursor-wait" : ""}`}
        />
      </button>

      {message && (
        <p className="text-xs text-gray-500 italic text-center mt-1">
          {message}
        </p>
      )}
    </div>
  );
}
