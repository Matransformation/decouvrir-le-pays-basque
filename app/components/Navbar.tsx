"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const categories = [
  { name: "Plages", emoji: "🏖️" },
  { name: "Restaurants", emoji: "🍽️" },
  { name: "Randonnées", emoji: "🥾" },
  { name: "Villages", emoji: "🏘️" },
  { name: "Hébergements", emoji: "🏨" },
  { name: "Culture & traditions", emoji: "🎭" },
  { name: "Activités", emoji: "⚡" },
  { name: "Activités enfants", emoji: "🧒" },
  { name: "Brunch", emoji: "🥞" },
];

function getWeatherEmoji(code: number) {
  if ([0].includes(code)) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if ([3].includes(code)) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 61, 80].includes(code)) return "🌧️";
  if ([63, 65, 81, 82].includes(code)) return "🌦️";
  if ([71, 73, 75].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) =>
      setUser(sess?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=43.48&longitude=-1.56&current_weather=true"
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          code: data.current_weather.weathercode,
        });
      } catch {}
    })();
  }, []);

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

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/diccvjf98/image/upload/v1761917917/Design_sans_titre_58_zaryds.png"
            alt="Découvrir le Pays Basque"
            className="h-10 w-auto"
          />
          {weather && (
            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
              <span>{getWeatherEmoji(weather.code)}</span>
              <span>{weather.temp}°C</span>
              <span className="text-gray-500">Biarritz</span>
            </div>
          )}
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700 relative">
          <Link href="/" className={pathname === "/" ? "text-red-600" : "hover:text-red-600"}>
            Accueil
          </Link>

          <Link href="/profils" className={pathname.startsWith("/profils") ? "text-red-600" : "hover:text-red-600"}>
            Profils
          </Link>

          <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <button className={`flex items-center gap-1 ${showMega ? "text-red-600" : "hover:text-red-600"}`}>
              Découvrir <ChevronDown className="w-4 h-4 mt-[2px]" />
            </button>

            {showMega && (
              <div className="absolute left-0 top-full mt-2 w-[300px] bg-white shadow-xl border border-gray-100 rounded-xl p-4 grid grid-cols-1 gap-2 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/categorie/${encodeURIComponent(cat.name)}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                  >
                    <span className="text-lg">{cat.emoji}</span> {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" className={pathname.startsWith("/blog") ? "text-red-600" : "hover:text-red-600"}>
            Blog
          </Link>

          <Link href="/favoris" className="hover:text-red-600">
            ❤️ Mes favoris
          </Link>

          <Link href="/mes-interactions" className="hover:text-red-600">
            💬 Mes interactions
          </Link>

          {/* ✅ AVATAR DESKTOP */}
          {user ? (
            <Link href="/mon-profil" className="hover:opacity-80 ml-2">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email)}`}
                className="w-8 h-8 rounded-full border"
              />
            </Link>
          ) : (
            <Link href="/login" className="hover:text-red-600">
              👤
            </Link>
          )}
        </nav>

        {/* ✅ AVATAR MOBILE */}
        {user ? (
          <Link href="/mon-profil" className="md:hidden mr-3">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email)}`}
              className="w-8 h-8 rounded-full border"
            />
          </Link>
        ) : (
          <Link href="/login" className="md:hidden mr-3 text-gray-700 text-xl">
            👤
          </Link>
        )}

        {/* BUTTON MENU MOBILE */}
        <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🔻 MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg px-6 py-5 space-y-5">

          <Link href="/profils" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-100">
            🔍 Explorer les profils
          </Link>

          <Link href="/" onClick={() => setOpen(false)} className="block font-medium">
            Accueil
          </Link>

          <div>
            <p className="text-sm text-gray-500 mb-1">Découvrir</p>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/categorie/${encodeURIComponent(cat.name)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-700 text-sm"
                >
                  <span>{cat.emoji}</span> {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/blog" onClick={() => setOpen(false)} className="flex items-center gap-2 font-medium">
            📝 Blog
          </Link>

          <Link href="/favoris" onClick={() => setOpen(false)} className="flex items-center gap-2 font-medium">
            ❤️ Mes favoris
          </Link>

          <Link href="/mes-interactions" onClick={() => setOpen(false)} className="flex items-center gap-2 font-medium">
            💬 Mes interactions
          </Link>

          <div className="border-t border-gray-200 pt-4" />

          {/* ✅ Avatar mobile */}
          {user ? (
            <Link href="/mon-profil" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email)}`}
                className="w-8 h-8 rounded-full border"
              />
              <span className="font-medium">Mon profil</span>
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center border border-gray-300 px-4 py-2 rounded-lg">
                Connexion
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="flex-1 text-center bg-red-600 text-white px-4 py-2 rounded-lg">
                S’inscrire
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
