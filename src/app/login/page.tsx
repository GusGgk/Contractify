"use client";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={login}
        className="px-6 py-3 rounded-lg bg-black text-white hover:bg-zinc-800"
      >
        Entrar com Google
      </button>
    </div>
  );
}
