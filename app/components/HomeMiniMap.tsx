"use client";

import dynamic from "next/dynamic";

// ⬇️ Import du composant client contenant la logique Supabase + Leaflet
const HomeMapClient = dynamic(() => import("./HomeMapClient"), {
  ssr: false,
});

export default function HomeMiniMap() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-6">
        🗺️ Aperçu sur la carte
      </h2>
      <div className="rounded-2xl overflow-hidden shadow-md h-[400px]">
        <HomeMapClient />
      </div>
    </section>
  );
}
