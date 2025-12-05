"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
  path: string;
  pathPattern?: RegExp;
}

const steps: Step[] = [
  { id: 1, name: "Criar", path: "/create" },
  { id: 2, name: "Revisar", path: "/preview" },
  {
    id: 3,
    name: "Pagar",
    path: "/payment",
    pathPattern: /^\/payment\/.+$/
  },
  { id: 4, name: "Concluído", path: "/success" },
];

export default function Stepper() {
  const pathname = usePathname();

  const getCurrentStep = () => {
    const currentStepIndex = steps.findIndex((step) => {
      if (step.pathPattern) {
        return step.pathPattern.test(pathname);
      }
      return pathname === step.path;
    });
    return currentStepIndex !== -1 ? currentStepIndex + 1 : 0;
  };

  const currentStep = getCurrentStep();

  // Don't show stepper on home page
  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 z-50">
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      isCompleted
                        ? "border-primary bg-primary text-white"
                        : isCurrent
                        ? "border-primary bg-primary text-white"
                        : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCompleted || isCurrent
                        ? "text-primary dark:text-primary"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 transition-all ${
                      currentStep > step.id
                        ? "bg-primary"
                        : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
