import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const body = await req.json();

  const {
    titulo,
    conteudo,

    // Empresa
    nome_empresa,
    cnpj_empresa,
    endereco_empresa,
    telefone_empresa,
    email_empresa,
    representante_empresa,
    cargo_representante_empresa,

    // Cliente
    nome_cliente,
    cpf_cnpj_cliente,
    endereco_cliente,
    telefone_cliente,
    email_cliente,
    representante_cliente,
    cargo_representante_cliente,

    // Dados do contrato
    tipo_contrato,
    objeto,
    valor,
    forma_pagamento,
    prazo_execucao,
    data_inicio,
    data_fim,
    multa_rescisao,
    foro,

    clausulas,
  } = body;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const status = !titulo || titulo.trim() === "" ? "rascunho" : "ativo";

  const { data, error } = await supabase
    .from("Contratos")
    .insert({
      user_id: user.id,
      titulo,
      conteudo,
      status,

      // Empresa
      nome_empresa,
      cnpj_empresa,
      endereco_empresa,
      telefone_empresa,
      email_empresa,
      representante_empresa,
      cargo_representante_empresa,

      // Cliente
      nome_cliente,
      cpf_cnpj_cliente,
      endereco_cliente,
      telefone_cliente,
      email_cliente,
      representante_cliente,
      cargo_representante_cliente,

      // Dados do contrato
      tipo_contrato,
      objeto,
      valor,
      forma_pagamento,
      prazo_execucao,
      data_inicio,
      data_fim,
      multa_rescisao,
      foro,

      clausulas,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
