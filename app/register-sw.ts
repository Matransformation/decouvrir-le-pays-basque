"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("✅ Service Worker enregistré avec succès :", registration);
          })
          .catch((err) => {
            console.warn("❌ Échec de l'enregistrement du Service Worker :", err);
          });
      });
    }
  }, []);

  return null;
}
