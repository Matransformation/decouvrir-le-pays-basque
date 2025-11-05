import EventsClient from "./EventsClient";

export const revalidate = 3600; // Revalidation toutes les 1h

// URL DataTourisme - Pays Basque (JSON-LD)
const DATATOURISME_URL =
  "https://diffuseur.datatourisme.fr/webservice/4fe2fb7fa9c63c79307b54a7446e7aae?appKey=61dddc02-082a-4b58-b7b2-fadc85b7d76f&format=jsonld&refine=type:Event&size=500";

type EventItemServer = {
  ["schema:name"]?: { ["fr-FR"]?: string };
  ["dc:description"]?: { ["fr-FR"]?: string };
  ["schema:startDate"]?: string;
  ["isLocatedAt"]?: Array<{
    ["schema:address"]?: {
      ["schema:addressLocality"]?: string;
    };
  }>;
  ["hasMainRepresentation"]?: Array<{
    ["schema:contentUrl"]?: string;
  }>;
  ["schema:url"]?: string;
};

export default async function AgendaPage() {
  let events: any[] = [];

  try {
    const res = await fetch(DATATOURISME_URL, { next: { revalidate } });
    const data = await res.json();

    const items: EventItemServer[] = data["@graph"] || [];

    events = items
      .map((item) => {
        const title =
          item["schema:name"]?.["fr-FR"] || "Événement sans titre";

        const date = item["schema:startDate"] || "";

        const city =
          item["isLocatedAt"]?.[0]?.["schema:address"]?.["schema:addressLocality"] ||
          "";

        const image =
          item["hasMainRepresentation"]?.[0]?.["schema:contentUrl"] ||
          "/fallback.jpg";

        const description =
          item["dc:description"]?.["fr-FR"] || "";

        return {
          title,
          date,
          city,
          image,
          description,
          url: item["schema:url"] || null,
        };
      })
      .filter((e) => e.date); // garder uniquement événements datés

    // tri par date croissante
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (err) {
    console.error("Erreur DataTourisme:", err);
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-[#e63946]">
        Agenda du Pays Basque 🇫🇷
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Toutes les fêtes, marchés, concerts et animations locales à ne pas manquer !
      </p>

      <EventsClient events={events} />
    </main>
  );
}
