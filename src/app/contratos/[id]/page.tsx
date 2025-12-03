import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Contratos() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: contratos } = await supabase
    .from("Contratos")
    .select("*")
    .eq("user_id", user?.id)
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
        {contratos?.map((c) => (
          <li key={c.id}>
            <Link href={`/contratos/${c.id}`} className="underline text-blue-600">
              {c.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
