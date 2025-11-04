"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface Article {
  id?: number;
  title: string;
  slug: string;
  image_url: string;
  excerpt: string;
  content_html: string;
  category?: string;
  created_at?: string;
}

export default function BlogAdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<Article>({
    title: "",
    slug: "",
    image_url: "",
    excerpt: "",
    content_html: "",
    category: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- Auth ---
  const handleLogin = () => {
    if (password === "Briscous64") setAuthenticated(true);
    else alert("Mot de passe incorrect !");
  };

  // --- Load articles ---
  useEffect(() => {
    if (authenticated) fetchArticles();
  }, [authenticated]);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    setArticles(data || []);
  };

  // --- Save article ---
  const handleSave = async () => {
    if (!form.title || !form.slug) return alert("Titre et slug requis !");
    if (editingId) {
      await supabase.from("articles").update(form).eq("id", editingId);
    } else {
      await supabase.from("articles").insert([form]);
    }

    setForm({
      title: "",
      slug: "",
      image_url: "",
      excerpt: "",
      content_html: "",
      category: "",
    });
    setEditingId(null);
    fetchArticles();
  };

  const handleEdit = (a: Article) => {
    setForm(a);
    setEditingId(a.id || null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer cet article ?")) {
      await supabase.from("articles").delete().eq("id", id);
      fetchArticles();
    }
  };

  // --- Render ---
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold mb-4">Accès administrateur</h1>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-md mb-3"
        />
        <button
          onClick={handleLogin}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
        Administration du blog
      </h1>

      {/* FORMULAIRE */}
      <div className="bg-white shadow p-4 rounded-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Modifier l'article" : "Nouvel article"}
        </h2>

        <input
          type="text"
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Slug (ex: marche-biarritz)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          type="text"
          placeholder="Catégorie (ex: Randonnée, Plage, Culture...)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />

        <textarea
          placeholder="Extrait (description courte)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="border p-2 w-full mb-2 rounded h-20"
        />
        <textarea
          placeholder="Contenu HTML"
          value={form.content_html}
          onChange={(e) => setForm({ ...form, content_html: e.target.value })}
          className="border p-2 w-full mb-4 rounded h-60 font-mono text-sm"
        />

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
        >
          {editingId ? "Mettre à jour" : "Publier"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                slug: "",
                image_url: "",
                excerpt: "",
                content_html: "",
                category: "",
              });
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Annuler
          </button>
        )}
      </div>

      {/* LISTE */}
      <div className="space-y-4">
        {articles.map((a) => (
          <div
            key={a.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{a.title}</h3>
              <p className="text-sm text-gray-500">
                {a.slug} {a.category && `• ${a.category}`}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(a)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Éditer
              </button>
              <button
                onClick={() => handleDelete(a.id!)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
