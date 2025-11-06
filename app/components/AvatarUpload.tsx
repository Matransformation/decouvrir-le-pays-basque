"use client";

import { useState } from "react";

// ✅ Compression avant upload (pour éviter l’erreur 413 sur Vercel)
async function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<File> {
  return await new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.warn("⚠️ Impossible d'obtenir le contexte canvas, fallback → pas de compression");
        return resolve(file);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.warn("⚠️ Compression impossible → fallback original");
            return resolve(file);
          }

          resolve(
            new File([blob], file.name.replace(/\..+$/, ".jpg"), {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        quality
      );
    };
  });
}

export default function AvatarUpload({
  avatarUrl,
  onChange,
}: {
  avatarUrl: string | null;
  onChange: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    // ✅ Compression avant envoi
    const compressed = await compressImage(file, 800, 0.75);

    const formData = new FormData();
    formData.append("file", compressed);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.secure_url) {
      onChange(data.secure_url);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <img
        src={avatarUrl || "/avatar-placeholder.png"}
        className="w-24 h-24 rounded-full object-cover border shadow-sm"
        alt="avatar"
      />

      <label className="cursor-pointer bg-gray-100 border px-3 py-1 rounded text-sm hover:bg-gray-200 transition">
        {loading ? "Envoi..." : "Changer l’avatar"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </label>
    </div>
  );
}
