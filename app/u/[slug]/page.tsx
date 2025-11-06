import { supabaseServer } from "@/lib/supabaseServer";
import ProfileClient from "./ProfileClient";

export const revalidate = 60; // Refresh toutes les minutes (ISR)

export default async function UserProfilePage(props: { params: Promise<{ slug: string }> }) {
  // ✅ Next.js : params est une Promise
  const { slug } = await props.params;

  const supabase = await supabaseServer();

  // 1) Profil utilisateur + likes_count
  const { data: user } = await supabase
    .from("users_public")
    .select("session_id, slug, prenom, bio, tags, avatar_url, likes_count") // ✅ Ajout ici
    .eq("slug", slug)
    .single();

  if (!user) {
    return (
      <main className="p-6 text-center">
        Profil introuvable 🙁
      </main>
    );
  }

  // 2) Favoris → lieux
  const { data: favoris } = await supabase
    .from("favoris")
    .select("lieux(*)")
    .eq("session_id", user.session_id);

  const lieux = favoris?.map((f) => f.lieux) ?? [];

  // 3) Structuration pour la carte
  const lieuxForMap = lieux
    .filter((l: any) => l.latitude && l.longitude)
    .map((l: any) => ({
      id: l.id,
      nom: l.nom,
      slug: l.slug,
      lat: Number(l.latitude),
      lng: Number(l.longitude),
      image: l.image_urls?.[0] ?? null,
      ville: l.ville ?? null,
    }));

  return (
    <ProfileClient
      user={user}
      lieux={lieux}
      lieuxForMap={lieuxForMap}
      slug={slug}
    />
  );
}
