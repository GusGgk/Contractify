"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ContratoForm({ user_id, contrato }: any) {
  const isEdit = Boolean(contrato);

  // -------------------------------
  // CAMPOS DO FORMULÁRIO
  // -------------------------------
  const [titulo, setTitulo] = useState(contrato?.titulo || "");
  const [empresa, setEmpresa] = useState(contrato?.empresa || {});
  const [cliente, setCliente] = useState(contrato?.cliente || {});
  const [dados, setDados] = useState(contrato?.dados || {});
  const [clausulas, setClausulas] = useState(
    contrato?.clausulas || [""] // começa com 1 cláusula
  );

  // -------------------------------
  // ADICIONAR / REMOVER CLÁUSULAS
  // -------------------------------
  function addClausula() {
    setClausulas([...clausulas, ""]);
  }

  function removeClausula(index: number) {
    setClausulas(clausulas.filter((_: string, i: number) => i !== index));
  }

  function updateClausula(index: number, value: string) {
    const nova = [...clausulas];
    nova[index] = value;
    setClausulas(nova);
  }

  // -------------------------------
  // SALVAR CONTRATO
  // -------------------------------
  async function handleSave(e: any) {
    e.preventDefault();

    const body = {
      user_id,
      titulo,
      empresa,
      cliente,
      dados,
      clausulas,
    };

    const url = isEdit
      ? `/api/contratos/${contrato.id}/update`
      : "/api/contratos";

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Erro ao salvar contrato");
      return;
    }

    const data = await res.json();

    alert(isEdit ? "Contrato atualizado!" : "Contrato criado!");
    window.location.href = `/contratos/${data.id}`;
  }

  // -------------------------------
  // GERAR PDF
  // -------------------------------
  async function gerarPDF() {
    const res = await fetch(
      `/api/pdf?titulo=${encodeURIComponent(titulo)}&conteudo=${encodeURIComponent(
        JSON.stringify({ empresa, cliente, dados, clausulas })
      )}`
    );

    if (!res.ok) {
      alert("Erro ao gerar PDF");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-8 w-full max-w-3xl mx-auto"
    >
      <div className="p-6 border rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>

        <label className="block text-sm font-medium">Título</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          required
        />
      </div>

      <div className="p-6 border rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Dados da Empresa</h2>

        {["nome", "cnpj", "endereco"].map((field: string) => (
          <div key={field} className="mb-2">
            <label className="block text-sm font-medium capitalize">
              {field}
            </label>
            <input
              value={empresa[field] || ""}
              onChange={(e) =>
                setEmpresa({ ...empresa, [field]: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
        ))}
      </div>

      <div className="p-6 border rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Dados do Cliente</h2>

        {["nome", "cpf", "endereco"].map((field: string) => (
          <div key={field} className="mb-2">
            <label className="block text-sm font-medium capitalize">
              {field}
            </label>
            <input
              value={cliente[field] || ""}
              onChange={(e) =>
                setCliente({ ...cliente, [field]: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
        ))}
      </div>

      {/* DADOS DO CONTRATO */}
      <div className="p-6 border rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Dados do Contrato</h2>

        {["valor", "prazo", "data_inicio"].map((field: string) => (
          <div key={field} className="mb-2">
            <label className="block text-sm font-medium capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              value={dados[field] || ""}
              onChange={(e) =>
                setDados({ ...dados, [field]: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
        ))}
      </div>

      {/* CLÁUSULAS */}
      <div className="p-6 border rounded-xl shadow bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cláusulas</h2>
          <button
            type="button"
            onClick={addClausula}
            className="px-3 py-1 bg-green-600 text-white rounded-md"
          >
            Nova cláusula
          </button>
        </div>

        {clausulas.map((c: string, i: number) => (
          <div key={i} className="mb-4 border p-4 rounded-md bg-gray-50">
            <textarea
              value={c}
              onChange={(e) => updateClausula(i, e.target.value)}
              rows={4}
              className="w-full p-2 border rounded-md"
            />

            {clausulas.length > 1 && (
              <button
                type="button"
                onClick={() => removeClausula(i)}
                className="mt-2 text-red-600 underline text-sm"
              >
                Remover cláusula
              </button>
            )}
          </div>
        ))}
      </div>

      {/* BOTÕES */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          {isEdit ? "Salvar alterações" : "Criar contrato"}
        </button>

        <button
          type="button"
          onClick={gerarPDF}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg"
        >
          Gerar PDF
        </button>
      </div>
    </form>
  );
}
