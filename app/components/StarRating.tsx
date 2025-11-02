"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Star } from "lucide-react";

interface StarRatingProps {
  lieuId: number;
  onVote?: () => void;
}

export default function StarRating({ lieuId, onVote }: StarRatingProps) {
  const [note, setNote] = useState<number>(0);
  const [moyenne, setMoyenne] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");

  // 🔹 1. Récupère ou crée un session_id local
  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedId = localStorage.getItem("session_id");
      if (!storedId) {
        storedId = crypto.randomUUID();
        localStorage.setItem("session_id", storedId);
      }
      setSessionId(storedId);
    }
  }, []);

  // 🔹 2. Vérifie si l'utilisateur a déjà voté et charge la moyenne
  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) return;

      // Vérifie si l’utilisateur a déjà noté
      const { data: existing, error: voteError } = await supabase
        .from("notes")
        .select("note")
        .eq("lieu_id", lieuId)
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existing && !voteError) {
        setHasVoted(true);
        setNote(existing.note);
      }

      // Charge la moyenne des notes
      const { data: notes, error: avgError } = await supabase
        .from("notes")
        .select("note")
        .eq("lieu_id", lieuId);

      if (!avgError && notes && notes.length > 0) {
        const moyenneCalc =
          notes.reduce((sum, n) => sum + n.note, 0) / notes.length;
        setMoyenne(moyenneCalc);
      } else {
        setMoyenne(null);
      }
    };

    fetchData();
  }, [lieuId, sessionId]);

  // 🔹 3. Clique sur une étoile
  const handleVote = async (value: number) => {
    if (hasVoted) {
      alert("Tu as déjà noté ce lieu ⭐");
      return;
    }

    setLoading(true);
    setNote(value);

    const { error } = await supabase.from("notes").insert({
      lieu_id: lieuId,
      note: value,
      pseudo: "Visiteur",
      session_id: sessionId,
    });

    setLoading(false);

    if (error) {
      console.error("❌ Erreur insertion note :", error);
      alert("Une erreur est survenue.");
      return;
    }

    setHasVoted(true);

    // ✅ Recharge la moyenne
    const { data: notes } = await supabase
      .from("notes")
      .select("note")
      .eq("lieu_id", lieuId);

    if (notes && notes.length > 0) {
      const moyenneCalc =
        notes.reduce((sum, n) => sum + n.note, 0) / notes.length;
      setMoyenne(moyenneCalc);
    }

    if (onVote) onVote();
  };

  // 🔹 4. Supprimer la note
  const handleDeleteVote = async () => {
    if (!confirm("Souhaites-tu retirer ta note ?")) return;

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("lieu_id", lieuId)
      .eq("session_id", sessionId);

    if (error) {
      console.error("❌ Erreur suppression note :", error);
      alert("Impossible de retirer ta note.");
      return;
    }

    localStorage.removeItem(`voted_${lieuId}`);
    setHasVoted(false);
    setNote(0);

    // Recharge la moyenne
    const { data: notes } = await supabase
      .from("notes")
      .select("note")
      .eq("lieu_id", lieuId);

    if (notes && notes.length > 0) {
      const moyenneCalc =
        notes.reduce((sum, n) => sum + n.note, 0) / notes.length;
      setMoyenne(moyenneCalc);
    } else {
      setMoyenne(null);
    }

    alert("Ta note a été retirée !");
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      {/* === Étoiles === */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            onClick={() => handleVote(value)}
            className={`w-6 h-6 cursor-pointer transition ${
              value <= note ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } hover:scale-110 ${
              hasVoted ? "cursor-not-allowed opacity-70" : ""
            }`}
          />
        ))}
      </div>

      {/* === Statut === */}
      {loading && (
        <p className="text-sm text-gray-400 italic">Enregistrement...</p>
      )}

      {hasVoted && (
        <>
          <p className="text-xs text-gray-500 italic mt-1">
            Merci pour ta note 💛
          </p>
          <button
            onClick={handleDeleteVote}
            className="text-xs text-red-500 underline hover:text-red-700 transition"
          >
            Retirer ma note
          </button>
        </>
      )}

      {/* === Moyenne === */}
      {moyenne !== null && (
        <p className="text-sm text-gray-600">
          Moyenne :{" "}
          <span className="font-semibold">{moyenne.toFixed(1)}</span> / 5 ⭐
        </p>
      )}
      {moyenne === null && (
        <p className="text-sm text-gray-400 italic">
          Aucune note pour le moment
        </p>
      )}
    </div>
  );
}
