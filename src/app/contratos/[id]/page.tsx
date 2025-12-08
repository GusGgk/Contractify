import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import "../contratos.css";
import Link from "next/link";

export default async function ContratoPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();

  // Verifica usuário logado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Busca contrato
  const { data: contrato } = await supabase
    .from("Contratos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!contrato) notFound();
  if (contrato.user_id !== user.id) notFound();

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">
          {contrato.titulo || "Sem título"}
        </h1>

        <div className="flex gap-4 mt-4">

          <a
            href={`/contratos/${params.id}/editar`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Editar
          </a>

          <form action={`/api/contratos/${params.id}/delete`} method="POST">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Excluir
            </button>
          </form>

        </div>
      </div>

      {/* 📄 NOVO: Botões de PDF */}
      <div className="flex gap-4 mt-4">

        {/* Gerar PDF na hora */}
        <a
          href={`/api/contratos/${params.id}/pdf`}
          target="_blank"
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Gerar PDF
        </a>

        {/* Baixar PDF salvo (se existir) */}
        {contrato.arquivo_url && (
          <a
            href={contrato.arquivo_url}
            target="_blank"
            className="px-4 py-2 bg-purple-600 text-white rounded-md"
          >
            Baixar PDF Salvo
          </a>
        )}

      </div>

      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md mt-6">
        {contrato.conteudo || "Sem conteúdo"}
      </pre>

      <Link href="/contratos" className="block mt-6 text-blue-600 underline">
        ← Voltar para meus contratos
      </Link>
    </div>
  );
}
