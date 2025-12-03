import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Contratos() {
  const supabase = createSupabaseServerClient();

  // Verifica usuário logado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não estiver logado → redireciona para login
  if (!user) {
    redirect("/login");
  }

  // Busca os contratos do usuário
  const { data: contratos } = await supabase
    .from("Contratos")
    .select("*")
    .eq("user_id", user.id)
    .order("criado_em", { ascending: false });

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Meus Contratos</h1>

      <Link
        href="/contratos/novo"
        className="px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Criar Contrato
      </Link>

      <ul className="mt-6 space-y-3">
        {contratos && contratos.length > 0 ? (
          contratos.map((c) => (
            <li key={c.id}>
              <Link
                href={`/contratos/${c.id}`}
                className="underline text-blue-600"
              >
                {c.titulo && c.titulo.trim() !== "" ? c.titulo : "Sem título"}
              </Link>
            </li>
          ))
        ) : (
          <p className="text-gray-500 mt-4">Nenhum contrato criado ainda.</p>
        )}
      </ul>
    </div>
  );
}
