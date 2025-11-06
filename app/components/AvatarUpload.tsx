"use client";

import { useState } from "react";

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
    const formData = new FormData();
    formData.append("file", file);

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
        className="w-24 h-24 rounded-full object-cover border"
      />

      <label className="cursor-pointer bg-gray-100 border px-3 py-1 rounded text-sm">
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
