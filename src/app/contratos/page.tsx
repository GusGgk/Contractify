import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Contrato {
  id: string;
  titulo: string;
  cliente: string;
  valor: number;
  created_at: string;
}

export default async function ContratosPage() {
  const supabase = createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  // Proteção: Se tentar acessar a lista sem estar logado, vai pro login
  if (!user) redirect("/login");

  const { data: contratos } = await supabase
    .from("contratos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Contratos</h1>
          <p className="text-gray-500">Gerencie seus documentos.</p>
        </div>
        <Link 
          href="/contratos/novo" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Novo Contrato
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Título</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Valor</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contratos && contratos.length > 0 ? (
              contratos.map((contrato: Contrato) => (
                <tr key={contrato.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{contrato.titulo}</td>
                  <td className="px-6 py-4 text-gray-600">{contrato.cliente}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.valor || 0)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link href={`/contratos/${contrato.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}