import { supabase } from "./supabaseClient";

export async function getLieux() {
  const { data, error } = await supabase
    .from("lieux")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur Supabase :", error);
    return [];
  }

  return data;
}
