import { redirect } from "next/navigation";
import ContratoForm from "@/components/ContratoForm";
import "../contratos.css";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NovoContrato() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div style={{ padding: 24 }}>
      <h1>Criar novo contrato</h1>
      <ContratoForm user_id={user.id} />
    </div>
  );
}
