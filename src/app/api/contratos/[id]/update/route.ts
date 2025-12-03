import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseServerClient();
    const id = params.id;

    const { data: sessionInfo } = await supabase.auth.getSession();
    const user = sessionInfo?.session?.user;
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const form = await req.formData();
    const titulo = (form.get("titulo") || "") as string;
    const conteudo = (form.get("conteudo") || "") as string;

    // Verifica existência e dono
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

    const { error: updateErr } = await supabase
      .from("Contratos")
      .update({ titulo, conteudo, atualizado_em: new Date().toISOString() })
      .eq("id", id);

    if (updateErr) {
      console.error("UPDATE ERR:", updateErr);
      return NextResponse.json({ error: updateErr.message || updateErr }, { status: 400 });
    }

    return NextResponse.redirect(new URL(`/contratos/${id}`, req.url));
    // ou para debug: return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERROR UPDATE ROUTE:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
