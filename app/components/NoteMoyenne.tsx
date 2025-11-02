"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Star } from "lucide-react";

interface NoteMoyenneProps {
  lieuId: number;
  refreshKey?: number;
}

export default function NoteMoyenne({ lieuId, refreshKey }: NoteMoyenneProps) {
  const [moyenne, setMoyenne] = useState<number | null>(null);

  useEffect(() => {
    const fetchMoyenne = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("note")
        .eq("lieu_id", lieuId);

      if (error) {
        console.error("Erreur chargement moyenne :", error);
        return;
      }

      if (data && data.length > 0) {
        const avg =
          data.reduce((sum: number, r: { note: number }) => sum + r.note, 0) /
          data.length;
        setMoyenne(avg);
      } else {
        setMoyenne(null);
      }
    };

    fetchMoyenne();
  }, [lieuId, refreshKey]);

  return (
    <div className="flex items-center justify-center gap-2 mt-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            moyenne && i <= Math.round(moyenne)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600">
        {moyenne ? `${moyenne.toFixed(1)} / 5` : "Aucune note"}
      </span>
    </div>
  );
}
