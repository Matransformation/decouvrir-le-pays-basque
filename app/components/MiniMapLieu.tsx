"use client";

import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// ✅ Corrige le bug d’icône Leaflet sous Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MiniMapLieuProps {
  latitude: number;
  longitude: number;
  nom: string;
  ville?: string;
}

export default function MiniMapLieu({ latitude, longitude, nom, ville }: MiniMapLieuProps) {
  // 🔹 S'assure que Leaflet s'affiche correctement côté client
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={icon}>
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
