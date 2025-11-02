"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const MapComponent = dynamic(() => import("../lieux/MapComponent"), {
  ssr: false,
});

export default function HomeMapClient() {
  const [lieux, setLieux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLieux = async () => {
      try {
        const { data, error } = await supabase
          .from("lieux")
          .select("*")
          // 🧭 on trie par date de création plutôt que random()
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) {
          console.error("Erreur Supabase (HomeMapClient):", error);
        } else {
          console.log("✅ Lieux récupérés:", data);
          setLieux(data || []);
        }
      } catch (err) {
        console.error("Erreur inattendue:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLieux();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Chargement de la carte...
      </div>
    );
  }

  if (!lieux.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Aucun lieu à afficher pour le moment.
      </div>
    );
  }

  return (
    <MapComponent
      lieux={lieux}
      center={[43.35, -1.5]} // Pays Basque
      selectedLieu={null}
    />
  );
}
