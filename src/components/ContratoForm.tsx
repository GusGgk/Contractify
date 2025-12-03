"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ContratoForm({ user_id }: { user_id: string }) {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const { error } = await supabase.from("Contratos").insert({
      user_id,
      titulo,
      conteudo,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Contrato criado!");
    window.location.href = "/contratos";
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <textarea
        placeholder="Conteúdo"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
      />

      <button type="submit">Criar</button>
    </form>
  );
}
