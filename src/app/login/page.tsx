"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("Email ou senha incorretos.");
      return;
    }

    window.location.href = "/dashboard";
  }

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-900 dark:to-zinc-800 p-4">

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl border border-zinc-300 dark:border-zinc-700 rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
          />

          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
          />

          {erro && <p className="text-red-600 text-sm">{erro}</p>}

          <button
            type="submit"
            className="w-full bg-black hover:bg-zinc-800 text-white py-3 rounded-lg transition-all"
          >
            Entrar
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
          <span className="px-4 text-zinc-600 dark:text-zinc-400 text-sm">ou</span>
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
        </div>

        <button
          onClick={loginGoogle}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Entrar com Google
        </button>

      </div>
      <p>Ainda não possui um cadastro? acesse aqui!</p>
        <Link
          href="/cadastro"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Criar Cadastro
        </Link>
    </div>
  );
}
