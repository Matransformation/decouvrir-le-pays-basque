"use client";

import { useState } from "react";

export default function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    // 📱 Si navigateur mobile avec API native
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Découvrir le Pays Basque",
          text: "Viens voir mes recommandations 🌿",
          url,
        });
        return;
      } catch {}
    }

    // 🖥️ Sinon → copie dans le presse-papier
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition"
    >
      {copied ? "✅ Lien copié !" : "🔗 Partager ce profil"}
    </button>
  );
}
