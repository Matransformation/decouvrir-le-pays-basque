"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies(); // ✅ Maintenant c'est un vrai store synchronisé

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string) {
          cookieStore.set(name, value, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 jours
            sameSite: "lax",
          });
        },
        remove(name: string) {
          cookieStore.set(name, "", {
            path: "/",
            maxAge: -1,
          });
        },
      },
    }
  );
}
