import Link from "next/link";
import { redirect } from "next/navigation";
import "./contratos.css";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Badge estilosa para o status
function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    rascunho: "bg-gray-200 text-gray-800",
    ativo: "bg-blue-200 text-blue-800",
    assinado: "bg-green-200 text-green-800",
    arquivado: "bg-red-200 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colors[status] || "bg-gray-200"}`}>
      {status}
    </span>
  );
}

export default async function Contratos({ searchParams }: any) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const filtro = searchParams.status || "todos";

  // Monta o filtro no Supabase
  let query = supabase.from("Contratos").select("*").eq("user_id", user.id);

  if (filtro !== "todos") {
    query = query.eq("status", filtro);
  }

  const { data: contratos } = await query.order("criado_em", { ascending: false });

  const filtros = [
    { label: "Todos", value: "todos" },
    { label: "Rascunho", value: "rascunho" },
    { label: "Ativo", value: "ativo" },
    { label: "Assinado", value: "assinado" },
    { label: "Arquivado", value: "arquivado" },
  ];

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <Link
        href="/dashboard"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Voltar ao Dashboard
      </Link>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Contratos</h1>

        <Link
          href="/contratos/novo"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Criar Contrato
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        {filtros.map((f) => (
          <Link
            key={f.value}
            href={`/contratos?status=${f.value}`}
            className={`px-3 py-1 rounded-md border text-sm ${
              filtro === f.value ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Lista de contratos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contratos && contratos.length > 0 ? (
          contratos.map((c) => (
            <Link
              key={c.id}
              href={`/contratos/${c.id}`}
              className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">
                  {c.titulo?.trim() !== "" ? c.titulo : "Sem título"}
                </h2>
                <StatusBadge status={c.status} />
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {c.conteudo || "Nenhum conteúdo"}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">Nenhum contrato encontrado.</p>
        )}
      </div>
    </div>
  );
}
