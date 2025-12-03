"use client";

import { useState } from "react";

export default function GerarContrato() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGerar(e: any) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/contratos/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, conteudo }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Contrato criado com sucesso!");
      window.location.href = "/contratos";
    } else {
      alert("Erro: " + data.error);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Gerar Contrato</h1>

      <form onSubmit={handleGerar} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Título do contrato"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Conteúdo do contrato"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows={10}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar contrato"}
        </button>
      </form>
    </div>
  );
}
