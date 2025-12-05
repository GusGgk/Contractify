"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";


export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleCadastro(e: any) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      return;
    }

    setSucesso("Conta criada! Verifique seu email para confirmar.");
  }

  async function cadastrarGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-900 dark:to-zinc-800 p-4">
      
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-300 dark:border-zinc-700 p-8">
        
        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
          Criar Conta
        </h1>

        <form onSubmit={handleCadastro} className="space-y-4">

          <div>
            <label className="block font-medium mb-1 dark:text-zinc-200">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 dark:text-zinc-200">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 dark:text-zinc-200">Confirmar Senha</label>
            <input
              type="password"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {erro && (
            <p className="text-red-600 text-sm font-medium">{erro}</p>
          )}

          {sucesso && (
            <p className="text-green-600 text-sm font-medium">{sucesso}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black hover:bg-zinc-800 text-white py-3 rounded-lg transition-all"
          >
            Criar Conta
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
          <span className="px-4 text-zinc-600 dark:text-zinc-400 text-sm">ou</span>
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
        </div>

        <button
          onClick={cadastrarGoogle}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Criar conta com Google
        </button>

      </div>
            <p>Já tem uma conta? Então realize seu login aqui!</p>
        <Link
          href="/login"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Fazer Login
        </Link>
    </div>
  );
}
