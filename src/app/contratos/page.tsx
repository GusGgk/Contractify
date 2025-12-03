import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Contratos() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: contratos } = await supabase
    .from("Contratos")
    .select("*")
    .eq("user_id", user.id)
    .order("criado_em", { ascending: false });

  return (
    <div style={{ padding: 24 }}>
      <h1>Meus Contratos</h1>

      <Link
        href="/contratos/novo"
      >
        Criar Contrato
      </Link>

      <ul>
        {contratos?.map((c) => (
          <li key={c.id}>
            <Link href={`/contratos/${c.id}`}>{c.titulo}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
