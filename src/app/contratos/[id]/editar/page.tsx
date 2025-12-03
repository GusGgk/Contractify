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

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Contrato</h1>

      <form action={`/api/contratos/${params.id}/update`} method="POST" className="space-y-4">

        <input
          type="text"
          name="titulo"
          defaultValue={contrato.titulo}
          className="w-full p-2 border rounded-md"
          required
        />

        <textarea
          name="conteudo"
          defaultValue={contrato.conteudo}
          className="w-full p-2 border rounded-md"
          rows={10}
        ></textarea>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Salvar Alterações
        </button>

      </form>
    </div>
  );
}
