import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Mudamos Geist para Inter
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contractify - Gestão de Contratos",
  description: "Gerencie seus contratos de forma inteligente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <div className="flex h-screen overflow-hidden">
          {/* SIDEBAR */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Contractify</h1>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
              <Link href="/dashboard" className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                <span className="ml-3 font-medium">Início</span>
              </Link>
              <Link href="/contratos" className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                <span className="ml-3 font-medium">Meus Contratos</span>
              </Link>
              <Link href="/contratos/novo" className="flex items-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                <span className="ml-3 font-medium">Novo Contrato</span>
              </Link>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <Link href="/perfil" className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="ml-3 font-medium">Meu Perfil</span>
              </Link>
              {/* Note: Ajuste a rota de logout se necessário */}
              <a href="/logout" className="w-full text-left flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2">
                <span className="ml-3 font-medium">Sair</span>
              </a>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}