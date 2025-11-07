"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";
import { Heart } from "lucide-react";
import StarRating from "../../components/StarRating";
import CommentSection from "../../components/CommentSection";

interface Lieu {
  id: number;
  nom: string;
  ville: string;
  categorie?: string;
  description?: string;
  description_courte?: string;
  description_longue?: string;
  adresse?: string;
  site_web?: string;
  telephone?: string;
  instagram?: string;
  facebook?: string;
  image_url?: string;
  image_urls?: string[];
}

interface Props {
  lieu: Lieu;
  images: string[];
}

export default function LieuPageClient({ lieu, images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [sommaire, setSommaire] = useState<{ id: string; titre: string }[]>([]);
  const [user, setUser] = useState<any>(null);

  // ✅ Récupère l'utilisateur connecté
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ Charge l'état du favori
  useEffect(() => {
    if (!user) return;

    const fetchFavoris = async () => {
      // Trouver si ce lieu est déjà dans les favoris de l'user
      const { data: rows } = await supabase
        .from("favoris")
        .select("id")
        .eq("lieu_id", lieu.id)
        .eq("user_id", user.id)
        .limit(1);

      setIsFav((rows?.length ?? 0) > 0);

      // Compte total
      const { count } = await supabase
        .from("favoris")
        .select("*", { count: "exact", head: true })
        .eq("lieu_id", lieu.id);

      setFavCount(count || 0);
    };

    fetchFavoris();
  }, [user, lieu.id]);

  // ✅ Bouton favoris
  const toggleFavori = async () => {
    if (!user) {
      if (
        confirm(
          "Pour ajouter des favoris et les retrouver partout, crée-toi un compte 😊\n\nVoulez-vous créer un compte maintenant ?"
        )
      ) {
        window.location.href = "/login";
      }
      return;
    }
  
    if (isFav) {
      await supabase
        .from("favoris")
        .delete()
        .eq("lieu_id", lieu.id)
        .eq("user_id", user.id);
  
      setIsFav(false);
      setFavCount((c) => Math.max(0, c - 1));
    } else {
      const { error } = await supabase
        .from("favoris")
        .insert({ lieu_id: lieu.id, user_id: user.id })
        .select(); // ← IMPORTANT
  
      if (error) console.log("❌ Erreur insert favori :", error);
  
      setIsFav(true);
      setFavCount((c) => c + 1);
    }
  };
  
  

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // 🧭 Sommaire depuis les <h2>
  useEffect(() => {
    if (!lieu.description_longue) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(lieu.description_longue, "text/html");
    const headings = Array.from(doc.querySelectorAll("h2"));
    const toc = headings.map((h, i) => {
      const id = `section-${i}`;
      h.id = id;
      return { id, titre: h.textContent || "" };
    });
    setSommaire(toc);
  }, [lieu.description_longue]);

  const hasImages = images && images.length > 0 && images[0];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* === CARROUSEL === */}
      {hasImages && (
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md mb-6">
          <Image
            key={images[currentIndex]}
            src={images[currentIndex]}
            alt={`${lieu.nom} - photo ${currentIndex + 1}`}
            fill
            priority
            className="object-cover transition-all duration-700 ease-in-out"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      {/* ❤️ Bouton favoris */}
      <div className="text-center mb-10">
        <button
          onClick={toggleFavori}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-sm transition ${
            isFav
              ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
              : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFav ? "fill-red-600 text-red-600" : "text-gray-500"}`} />
          {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>

        <p className="text-sm text-gray-500 mt-2">
          {favCount > 0
            ? `${favCount} ${favCount > 1 ? "personnes aiment" : "personne aime"} ce lieu ❤️`
            : "Aucun favori pour le moment"}
        </p>
      </div>

      {/* === INFOS === */}
      <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{lieu.nom}</h1>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">Ville</h2>
          <p className="text-gray-600">{lieu.ville}</p>
        </div>

        {lieu.categorie && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Catégorie</h2>
            <p className="text-gray-600">{lieu.categorie}</p>
          </div>
        )}

        {sommaire.length > 0 && (
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Sommaire</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {sommaire.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-red-600 hover:underline">
                    {item.titre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(lieu.description_longue || lieu.description) && (
          <div className="prose max-w-none text-gray-800">
            <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">Présentation</h2>
            <div
              className="[&_h2]:text-xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: lieu.description_longue || lieu.description || "",
              }}
            />
          </div>
        )}

        {(lieu.adresse || lieu.site_web || lieu.telephone || lieu.instagram || lieu.facebook) && (
          <div className="mt-8 border-t border-gray-200 pt-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📍 Infos pratiques</h3>

            {lieu.adresse && <p className="text-gray-700">📍 {lieu.adresse}</p>}
            {lieu.telephone && <p className="text-gray-700">📞 {lieu.telephone}</p>}
            {lieu.site_web && (
              <p>
                🌐{" "}
                <a href={lieu.site_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {lieu.site_web}
                </a>
              </p>
            )}
            {lieu.instagram && (
              <p>
                📸{" "}
                <a href={lieu.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">
                  Instagram
                </a>
              </p>
            )}
            {lieu.facebook && (
              <p>
                💬{" "}
                <a href={lieu.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Facebook
                </a>
              </p>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Note ce lieu</h2>
          <StarRating lieuId={lieu.id} />
        </div>
      </div>

      <CommentSection lieuId={lieu.id} />
    </main>
  );
}
