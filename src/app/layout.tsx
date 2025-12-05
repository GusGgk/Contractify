import type { ReactNode } from "react";
import "./globals.css";
export const metadata = {
  title: "Contractify",
  description: "Gerador de contratos",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
