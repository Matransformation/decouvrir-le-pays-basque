import { supabase } from "../../lib/supabaseClient";
import LieuxClient from "./LieuxClient";

export const revalidate = 0;

export default async function LieuxPage() {
  const { data: lieux, error } = await supabase.from("lieux").select("*");

  if (error) {
    console.error("Erreur Supabase :", error);
    return <p>Erreur de chargement des lieux.</p>;
  }

  return <LieuxClient lieux={lieux || []} />;
}
