"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, BarChart3, CreditCard } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-background-light/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-background-dark/80">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 pb-2 pt-2">
        <button
          className={`flex flex-col items-center gap-1 ${
            isActive("/") ? "text-primary" : "text-zinc-400 dark:text-zinc-500"
          }`}
          onClick={() => router.push("/")}
        >
          <Home className="text-3xl" />
          <p className={`text-xs ${isActive("/") ? "font-bold" : ""}`}>
            Início
          </p>
        </button>
        <button
          className={`flex flex-col items-center gap-1 ${
            isActive("/create")
              ? "text-primary"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
          onClick={() => router.push("/create")}
        >
          <BarChart3 className="text-3xl" />
          <p className={`text-xs ${isActive("/create") ? "font-bold" : ""}`}>
            Metas
          </p>
        </button>
        <button
          className={`flex flex-col items-center gap-1 ${
            isActive("/preview")
              ? "text-primary"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
          onClick={() => router.push("/preview")}
        >
          <CreditCard className="text-3xl" />
          <p className={`text-xs ${isActive("/preview") ? "font-bold" : ""}`}>
            Pagamento
          </p>
        </button>
      </div>
    </nav>
  );
}
