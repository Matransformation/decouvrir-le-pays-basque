"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Star } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

/* ---------- TYPES ---------- */
interface Lieu {
  id: number;
  nom: string;
  slug: string;
  ville: string;
  categorie: string | null;
  image_url?: string | null;
}

interface Favori {
  lieu_id: number;
  lieux: Lieu;
}

interface Note {
  lieu_id: number;
  note: number;
  lieux: Lieu;
}

interface Commentaire {
  lieu_id: number;
  message: string;
  lieux: Lieu;
}

/* ---------- COMPOSANT PRINCIPAL ---------- */
export default function MesInteractionsPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("session_id")
        : null;
    setSessionId(stored);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) return;

      // ❤️ Favoris
      const { data: favs } = await supabase
        .from("favoris")
        .select("lieu_id, lieux(*)")
        .eq("session_id", sessionId);

      // ⭐ Notes
      const { data: userNotes } = await supabase
        .from("notes")
        .select("lieu_id, note, lieux(*)")
        .eq("session_id", sessionId);

      // 💬 Commentaires
      const { data: userComments } = await supabase
        .from("commentaires")
        .select("lieu_id, message, lieux(*)")
        .eq("session_id", sessionId);

      setFavoris(((favs ?? []) as unknown) as Favori[]);
      setNotes(((userNotes ?? []) as unknown) as Note[]);
      setCommentaires(((userComments ?? []) as unknown) as Commentaire[]);
      setLoading(false);
    };

    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chargement de tes interactions...
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucune donnée de session trouvée 😅
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        👋 Tes interactions au Pays Basque
      </h1>

      {/* === COMPTEUR === */}
      <p className="text-gray-600 mb-8">
        ❤️ <strong>{favoris.length}</strong> favoris · ⭐{" "}
        <strong>{notes.length}</strong> notes · 💬{" "}
        <strong>{commentaires.length}</strong> commentaires
      </p>

      {/* === FILTRES === */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["Tous", "Favoris", "Notes", "Commentaires"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              const el = document.activeElement as HTMLElement;
              if (el) {
                el.classList.add("pop");
                setTimeout(() => el.classList.remove("pop"), 300);
              }
            }}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
              filter === cat
                ? "bg-red-600 text-white border-red-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* === FAVORIS === */}
      {(filter === "Tous" || filter === "Favoris") && (
        <section className="mb-10 fade-in">
          <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5" /> Lieux favoris
          </h2>

          {favoris.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoris.map((f, i) => (
                <Link
                  key={f.lieu_id}
                  href={`/lieu/${f.lieux.slug}`}
                  className="block bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {f.lieux.image_url && (
                    <img
                      src={f.lieux.image_url}
                      alt={f.lieux.nom}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">
                      {f.lieux.nom}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {f.lieux.ville}{" "}
                      {f.lieux.categorie ? `· ${f.lieux.categorie}` : ""}
                    </p>
                    <ShareButton lieu={f.lieux} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucun lieu en favori.</p>
          )}
        </section>
      )}

      {/* === NOTES === */}
      {(filter === "Tous" || filter === "Notes") && (
        <section className="mb-10 fade-in">
          <h2 className="text-xl font-semibold text-yellow-500 flex items-center gap-2 mb-4">
            <Star className="w-5 h-5" /> Notes données
          </h2>

          {notes.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {notes.map((n, i) => (
                <Link
                  key={n.lieu_id}
                  href={`/lieu/${n.lieux.slug}`}
                  className="block bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {n.lieux.image_url && (
                    <img
                      src={n.lieux.image_url}
                      alt={n.lieux.nom}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">
                      {n.lieux.nom}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {n.lieux.ville}{" "}
                      {n.lieux.categorie ? `· ${n.lieux.categorie}` : ""}
                    </p>
                    <p className="text-yellow-500 font-semibold">
                      ⭐ {n.note} / 5
                    </p>
                    <ShareButton lieu={n.lieux} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucune note donnée.</p>
          )}
        </section>
      )}

      {/* === COMMENTAIRES === */}
      {(filter === "Tous" || filter === "Commentaires") && (
        <section className="fade-in">
          <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5" /> Commentaires
          </h2>

          {commentaires.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {commentaires.map((c, i) => (
                <Link
                  key={c.lieu_id}
                  href={`/lieu/${c.lieux.slug}`}
                  className="block bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {c.lieux.image_url && (
                    <img
                      src={c.lieux.image_url}
                      alt={c.lieux.nom}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">
                      {c.lieux.nom}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {c.lieux.ville}{" "}
                      {c.lieux.categorie ? `· ${c.lieux.categorie}` : ""}
                    </p>
                    <p className="text-gray-700 text-sm italic">
                      “{c.message}”
                    </p>
                    <ShareButton lieu={c.lieux} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Aucun commentaire.</p>
          )}
        </section>
      )}
    </div>
  );
}

/* ---------- BOUTON PARTAGE ---------- */
function ShareButton({ lieu }: { lieu: Lieu }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lieu.nom,
          text: `Découvre ${lieu.nom} à ${lieu.ville} sur Découvrir le Pays Basque 🌶️`,
          url: `${window.location.origin}/lieu/${lieu.slug}`,
        });
      } catch (err) {
        console.log("Partage annulé", err);
      }
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/lieu/${lieu.slug}`
      );
      alert("Lien copié dans le presse-papiers 📋");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-xs text-blue-500 mt-2 hover:underline"
    >
      🔗 Partager
    </button>
  );
}
