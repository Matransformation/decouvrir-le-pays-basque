"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Heart, MessageCircle } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* === LOGO === */}
        <Link href="/" className="flex items-center">
          <img
            src="https://res.cloudinary.com/diccvjf98/image/upload/v1761917917/Design_sans_titre_58_zaryds.png"
            alt="Découvrir le Pays Basque"
            className="h-10 w-auto"
          />
        </Link>

        {/* === NAVIGATION DESKTOP === */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link
            href="/"
            className={`hover:text-red-600 transition ${
              pathname === "/" ? "text-red-600" : ""
            }`}
          >
            Accueil
          </Link>

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
              pathname === "/mes-interactions"
                ? "text-red-600"
                : "text-gray-700"
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
