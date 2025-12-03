import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface CallbackProps {
  searchParams: {
    code?: string;
  };
}

export default async function AuthCallbackPage({ searchParams }: CallbackProps) {
  const code = searchParams.code;

  if (!code) return redirect("/login");

  const supabase = createSupabaseServerClient();

  await supabase.auth.exchangeCodeForSession(code);

  return redirect("/dashboard");
}
