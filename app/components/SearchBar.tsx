"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("lieux")
      .select("nom, ville, slug, image_url, categorie")
      .or(`nom.ilike.%${value}%,ville.ilike.%${value}%`)
      .limit(8);

    if (!error) setResults(data || []);
    setShowResults(true);
    setLoading(false);
  };

  const handleSelect = (slug: string) => {
    setShowResults(false);
    setQuery("");
    window.location.href = `/lieu/${slug}`;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Barre principale */}
      <div className="relative">
        {/* Loupe */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>

        {/* Input */}
        <input
          type="text"
          placeholder="Rechercher un lieu, une activité, un restaurant..."
          className="w-full bg-white border border-gray-200 text-black placeholder-gray-500 rounded-2xl pl-12 pr-5 py-3 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
      </div>

      {/* Résultats */}
      {showResults && results.length > 0 && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-lg z-20 overflow-hidden border border-gray-100">
          {results.map((lieu) => (
            <div
              key={lieu.slug}
              onClick={() => handleSelect(lieu.slug)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
            >
              <img
                src={
                  lieu.image_url ||
                  "https://res.cloudinary.com/diccvjf98/image/upload/v1730364100/fallback.jpg"
                }
                alt={lieu.nom}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-gray-800">{lieu.nom}</p>
                <p className="text-sm text-gray-500">
                  {lieu.ville || "Pays Basque"} • {lieu.categorie || "Lieu"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aucun résultat */}
      {showResults && !loading && results.length === 0 && query.length > 2 && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-lg z-20 p-4 text-center text-gray-500 text-sm border border-gray-100">
          Aucun résultat trouvé.
        </div>
      )}
    </div>
  );
}
