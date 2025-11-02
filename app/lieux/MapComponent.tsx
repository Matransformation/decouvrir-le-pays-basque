"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

type Lieu = {
  id: number;
  nom: string;
  ville: string;
  slug: string;
  latitude?: number | null;
  longitude?: number | null;
};

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

// 🔁 FitBounds + recentrage sur lieu sélectionné
function MapAutoMove({
  lieux,
  center,
  selectedLieu,
}: {
  lieux: Lieu[];
  center: [number, number];
  selectedLieu: Lieu | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLieu && selectedLieu.latitude && selectedLieu.longitude) {
      map.setView([selectedLieu.latitude, selectedLieu.longitude], 14);
      return;
    }

    if (lieux.length > 1) {
      const bounds = L.latLngBounds(
        lieux
          .filter((l) => l.latitude && l.longitude)
          .map((l) => [l.latitude!, l.longitude!] as [number, number])
      );
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView(center, 11);
    }
  }, [lieux, center, selectedLieu, map]);

  return null;
}

export default function MapComponent({
  lieux,
  center,
  selectedLieu,
}: {
  lieux: Lieu[];
  center: [number, number];
  selectedLieu: Lieu | null;
}) {
  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom
      className="w-full h-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap France"
      />

      <MapAutoMove lieux={lieux} center={center} selectedLieu={selectedLieu} />

      {lieux
        .filter((l) => l.latitude && l.longitude)
        .map((l) => (
          <Marker
            key={l.id}
            position={[l.latitude!, l.longitude!]}
            icon={icon}
          >
            <Popup>
              <div className="text-sm">
                <strong>{l.nom}</strong>
                <br />
                {l.ville}
                <br />
                <a
                  href={`/lieu/${l.slug}`}
                  className="text-blue-600 underline font-medium"
                >
                  Voir la fiche →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
