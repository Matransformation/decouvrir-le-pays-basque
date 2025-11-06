"use client";

import { useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// ⚠️ Ne pas importer L en haut (sinon SSR crash)
let L: any;

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export type MarkerLieu = {
  id: string | number;
  nom: string;
  slug: string;
  lat: number;
  lng: number;
  image?: string | null;
  ville?: string | null;
};

export default function ProfileMap({ lieux }: { lieux: MarkerLieu[] }) {
  // Charge Leaflet uniquement côté client + corrige l'icône par défaut
  useEffect(() => {
    (async () => {
      const leaf = await import("leaflet");
      L = leaf.default;

      const DefaultIcon = L.icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      // @ts-ignore
      L.Marker.prototype.options.icon = DefaultIcon;
    })();
  }, []);

  const center = useMemo<[number, number]>(() => {
    if (!lieux?.length) return [43.483, -1.558]; // Biarritz
    const lat = lieux.reduce((s, p) => s + p.lat, 0) / lieux.length;
    const lng = lieux.reduce((s, p) => s + p.lng, 0) / lieux.length;
    return [lat, lng];
  }, [lieux]);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border">
      <MapContainer
        center={center as any}
        zoom={10}
        style={{ height: 350, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {lieux?.map((l) => (
          <Marker key={l.id} position={[l.lat, l.lng] as any}>
            <Popup>
              <div className="min-w-40">
                {l.image && (
                  <img
                    src={l.image}
                    className="rounded mb-2 w-full h-20 object-cover"
                    alt={l.nom}
                  />
                )}
                <a
                  href={`/lieu/${l.slug}`}
                  className="text-red-600 font-semibold text-sm hover:underline"
                >
                  {l.nom}
                </a>
                {l.ville && (
                  <p className="text-xs text-gray-500">{l.ville}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
