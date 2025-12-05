import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { initDatabase } from "@/lib/db";
import { Toaster } from "sonner";

const manrope = Manrope({ subsets: ["latin"] });

// Initialize database on server startup
if (typeof window === "undefined") {
  initDatabase();
}

export const metadata: Metadata = {
  title: "Quadro de Metas - Crie Sua Visão Para o Próximo Ano",
  description:
    "Crie um Quadro de metas personalizado com suas metas para o próximo ano. Receba suas metas de volta por e-mail um ano depois.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={manrope.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
