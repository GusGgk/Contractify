import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: contrato, error } = await supabase
    .from("Contratos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !contrato) return NextResponse.json({ error: "Erro ao buscar contrato" }, { status: 404 });

  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(contrato.titulo || "CONTRATO", { x: 50, y: 800, size: 16, font: bold });
    
    // Acessando os campos dentro dos objetos JSONB
    const empresaNome = contrato.empresa?.nome || "Não informado";
    const clienteNome = contrato.cliente?.nome || "Não informado";
    const valor = contrato.dados?.valor || 0;

    page.drawText(`Empresa: ${empresaNome}`, { x: 50, y: 770, size: 11, font });
    page.drawText(`Cliente: ${clienteNome}`, { x: 50, y: 755, size: 11, font });
    page.drawText(`Valor: R$ ${valor}`, { x: 50, y: 740, size: 11, font });
    
    // Conteúdo principal (Cláusulas)
    page.drawText("TERMOS DO CONTRATO:", { x: 50, y: 710, size: 12, font: bold });
    
    // Função simples para quebrar linhas (melhorar depois)
    const text = contrato.conteudo || "";
    page.drawText(text.substring(0, 1000), { // Limitando para teste inicial
      x: 50, y: 690, size: 10, font, maxWidth: 500, lineHeight: 14
    });

    const pdfBytes = await pdfDoc.save();

    const buffer = Buffer.from(pdfBytes);


    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contrato_${contrato.titulo || 'documento'}.pdf"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Erro detalhado do PDF:", err);
    return NextResponse.json({ error: "Falha ao gerar PDF" }, { status: 500 });
  }
}