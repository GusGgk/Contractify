import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";

export default async function EditarContrato({ params }: any) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: contrato } = await supabase
    .from("Contratos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!contrato) notFound();
  if (contrato.user_id !== user.id) notFound();

  const bloqueado =
    contrato.status === "assinado" || contrato.status === "arquivado";

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Contrato</h1>

      <form
        action={`/api/contratos/${params.id}/update`}
        method="POST"
        encType="multipart/form-data"
        className="space-y-4"
      >
        <p className="text-sm text-gray-600">
          Status atual: <strong>{contrato.status}</strong>
        </p>

        <input
          type="text"
          name="titulo"
          defaultValue={contrato.titulo}
          className="w-full p-2 border rounded-md"
          required
          disabled={bloqueado}
        />

        <textarea
          name="conteudo"
          defaultValue={contrato.conteudo}
          className="w-full p-2 border rounded-md"
          rows={10}
          disabled={bloqueado}
        ></textarea>

        {!bloqueado && (
          <div>
            <label className="block font-medium mb-1">Substituir PDF:</label>
            <input
              type="file"
              name="arquivo"
              accept="application/pdf"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Se você não enviar um novo PDF, o atual será mantido.
            </p>
          </div>
        )}

        {contrato.arquivo_url && (
          <p className="text-sm mt-2">
            PDF atual:{" "}
            <a
              href={contrato.arquivo_url}
              target="_blank"
              className="text-blue-600 underline"
            >
              abrir PDF
            </a>
          </p>
        )}

        {!bloqueado && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Salvar Alterações
          </button>
        )}
      </form>
    </div>
  );
}
