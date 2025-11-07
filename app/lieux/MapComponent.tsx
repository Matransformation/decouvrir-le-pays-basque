"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Lieu = {
  id: number;
  nom: string;
  ville: string;
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string | null;
  slug: string;
};

export default function MapComponent({
  lieux,
  center,
  selectedLieu,
}: {
  lieux: Lieu[];
  center: [number, number];
  selectedLieu: Lieu | null;
}) {
  // ✅ Icône rouge personnalisée
  const redIcon = L.icon({
    iconUrl: "/marker-red.png",
    iconSize: [80, 80],
    iconAnchor: [19, 38],
  });

  return (
    <MapContainer center={center} zoom={12} className="w-full h-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap France'
      />

      {lieux.map(
        (l) =>
          l.latitude &&
          l.longitude && (
            <Marker
              key={l.id}
              position={[l.latitude, l.longitude]}
              icon={redIcon}
            >
              <Popup>
                <strong>{l.nom}</strong>
                <br />
                {l.ville}
              </Popup>
            </Marker>
          )
      )}
    </MapContainer>
  );
}
