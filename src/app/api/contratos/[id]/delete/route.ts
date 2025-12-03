import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServerClient();
    const id = params.id;

    const { data: sessionInfo } = await supabase.auth.getSession();
    const user = sessionInfo?.session?.user;
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    // Verifica se a linha existe e pertence ao user
    const { data: contrato, error: fetchErr } = await supabase
      .from("Contratos")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchErr) {
      console.error("FETCH ERR:", fetchErr);
      return NextResponse.json({ error: fetchErr.message || fetchErr }, { status: 400 });
    }

    if (!contrato) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    }

    if (contrato.user_id !== user.id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    // Deleta
    const { error: deleteErr } = await supabase.from("Contratos").delete().eq("id", id);

    if (deleteErr) {
      console.error("DELETE ERR:", deleteErr);
      return NextResponse.json({ error: deleteErr.message || deleteErr }, { status: 400 });
    }

    // Se quiser redirect:
    return NextResponse.redirect(new URL("/contratos", req.url));
   
  } catch (err) {
    console.error("ERROR DELETE ROUTE:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
