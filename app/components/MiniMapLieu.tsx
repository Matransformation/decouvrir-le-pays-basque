"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

interface MiniMapLieuProps {
  latitude: number;
  longitude: number;
  nom: string;
  ville?: string;
}

// ✅ Icône rouge personnalisée
const redIcon = L.icon({
  iconUrl: "/marker-red.png",
  iconSize: [60, 60],
  iconAnchor: [19, 38],
});

export default function MiniMapLieu({ latitude, longitude, nom, ville }: MiniMapLieuProps) {
  useEffect(() => {
    // Fix affichage Leaflet côté client
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  }, []);

  if (!latitude || !longitude) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500 text-sm">
        📍 Localisation non disponible
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap France'
        />

        <Marker position={[latitude, longitude]} icon={redIcon}>
          <Popup>
            <strong>{nom}</strong>
            <br />
            {ville || "Pays Basque"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
