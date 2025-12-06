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

const siteConfig = {
  name: "Quadro de Metas",
  title: "Quadro de Metas - Crie Sua Visão Para o Próximo Ano",
  description:
    "Crie um Quadro de metas personalizado com suas metas para o próximo ano. Receba suas metas de volta por e-mail um ano depois.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "quadro de metas",
    "vision board",
    "metas 2026",
    "planejamento anual",
    "objetivos",
    "desenvolvimento pessoal",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/icons8-alvo-32.ico",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/icons8-alvo-32.ico"],
  },
  icons: {
    icon: "/icons8-alvo-32.ico",
    shortcut: "/icons8-alvo-32.ico",
    apple: "/icons8-alvo-32.ico",
  },
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
