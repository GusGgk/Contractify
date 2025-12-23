import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const body = await req.json();

  const {
    titulo,
    conteudo,
    // Empresa
    nome_empresa, cnpj_empresa, endereco_empresa, telefone_empresa, email_empresa, representante_empresa, cargo_representante_empresa,
    // Cliente
    nome_cliente, cpf_cnpj_cliente, endereco_cliente, telefone_cliente, email_cliente, representante_cliente, cargo_representante_cliente,
    // Dados Extras
    tipo_contrato, objeto, valor, forma_pagamento, prazo_execucao, data_inicio, data_fim, multa_rescisao, foro,
    clausulas,
  } = body;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const status = !titulo || titulo.trim() === "" ? "rascunho" : "ativo";

  // MONTANDO OS OBJETOS JSONB PARA O BANCO
  const { data, error } = await supabase
    .from("Contratos") // Certifique-se que o "C" é maiúsculo como no seu banco
    .insert({
      user_id: user.id,
      titulo,
      conteudo,
      status,
      representante_empresa,
      representante_cliente,
      tipo_contrato,
      objeto,
      forma_pagamento,
      data_fim: data_fim || null,
      multa_rescisao,
      foro,
      clausulas: clausulas || [],
      // Agrupando campos nos JSONB que você criou:
      empresa: {
        nome: nome_empresa,
        cnpj: cnpj_empresa,
        endereco: endereco_empresa,
        telefone: telefone_empresa,
        email: email_empresa,
        cargo_representante: cargo_representante_empresa
      },
      cliente: {
        nome: nome_cliente,
        identificacao: cpf_cnpj_cliente,
        endereco: endereco_cliente,
        telefone: telefone_cliente,
        email: email_cliente,
        cargo_representante: cargo_representante_cliente
      },
      dados: {
        valor: parseFloat(valor) || 0,
        prazo: prazo_execucao,
        inicio: data_inicio
      }
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}