import { supabaseServer } from "@/lib/supabaseServer";
import ProfileClient from "./ProfileClient";

export const revalidate = 60;

export default async function UserProfilePage(props: { params: Promise<{ slug: string }> }) {
  // ✅ Déballer params qui est une Promise
  const { slug } = await props.params;

  const supabase = await supabaseServer();

  // ✅ Récup user (note l'inclusion de session_id)
  const { data: user } = await supabase
    .from("users_public")
    .select("id, session_id, slug, prenom, bio, tags, avatar_url, likes_count")
    .eq("slug", slug)
    .single();

  if (!user) return <main className="p-6 text-center">Profil introuvable 🙁</main>;

  // ✅ Très important → sélection des lieux favoris via session_id
  const { data: favs } = await supabase
    .from("favoris")
    .select(`
      id,
      lieu_id,
      lieux:lieu_id (
        id, nom, slug, ville, latitude, longitude, image_url, image_urls
      )
    `)
    .eq("user_id", user.session_id);

  const lieux = favs?.map((f) => f.lieux).filter(Boolean) ?? [];

  const lieuxForMap = lieux.map((l: any) => ({
    id: l.id,
    nom: l.nom,
    slug: l.slug,
    lat: Number(l.latitude),
    lng: Number(l.longitude),
    image: l.image_url ?? l.image_urls?.[0] ?? null,
    ville: l.ville ?? null,
  }));

  return (
    <ProfileClient
      user={user}
      slug={slug}
    />
  );
}
