"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DATATOURISME_URL =
  "https://diffuseur.datatourisme.fr/webservice/4fe2fb7fa9c63c79307b54a7446e7aae?appKey=61dddc02-082a-4b58-b7b2-fadc85b7d76f&format=jsonld&refine=type:Event&size=500&download=false";

type EventItem = {
  title: string;
  date: string;
  city: string;
  image: string;
};

export default function AgendaPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filtered, setFiltered] = useState<EventItem[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(DATATOURISME_URL);
        const text = await res.text(); // Debug fiable
        const data = JSON.parse(text);

        const items = data["@graph"] || [];

        const mapped = items
          .map((item: any) => {
            const title =
              item["rdfs:label"]?.["fr"] ||
              item["rdfs:label"]?.["fr-FR"] ||
              "Événement";

            const date = item["schema:startDate"] || "";

            const city =
              item["isLocatedAt"]?.[0]?.["schema:address"]?.["schema:addressLocality"] ||
              "";

            const image =
              item["hasMainRepresentation"]?.[0]?.["schema:contentUrl"] ||
              "/fallback.jpg";

            return { title, date, city, image };
          })
          .filter((e: EventItem) => e.date); // Supprime les événements sans date

        // Tri date croissante
        mapped.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Liste des villes uniques
        const uniqueCities = Array.from(new Set(mapped.map((e) => e.city))).filter(Boolean);

        setEvents(mapped);
        setFiltered(mapped);
        setCities(uniqueCities);
      } catch (err) {
        console.error("Erreur DataTourisme →", err);
      }
    };

    fetchEvents();
  }, []);

  // Filtre dynamique
  const applyFilter = (city: string) => {
    setCityFilter(city);
    setFiltered(city ? events.filter((e) => e.city === city) : events);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-center text-4xl font-bold mb-8">Agenda Pays Basque</h1>

      {/* FILTRE */}
      <div className="flex gap-2 flex-wrap mb-10 justify-center">
        <button
          onClick={() => applyFilter("")}
          className={`px-4 py-2 rounded-full border ${cityFilter === "" ? "bg-black text-white" : ""}`}
        >
          Tous
        </button>

        {cities.map((city) => (
          <button
            key={city}
            onClick={() => applyFilter(city)}
            className={`px-4 py-2 rounded-full border ${cityFilter === city ? "bg-black text-white" : ""}`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* LISTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((evt, i) => (
          <div key={i} className="shadow rounded overflow-hidden border bg-white">
            <div className="relative h-48 w-full">
              <Image src={evt.image} alt={evt.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{evt.title}</h3>
              <p className="text-gray-600">{evt.city}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(evt.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
