"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Comment {
  id: number;
  pseudo: string;
  message: string;
  created_at: string;
  session_id?: string;
}

interface CommentSectionProps {
  lieuId: number;
}

export default function CommentSection({ lieuId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pseudo, setPseudo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  const [userCommentId, setUserCommentId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 🔹 Récupère ou crée un session_id
  const sessionId =
    typeof window !== "undefined"
      ? localStorage.getItem("session_id") ||
        (() => {
          const id = crypto.randomUUID();
          localStorage.setItem("session_id", id);
          return id;
        })()
      : "anonyme";

  // 🔹 Vérifie si l'utilisateur a déjà commenté ce lieu
  useEffect(() => {
    const checkExistingComment = async () => {
      const { data, error } = await supabase
        .from("commentaires")
        .select("id")
        .eq("lieu_id", lieuId)
        .eq("session_id", sessionId)
        .maybeSingle();

      if (data && !error) {
        setHasCommented(true);
        setUserCommentId(data.id);
      }
    };
    if (sessionId) checkExistingComment();
  }, [lieuId, sessionId]);

  // 🔹 Charger les commentaires existants
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("commentaires")
        .select("*")
        .eq("lieu_id", lieuId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur chargement commentaires :", error);
        setErrorMsg("Impossible de charger les commentaires 😔");
        return;
      }

      setComments(data || []);
    };

    fetchComments();
  }, [lieuId]);

  // 🔹 Ajouter un commentaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (hasCommented) {
      setErrorMsg("Tu as déjà laissé un commentaire 💬");
      return;
    }

    if (!message.trim()) {
      setErrorMsg("Merci d’écrire un petit message !");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("commentaires")
      .insert({
        lieu_id: lieuId,
        pseudo: pseudo.trim() || "Visiteur",
        message: message.trim(),
        session_id: sessionId,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error("Erreur insertion commentaire :", error);

      // 🔹 Gestion spécifique du doublon (contrainte unique)
      if (error.message?.includes("duplicate key value")) {
        setErrorMsg("Tu as déjà commenté ce lieu 💬");
        setHasCommented(true);
        return;
      }

      setErrorMsg("Une erreur est survenue lors de l’envoi 😔");
      return;
    }

    // ✅ Succès
    setHasCommented(true);
    setUserCommentId(data.id);
    setComments((prev) => [data, ...prev]);
    setMessage("");
    setSuccessMsg("Commentaire publié avec succès 💬");
  };

  // 🔹 Supprimer le commentaire de l'utilisateur
  const handleDeleteComment = async () => {
    if (!userCommentId) return;
    if (!confirm("Souhaites-tu supprimer ton commentaire ?")) return;

    const { error } = await supabase
      .from("commentaires")
      .delete()
      .eq("id", userCommentId)
      .eq("session_id", sessionId);

    if (error) {
      console.error("Erreur suppression commentaire :", error);
      setErrorMsg("Impossible de supprimer ton commentaire 😔");
      return;
    }

    setComments((prev) => prev.filter((c) => c.id !== userCommentId));
    setHasCommented(false);
    setUserCommentId(null);
    setSuccessMsg("Ton commentaire a été supprimé 💨");
  };

  return (
    <section className="mt-12 bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        💬 Commentaires
      </h2>

      {/* Messages d'état */}
      {errorMsg && (
        <p className="text-sm text-red-500 mb-3 text-center">{errorMsg}</p>
      )}
      {successMsg && (
        <p className="text-sm text-green-600 mb-3 text-center">{successMsg}</p>
      )}

      {/* Liste des commentaires */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-gray-50 p-4 rounded-xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-800">{c.pseudo}</p>
                <span className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line mb-2">
                {c.message}
              </p>

              {/* 🔹 Bouton de suppression (si c’est son commentaire) */}
              {c.session_id === sessionId && (
                <button
                  onClick={handleDeleteComment}
                  className="text-xs text-red-500 underline hover:text-red-700 transition"
                >
                  Supprimer mon commentaire
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">Aucun commentaire pour le moment.</p>
      )}

      {/* Formulaire d'ajout */}
      {!hasCommented ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Ton prénom (facultatif)"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-red-400 outline-none"
          />
          <textarea
            placeholder="Ton avis sur ce lieu..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-red-400 outline-none resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Envoi..." : "Publier 💬"}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-500 italic text-center">
            Merci pour ton commentaire 💛
          </p>
          <button
            onClick={handleDeleteComment}
            className="text-xs text-red-500 underline hover:text-red-700 transition"
          >
            Supprimer mon commentaire
          </button>
        </div>
      )}
    </section>
  );
}
