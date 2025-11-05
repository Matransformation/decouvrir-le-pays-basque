// app/agenda/page.tsx
import Image from "next/image";
import { Suspense } from "react";

export const revalidate = 3600; // régénère côté serveur 1x/heure

/* ===========================
   CONFIG
   =========================== */
const DATATOURISME_URL =
  "https://diffuseur.datatourisme.fr/webservice/4fe2fb7fa9c63c79307b54a7446e7aae?appKey=61dddc02-082a-4b58-b7b2-fadc85b7d76f&format=jsonld&refine=type:Event&size=500";

/* ===========================
   TYPES
   =========================== */
type EventItem = {
  title: string;
  date: string; // ISO
  city: string;
  image: string;
  description: string;
  url?: string | null;
};

/* ===========================
   DATA (SERVER)
   =========================== */
async function getEvents(): Promise<EventItem[]> {
  // Évite la mise en cache Next.js côté data (limite 2MB) et préfère le revalidate SSR
  const res = await fetch(DATATOURISME_URL, {
    // on laisse Next contrôler via `revalidate` plutôt que de stocker le gros JSON côté cache
    next: { revalidate },
    cache: "no-store",
  });

  // le webservice peut renvoyer du texte -> parse manuel
  const raw = await res.text();

  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    // Si DATAtourisme renvoie une page HTML (erreur), on retourne un tableau vide
    return [];
  }

  const graph: any[] = Array.isArray(json?.["@graph"]) ? json["@graph"] : [];

  const mapped: EventItem[] = graph
    .map((item: any): EventItem | null => {
      // Titre
      const title: string =
        item?.["rdfs:label"]?.["fr"] ??
        item?.["rdfs:label"]?.["fr-FR"] ??
        item?.["rdfs:label"] ??
        "Événement sans titre";

      // Date (schema:startDate ou schema:endDate à défaut)
      const date: string =
        item?.["schema:startDate"] ??
        item?.["schema:endDate"] ??
        item?.["startDate"] ??
        "";

      // Ville
      const city: string =
        item?.["isLocatedAt"]?.[0]?.["schema:address"]?.["schema:addressLocality"] ??
        item?.["schema:address"]?.["schema:addressLocality"] ??
        "";

      // Image
      const image: string =
        item?.["hasMainRepresentation"]?.[0]?.["schema:contentUrl"] ??
        "/fallback.jpg"; // place un fichier public/fallback.jpg si tu veux

      // Description
      const description: string =
        item?.["dc:description"]?.["fr"] ??
        item?.["dc:description"]?.["fr-FR"] ??
        item?.["dc:description"] ??
        "";

      // URL (si dispo)
      const url: string | null =
        item?.["schema:url"] ??
        item?.["url"] ??
        null;

      if (!date) return null; // on rejette les lignes sans date

      return { title, date, city, image, description, url };
    })
    .filter(Boolean) as EventItem[];

  // Ne garder que les événements à venir (tolérance : depuis hier)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const upcoming = mapped.filter((e) => {
    const t = new Date(e.date).getTime();
    return !Number.isNaN(t) && t >= yesterday.getTime();
  });

  // Tri chronologique (TS typé — pas d'any implicite)
  upcoming.sort((a: EventItem, b: EventItem) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return upcoming;
}

/* ===========================
   CLIENT FILTER (CLIENT)
   =========================== */
function EventsClient({
  events,
  cities,
}: {
  events: EventItem[];
  cities: string[];
}) {
  "use client";
  import React, { useMemo, useState } from "react";

  // hack vite fait pour l'import côté client
  // @ts-ignore
  const ReactLib = React ?? require("react");
  const useState_ = ReactLib.useState;
  const useMemo_ = ReactLib.useMemo;

  const [ville, setVille] = useState_<string>("");

  const filtered = useMemo_(() => {
    return ville ? events.filter((e) => e.city === ville) : events;
  }, [events, ville]);

  return (
    <>
      {/* FILTRE */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setVille("")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            ville === ""
              ? "bg-[#e63946] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Toutes les villes
        </button>

        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setVille(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              ville === c
                ? "bg-[#e63946] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* LISTE */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucun événement trouvé pour cette ville.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((evt: EventItem, i: number) => (
            <div
              key={`${evt.title}-${evt.date}-${i}`}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={evt.image}
                  alt={evt.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
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
    </>
  );
}

/* ===========================
   PAGE (SERVER)
   =========================== */
export default async function AgendaPage() {
  const events = await getEvents();

  // Liste des villes (typage strict)
  const cities = Array.from(
    new Set(events.map((e: EventItem) => e.city).filter(Boolean))
  ).sort();

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-[#e63946]">
        Agenda du Pays Basque 🇫🇷
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Fêtes, marchés, concerts et animations locales à ne pas manquer.
      </p>

      <Suspense fallback={<p className="text-center">Chargement…</p>}>
        {/* @ts-expect-error – composant client inline */}
        <EventsClient events={events} cities={cities} />
      </Suspense>
    </main>
  );
}
