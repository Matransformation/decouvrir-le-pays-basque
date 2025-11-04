import { NextResponse } from "next/server";

export async function GET() {
  const content = `
User-agent: *
Allow: /

# 🧭 Spécifique aux images et médias (pour l'indexation)
User-agent: Googlebot-Image
Allow: /

# 🗺️ Sitemap principal
Sitemap: https://decouvrirlepaysbasque.fr/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable", // 1 jour de cache
    },
  });
}
