import type { ReactNode } from "react";

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
