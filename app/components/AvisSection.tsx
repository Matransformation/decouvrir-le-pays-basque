"use client";

import { useState } from "react";
import NoteMoyenne from "./NoteMoyenne";
import StarRating from "./StarRating";
import CommentSection from "./CommentSection";

interface AvisSectionProps {
  lieuId: number;
}

export default function AvisSection({ lieuId }: AvisSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVote = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <section className="mt-12 bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        ⭐ Avis & Notation
      </h2>

      {/* Moyenne globale */}
      <NoteMoyenne lieuId={lieuId} refreshKey={refreshKey} />

      {/* Barre de notation */}
      <div className="mt-4 mb-8 text-center">
        <p className="text-gray-600 mb-2 text-sm">Donne ta note :</p>
        <StarRating lieuId={lieuId} onVote={handleVote} />
      </div>

      {/* Commentaires */}
      <CommentSection lieuId={lieuId} />
    </section>
  );
}
