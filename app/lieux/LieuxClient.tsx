"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

type Lieu = {
  id: number;
  nom: string;
  ville: string;
  categorie?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  slug: string;
  image_url?: string | null;
  image_urls?: string[] | null;
};

export default function LieuxClient({
  lieux,
  mode = "complet", // 👈 nouveau paramètre
}: {
  lieux: Lieu[];
  mode?: "complet" | "carte";
}) {
  const [ville, setVille] = useState("");
  const [categorie, setCategorie] = useState("");
  const [selectedLieu, setSelectedLieu] = useState<Lieu | null>(null);

  const villes = useMemo(
    () => Array.from(new Set(lieux.map((l) => l.ville).filter(Boolean))),
    [lieux]
  );

  const categories = useMemo(
    () =>
      Array.from(new Set(lieux.map((l) => l.categorie).filter(Boolean))) as string[],
    [lieux]
  );

  const lieuxFiltres = useMemo(
    () =>
      lieux.filter(
        (l) =>
          (!ville || l.ville === ville) &&
          (!categorie || l.categorie === categorie)
      ),
    [lieux, ville, categorie]
  );

  const center: [number, number] = useMemo(() => {
    if (selectedLieu?.latitude && selectedLieu?.longitude)
      return [selectedLieu.latitude, selectedLieu.longitude];
    const withCoords = lieuxFiltres.filter(
      (l) => typeof l.latitude === "number" && typeof l.longitude === "number"
    );
    if (withCoords.length)
      return [withCoords[0].latitude!, withCoords[0].longitude!];
    return [43.4832, -1.5586]; // Bayonne par défaut
  }, [lieuxFiltres, selectedLieu]);

  // 🟢 MODE "carte seule"
  if (mode === "carte") {
    return (
      <div className="w-full h-[80vh] rounded-xl overflow-hidden shadow-md my-10">
        <MapComponent
          lieux={lieuxFiltres}
          center={center}
          selectedLieu={selectedLieu}
        />
      </div>
    );
  }

  // 🟠 MODE COMPLET (filtres + carte)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* === Filtres + Liste === */}
      <div className="space-y-4 md:col-span-1">
        <h2 className="text-2xl font-bold mb-4">Découvrir les lieux</h2>

        {/* Filtres */}
        <div>
          <label className="block text-sm font-medium mb-1">Ville</label>
          <select
            className="border rounded-md w-full p-2"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
          >
            <option value="">Toutes</option>
            {villes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <select
            className="border rounded-md w-full p-2"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          >
            <option value="">Toutes</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <p className="text-gray-500 text-sm">
          {lieuxFiltres.length} lieu(x) affiché(s)
        </p>

        {/* Liste des lieux */}
        <div className="divide-y border rounded-lg max-h-[60vh] overflow-auto bg-white shadow-sm">
          {lieuxFiltres.map((l) => (
            <div
              key={l.id}
              className={`p-3 cursor-pointer hover:bg-blue-50 transition ${
                selectedLieu?.id === l.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedLieu(l)}
            >
              <p className="font-semibold text-gray-800">{l.nom}</p>
              <p className="text-gray-600 text-sm">{l.ville}</p>
              {l.categorie && (
                <p className="text-xs text-gray-500 italic">{l.categorie}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === Carte === */}
      <div className="md:col-span-2 h-[80vh] rounded-xl overflow-hidden shadow-md">
        <MapComponent
          lieux={lieuxFiltres}
          center={center}
          selectedLieu={selectedLieu}
        />
      </div>
    </div>
  );
}
