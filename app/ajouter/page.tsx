"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AjouterLieu() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    category: "",
    description: "",
  });

  const categories = [
    "Restaurant",
    "Plage",
    "Randonnée",
    "Village",
    "Hébergement",
    "Culture & traditions",
  ];

  // 🧾 Gestion du changement de champ
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // 📸 Gestion de plusieurs images
  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  }

  // 🕒 Auto-fermeture du toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 🚀 Soumission du formulaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedUrls: string[] = [];

      // 1️⃣ Upload de toutes les images (en parallèle)
      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const formDataImage = new FormData();
          formDataImage.append("file", file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formDataImage,
          });

          if (!uploadRes.ok) throw new Error("Erreur d’upload Cloudinary");
          const uploadData = await uploadRes.json();
          return uploadData.secure_url;
        });

        uploadedUrls = await Promise.all(uploadPromises);
      }

      // 2️⃣ Envoi des données vers Supabase
      const resDb = await fetch("/api/ajouter-lieu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_urls: uploadedUrls }),
      });

      const data = await resDb.json();
      if (!resDb.ok || !data.success) throw new Error(data.error || "Erreur serveur");

      // ✅ Succès
      setToast({ message: `✅ Lieu ajouté : ${data.data.nom}`, type: "success" });
      setFormData({ name: "", city: "", category: "", description: "" });
      setFiles([]);
      setPreviews([]);

      // 🔁 Redirection automatique vers la fiche lieu
      setTimeout(() => {
        router.push(`/lieu/${data.data.slug}`);
      }, 1500);
    } catch (error) {
      console.error(error);
      setToast({ message: "❌ Une erreur est survenue.", type: "error" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="max-w-lg mx-auto p-6 relative">
      {/* === TOAST NOTIFICATION === */}
      {toast && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium text-center transition-all duration-500 ${
            toast.type === "success"
              ? "bg-green-600 animate-slideDownFade"
              : "bg-red-600 animate-slideDownFade"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">Ajouter un lieu 🌿</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-md rounded-2xl p-6">
        <input
          type="text"
          name="name"
          placeholder="Nom du lieu"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        <input
          type="text"
          name="city"
          placeholder="Ville"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded bg-white"
        >
          <option value="">Choisir une catégorie...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded h-24"
        />

        {/* ✅ Input multiple pour les photos */}
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="w-full border border-gray-300 p-2 rounded"
          />

          {/* Aperçu des photos sélectionnées */}
          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Aperçu ${i + 1}`}
                  className="rounded-lg shadow-md object-cover w-full h-32"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          {uploading ? "Envoi en cours..." : "Ajouter le lieu"}
        </button>
      </form>
    </main>
  );
}
