import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastWrapper from "./components/ToastWrapper";
import SessionInitializer from "./components/SessionInitializer"; // ✅ nouveau composant

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafa] text-gray-800`}
        suppressHydrationWarning={true}
      >
        <Navbar />

        {/* ✅ Initialise un session_id unique pour chaque visiteur */}
        <SessionInitializer />

        <main className="min-h-screen">{children}</main>
        <Footer />

        {/* ✅ Toasts (notifications) */}
        <ToastWrapper />
      </body>
    </html>
  );
}
