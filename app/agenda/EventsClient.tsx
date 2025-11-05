"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type EventItem = {
  title: string;
  date: string;
  city: string;
  image: string;
  description: string;
  url?: string | null;
};

export default function EventsClient({
  events,
}: {
  events: EventItem[];
}) {
  const [ville, setVille] = useState<string>("");

  const villes = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.city).filter(Boolean))).sort();
  }, [events]);

  const filtered = useMemo(() => {
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

        {villes.map((c) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((evt, i) => (
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
    </>
  );
}
