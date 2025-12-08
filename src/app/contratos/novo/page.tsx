import { redirect } from "next/navigation";
import ContratoForm from "@/components/ContratoForm";
import "../contratos.css";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NovoContrato() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) redirect("/login");

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Criar novo contrato</h1>

      <ContratoForm user_id={data.user.id} />
    </div>
  );
}
