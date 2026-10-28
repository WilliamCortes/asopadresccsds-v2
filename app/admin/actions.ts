"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedAdmin, safeAdminNext } from "@/lib/auth/admin";

export type LoginState = { error?: string };

const GENERIC_ERROR = "Credenciales inválidas o sin acceso.";

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeAdminNext(String(formData.get("next") ?? ""));

  if (!email || !password) return { error: GENERIC_ERROR };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user || !isAuthorizedAdmin(data.user)) {
    if (!error) await supabase.auth.signOut();
    return { error: GENERIC_ERROR };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}
