"use client";

import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={login}
        className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800"
      >
        Entrar com Google
      </button>
    </div>
  );
}
