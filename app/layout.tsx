import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastWrapper from "./components/ToastWrapper";
import SessionInitializer from "./components/SessionInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ============================================================
   🌍 SEO GLOBAL + PWA + OPEN GRAPH
   ============================================================ */
export const metadata: Metadata = {
  title: "Découvrir le Pays Basque | Guide local 🌶️",
  description:
    "Explore les plus belles plages, randonnées, villages et bonnes adresses du Pays Basque. Ton guide local pour savourer, explorer et s’évader entre montagne et océan.",
  keywords: [
    "Pays Basque",
    "guide local",
    "tourisme",
    "plages",
    "villages",
    "restaurants",
    "randonnées",
    "brunch",
    "Biarritz",
    "Bayonne",
    "Saint-Jean-de-Luz",
  ],
  metadataBase: new URL("https://decouvrirlepaysbasque.fr"),
  alternates: {
    canonical: "https://decouvrirlepaysbasque.fr",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Découvrir le Pays Basque 🌶️",
    description:
      "Découvre les meilleures adresses du Pays Basque — entre océan et montagne, nos sélections locales t’attendent !",
    url: "https://decouvrirlepaysbasque.fr",
    siteName: "Découvrir le Pays Basque",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/diccvjf98/image/upload/v1761916136/Votre_texte_de_paragraphe_wt8w7a.jpg",
        width: 1200,
        height: 630,
        alt: "Vue du Pays Basque entre mer et montagne",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

/* ============================================================
   ⚙️ LAYOUT GLOBAL AVEC NAVBAR + FOOTER + SW REGISTRATION
   ============================================================ */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* ✅ Favicon + manifest + couleurs PWA */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e63946" />

        {/* ✅ Balise canonique dynamique pour SEO */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                canonical.setAttribute('href', 'https://decouvrirlepaysbasque.fr' + window.location.pathname);
                document.head.appendChild(canonical);
              }
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafa] text-gray-800`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        <SessionInitializer />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ToastWrapper />

        {/* ✅ Enregistrement du Service Worker pour la PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker
                    .register('/sw.js')
                    .then(() => console.log('✅ Service Worker enregistré'))
                    .catch((err) => console.warn('Erreur Service Worker :', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
