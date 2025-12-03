import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return redirect("/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Bem-vindo, {data.user.email}</h1>
      <a href="/logout" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
      Sair
      </a>
    </div>
  );
}
