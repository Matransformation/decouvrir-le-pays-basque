"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* ============================================================
   🌐 CONFIG
   ============================================================ */
const DATATOURISME_URL =
  "https://diffuseur.datatourisme.fr/webservice/4fe2fb7fa9c63c79307b54a7446e7aae/61dddc02-082a-4b58-b7b2-fadc85b7d76f";

/* ============================================================
   📘 TYPES
   ============================================================ */
interface EventItem {
  title: string;
  date: string;
  city: string;
  image: string;
  description: string;
  url?: string | null;
}

/* ============================================================
   🧠 COMPOSANT PRINCIPAL
   ============================================================ */
export default function AgendaPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filtered, setFiltered] = useState<EventItem[]>([]);
  const [villes, setVilles] = useState<string[]>([]);
  const [ville, setVille] = useState<string>("");

  /* === RÉCUPÉRATION DES DONNÉES === */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(DATATOURISME_URL);
        const data = await res.json();
        const items: any[] = data?.data || data?.features || [];

        const mapped: EventItem[] = items
          .map((item: any): EventItem => {
            const props = item?.properties || item;
            const title =
              props?.nom?.fr ||
              props?.nom?.["fr-FR"] ||
              props?.nom ||
              "Événement sans titre";
            const date =
              props?.dates?.[0]?.dateDebut ||
              props?.startDate ||
              props?.date_debut ||
              "";
            const city =
              props?.adresse?.commune?.fr ||
              props?.adresse?.nomCommune ||
              props?.ville ||
              "";
            const image =
              props?.illustrations?.[0]?.url ||
              props?.photo?.url ||
              "/fallback.jpg";
            const description =
              props?.presentation?.fr ||
              props?.description?.fr ||
              props?.description ||
              "";
            const url = props?.url || props?.siteWeb || null;

            return { title, date, city, image, description, url };
          })
          .filter((e) => e.title && e.date);

        // Trie chronologique
        mapped.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Villes uniques
        const uniqueCities: string[] = Array.from(
          new Set(mapped.map((e) => e.city).filter(Boolean))
        ).sort();

        setEvents(mapped);
        setFiltered(mapped);
        setVilles(uniqueCities);
      } catch (err) {
        console.error("Erreur DataTourisme:", err);
      }
    };

    fetchData();
  }, []);

  /* === GESTION DU FILTRE === */
  const handleFilter = (ville: string) => {
    setVille(ville);
    if (!ville) setFiltered(events);
    else setFiltered(events.filter((e) => e.city === ville));
  };

  /* === RENDU === */
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-[#e63946]">
        Agenda du Pays Basque 🇫🇷
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Fêtes, marchés, concerts et animations locales à ne pas manquer.
      </p>

      {/* === FILTRE PAR VILLE === */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => handleFilter("")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            ville === ""
              ? "bg-[#e63946] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Toutes les villes
        </button>

        {villes.map((v) => (
          <button
            key={v}
            onClick={() => handleFilter(v)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              ville === v
                ? "bg-[#e63946] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* === LISTE DES ÉVÉNEMENTS === */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucun événement trouvé pour cette ville.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((evt, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={evt.image}
                  alt={evt.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h2 className="font-semibold text-lg mb-1 text-gray-800">
                  {evt.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  📍 {evt.city || "Pays Basque"} <br />
                  📅{" "}
                  {new Date(evt.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600 flex-1 line-clamp-3">
                  {evt.description}
                </p>
                {evt.url && (
                  <a
                    href={evt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[#e63946] font-semibold hover:underline"
                  >
                    En savoir plus →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
