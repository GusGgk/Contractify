import Link from "next/link";
import "./dashboard.css";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Busca dados resumidos
  const { data: contratos } = await supabase
    .from("Contratos")
    .select("*")
    .eq("user_id", user.id)
    .order("criado_em", { ascending: false });

  const total = contratos?.length || 0;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo, {user.email}</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-lg shadow bg-white border">
          <p className="text-gray-600 text-sm">Total de Contratos</p>
          <h2 className="text-3xl font-bold">{total}</h2>
        </div>

        <div className="p-6 rounded-lg shadow bg-white border">
          <p className="text-gray-600 text-sm">Ativos</p>
          <h2 className="text-3xl font-bold">
            {contratos?.filter(c => c.status === "ativo").length || 0}
          </h2>
        </div>

        <div className="p-6 rounded-lg shadow bg-white border">
          <p className="text-gray-600 text-sm">Assinados</p>
          <h2 className="text-3xl font-bold">
            {contratos?.filter(c => c.status === "assinado").length || 0}
          </h2>
        </div>
      </div>

      {/* Últimos contratos */}
      <h2 className="text-xl font-semibold mb-4">Últimos contratos</h2>

      <div className="space-y-3">
        {contratos?.slice(0, 5).map((c) => (
          <Link
            key={c.id}
            href={`/contratos/${c.id}`}
            className="block p-4 border rounded-lg bg-white shadow hover:shadow-md transition"
          >
            <p className="text-lg font-medium">
              {c.titulo?.trim() !== "" ? c.titulo : "Sem título"}
            </p>
            <p className="text-sm text-gray-600">{c.status}</p>
          </Link>
        ))}

        {total === 0 && (
          <p className="text-gray-500">Nenhum contrato criado ainda.</p>
        )}
      </div>

      <div className="mt-6">
        <Link
          href="/contratos"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Ver todos os contratos
        </Link>
      </div>

      <a
        href="/logout"
        className="mt-10 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Sair
      </a>
    </div>
  );
}
