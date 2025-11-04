"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { Menu, X, Heart, MessageCircle, ChevronDown } from "lucide-react";

const categories = [
  { name: "Plages", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918619/Plages_co%CC%82te_basque_hczizy.jpg" },
  { name: "Restaurants", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918620/Restaurants_co%CC%82te_basque_bf6zir.jpg" },
  { name: "Randonnées", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918620/Randonne%CC%81es_co%CC%82te_basque_gffivs.jpg" },
  { name: "Villages", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918620/Villages_co%CC%82te_basque_gsu6gp.jpg" },
  { name: "Hébergements", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918619/Hebergements_co%CC%82te_basque_ioz58z.jpg" },
  { name: "Culture & traditions", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761918619/Cultures_et_tradition_co%CC%82te_basque_czpj9h.jpg" },
  { name: "Activités", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761941411/activite%CC%81s_co%CC%82te_basque_dee5qx.jpg" },
  { name: "Activités enfants", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761941733/activite%CC%81s_enfants_co%CC%82te_basque_wutbh4.jpg" },
  { name: "Brunch", image: "https://res.cloudinary.com/diccvjf98/image/upload/v1761942132/Brunch_co%CC%82te_basque_mgcedp.jpg" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setShowMega(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setShowMega(false), 200);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
        {/* === LOGO === */}
        <Link href="/" className="flex items-center">
          <img
            src="https://res.cloudinary.com/diccvjf98/image/upload/v1761917917/Design_sans_titre_58_zaryds.png"
            alt="Découvrir le Pays Basque"
            className="h-10 w-auto"
          />
        </Link>

        {/* === NAVIGATION DESKTOP === */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700 relative">
          <Link
            href="/"
            className={`hover:text-red-600 transition ${
              pathname === "/" ? "text-red-600" : ""
            }`}
          >
            Accueil
          </Link>

          {/* === MEGA MENU === */}
          <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <button
              className={`flex items-center gap-1 hover:text-red-600 transition ${
                showMega ? "text-red-600" : ""
              }`}
            >
              Découvrir
              <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            {showMega && (
              <div
                className="absolute left-0 top-full mt-2 w-[720px] bg-white shadow-xl border border-gray-100 rounded-xl p-4 grid grid-cols-3 gap-4 z-50"
                onMouseEnter={handleEnter} // ✅ Empêche la fermeture quand la souris est dans le menu
                onMouseLeave={handleLeave}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/categorie/${encodeURIComponent(cat.name)}`}
                    className="group block rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative w-full h-28 overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />
                      <h3 className="absolute bottom-2 left-2 text-white text-sm font-semibold drop-shadow">
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* === AUTRES LIENS === */}
          <Link
            href="/favoris"
            className={`flex items-center gap-1 hover:text-red-600 transition ${
              pathname === "/favoris" ? "text-red-600" : ""
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Mes favoris</span>
          </Link>

          <Link
            href="/mes-interactions"
            className={`flex items-center gap-1 hover:text-red-600 transition ${
              pathname === "/mes-interactions" ? "text-red-600" : ""
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mes interactions</span>
          </Link>
        </nav>

        {/* === BOUTON MENU MOBILE === */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === MENU MOBILE === */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner px-6 py-4 space-y-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`block font-medium ${
              pathname === "/" ? "text-red-600" : "text-gray-700"
            }`}
          >
            Accueil
          </Link>

          <div>
            <p className="text-sm text-gray-500 mb-2">Découvrir</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/categorie/${encodeURIComponent(cat.name)}`}
                  onClick={() => setOpen(false)}
                  className="text-gray-700 hover:text-red-600 text-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/favoris"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 font-medium ${
              pathname === "/favoris" ? "text-red-600" : "text-gray-700"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Mes favoris</span>
          </Link>

          <Link
            href="/mes-interactions"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 font-medium ${
              pathname === "/mes-interactions" ? "text-red-600" : "text-gray-700"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mes interactions</span>
          </Link>
        </div>
      )}
    </header>
  );
}
