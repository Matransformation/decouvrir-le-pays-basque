import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ✅ Fonction pour générer un slug propre
function generateSlug(name: string, city: string) {
  return `${name}-${city}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type NominatimHit = { lat: string; lon: string };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, city, category, description, image_url, image_urls } = body ?? {};

    if (!name || !city) {
      return NextResponse.json(
        { success: false, error: "Nom et ville sont requis." },
        { status: 400 }
      );
    }

    // ✅ Slug
    let slug = generateSlug(name, city);

    // ✅ Unicité du slug
    const { data: existing } = await supabase
      .from("lieux")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) slug = `${slug}-${Math.floor(Math.random() * 1000)}`;

    // 🗺️ Géocodage via Nominatim (OpenStreetMap) — sans axios
    let latitude: number | null = null;
    let longitude: number | null = null;

    try {
      const u = new URL("https://nominatim.openstreetmap.org/search");
      u.search = new URLSearchParams({
        q: `${name}, ${city}`,
        format: "json",
        limit: "1",
      }).toString();

      const geoRes = await fetch(u.toString(), {
        headers: {
          // Nominatim exige un User-Agent « identifiable »
          "User-Agent": "DecouvrirPaysBasqueApp/1.0 (contact@example.com)",
          "Accept-Language": "fr",
        },
        cache: "no-store", // pas de cache pour ce call
      });

      if (geoRes.ok) {
        const arr = (await geoRes.json()) as NominatimHit[];
        if (Array.isArray(arr) && arr.length > 0) {
          latitude = parseFloat(arr[0].lat);
          longitude = parseFloat(arr[0].lon);
          if (Number.isNaN(latitude)) latitude = null;
          if (Number.isNaN(longitude)) longitude = null;
        }
      } else {
        console.warn("⚠️ Nominatim non OK:", geoRes.status, await geoRes.text());
      }
    } catch (e) {
      console.warn("⚠️ Erreur géolocalisation :", e);
    }

    // ✅ Données à insérer
    const newLieu = {
      nom: name,
      ville: city,
      categorie: category || null,
      description: description || null,
      slug,
      image_url: image_url || null, // compat ancien champ
      image_urls: Array.isArray(image_urls) && image_urls.length ? image_urls : null,
      latitude,
      longitude,
    };

    // ✅ Insertion Supabase
    const { data, error } = await supabase
      .from("lieux")
      .insert([newLieu])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}
