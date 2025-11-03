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

export const metadata: Metadata = {
  title: "Découvrir le Pays Basque",
  description: "Le guide local des meilleures adresses du Pays Basque 🌶️",
  metadataBase: new URL("https://decouvrirlepaysbasque.fr"), // ✅ base canonique pour tout le site
  alternates: {
    canonical: "https://decouvrirlepaysbasque.fr", // ✅ version officielle
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* ✅ Balise canonique dynamique côté client (utile si Next génère des pages dynamiques) */}
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
      </body>
    </html>
  );
}
