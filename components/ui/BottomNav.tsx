"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  House,
  Grid2X2Check,
  PencilLine,
  CreditCard,
  Check,
  PartyPopper,
} from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine current step
  const getCurrentStep = () => {
    if (pathname === "/") return 0;
    if (pathname === "/create") return 1;
    if (pathname === "/preview") return 2;
    if (pathname.startsWith("/payment/")) return 3;
    if (pathname === "/success") return 4;
    return 0;
  };

  const currentStep = getCurrentStep();

  const getStepStatus = (step: number) => {
    if (currentStep > step) return "completed";
    if (currentStep === step) return "active";
    return "pending";
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-background-light/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-background-dark/95 z-40">
      <div className="mx-auto flex max-w-3xl items-center justify-center px-2 pb-2 pt-2 gap-1">
        {/* Home */}
        <button
          className={`flex flex-col items-center gap-1 px-2 ${
            currentStep > 0 || pathname === "/"
              ? "text-primary"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
          onClick={() => router.push("/")}
        >
          {currentStep > 0 ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <House className="text-2xl" />
          )}
          <p className={`text-xs ${pathname === "/" || currentStep > 0 ? "font-bold" : ""}`}>
            Início
          </p>
        </button>

        {/* Arrow */}
        <div className="text-xl text-zinc-300 dark:text-zinc-700">→</div>

        {/* Step 1: Criar */}
        <button
          className={`flex flex-col items-center gap-1 px-2 ${
            getStepStatus(1) === "completed"
              ? "text-primary"
              : getStepStatus(1) === "active"
                ? "text-primary"
                : "text-zinc-400 dark:text-zinc-500"
          }`}
          onClick={() => router.push("/create")}
        >
          {getStepStatus(1) === "completed" ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <PencilLine className="text-2xl" />
          )}
          <p
            className={`text-xs ${getStepStatus(1) === "active" ? "font-bold" : ""}`}
          >
            Criar
          </p>
        </button>

        {/* Arrow 1 */}
        <div
          className={`text-xl ${currentStep > 1 ? "text-primary" : "text-zinc-300 dark:text-zinc-700"}`}
        >
          →
        </div>

        {/* Step 2: Revisar */}
        <button
          className={`flex flex-col items-center gap-1 px-2 ${
            getStepStatus(2) === "completed"
              ? "text-primary"
              : getStepStatus(2) === "active"
                ? "text-primary"
                : "text-zinc-400 dark:text-zinc-500"
          }`}
          onClick={() => router.push("/preview")}
        >
          {getStepStatus(2) === "completed" ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <Grid2X2Check className="text-2xl" />
          )}
          <p
            className={`text-xs ${getStepStatus(2) === "active" ? "font-bold" : ""}`}
          >
            Revisar
          </p>
        </button>

        {/* Arrow 2 */}
        <div
          className={`text-xl ${currentStep > 2 ? "text-primary" : "text-zinc-300 dark:text-zinc-700"}`}
        >
          →
        </div>

        {/* Step 3: Pagar */}
        <button
          className={`flex flex-col items-center gap-1 px-2 ${
            getStepStatus(3) === "completed"
              ? "text-primary"
              : getStepStatus(3) === "active"
                ? "text-primary"
                : "text-zinc-400 dark:text-zinc-500"
          }`}
          disabled={currentStep < 3}
        >
          {getStepStatus(3) === "completed" ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <CreditCard className="text-2xl" />
          )}
          <p
            className={`text-xs ${getStepStatus(3) === "active" ? "font-bold" : ""}`}
          >
            Pagar
          </p>
        </button>

        {/* Arrow 3 */}
        <div
          className={`text-xl ${currentStep > 3 ? "text-primary" : "text-zinc-300 dark:text-zinc-700"}`}
        >
          →
        </div>

        {/* Step 4: Concluído */}
        <div
          className={`flex flex-col items-center gap-1 px-2 ${
            getStepStatus(4) === "active"
              ? "text-primary"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
        >
          <PartyPopper className="text-2xl" />
          <p
            className={`text-xs ${getStepStatus(4) === "active" ? "font-bold" : ""}`}
          >
            Pronto
          </p>
        </div>
      </div>
    </nav>
  );
}
