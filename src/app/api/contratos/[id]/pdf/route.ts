import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Contratos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Contrato não encontrado" },
      { status: 404 }
    );
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const { width } = page.getSize();

  const titleFontSize = 20;

  page.drawText(data.titulo ?? "Contrato", {
    x: 40,
    y: 750,
    size: titleFontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const text = data.conteudo ?? "Sem conteúdo";
  const maxWidth = width - 80;

  let y = 720;
  const lineHeight = 16;

  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth) {
      page.drawText(line, { x: 40, y, size: fontSize, font });
      line = words[i] + " ";
      y -= lineHeight;
    } else {
      line = testLine;
    }
  }

  page.drawText(line, { x: 40, y, size: fontSize, font });

const pdfBytes = await pdfDoc.save();

const safeBytes = new Uint8Array(pdfBytes);

const blob = new Blob([safeBytes], { type: "application/pdf" });

return new Response(blob, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline; filename=contrato.pdf",
  },
});


}
