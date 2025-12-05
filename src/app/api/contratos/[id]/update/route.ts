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

    // Busca contrato e status atual
    const { data: contrato, error: fetchErr } = await supabase
      .from("Contratos")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message || fetchErr }, { status: 400 });
    }

    if (!contrato) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    }

    if (contrato.user_id !== user.id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    if (contrato.status === "assinado" || contrato.status === "arquivado") {
      return NextResponse.json(
        { error: "Este contrato está finalizado e não pode mais ser alterado." },
        { status: 403 }
      );
    }

    function calcularStatus() {
      if (!titulo.trim()) return "rascunho";
      if (titulo.trim() && conteudo.trim()) return "ativo";
      return "rascunho";
    }

    const novoStatus = calcularStatus();

    const { error: updateErr } = await supabase
      .from("Contratos")
      .update({
        titulo,
        conteudo,
        status: novoStatus, 
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message || updateErr }, { status: 400 });
    }

    return NextResponse.redirect(new URL(`/contratos/${id}`, req.url));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
