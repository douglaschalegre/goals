"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoalsProvider, useGoals } from "@/lib/goals-context";
import PreviewBoard from "@/components/preview/PreviewBoard";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/ui/BottomNav";
// Export features removed

function PreviewPageContent() {
  const router = useRouter();
  const { kanbanData } = useGoals();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variant, setVariant] = useState<"poster" | "gallery">("poster");

  const handleSubmit = async (contactData: {
    email: string;
    name?: string;
  }) => {
    if (kanbanData.goals.length === 0) {
      alert("Por favor, adicione pelo menos uma meta antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactData.email,
          name: contactData.name,
          goalsData: kanbanData,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      const { submissionId } = await response.json();
      router.push(`/payment/${submissionId}`);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Falha ao enviar. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 bg-background-light/80 px-6 py-4 backdrop-blur-sm dark:bg-background-dark/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Prévia &amp; Pagamento</h1>
            <p className="text-sm text-muted-foreground">
              Revise suas metas e envie para recebê-las em um ano
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/create")}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="flex-grow px-4 pb-28">
        <section className="mt-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
              Meu Quadro de Metas {new Date().getFullYear()}
            </h2>
            <Button
              variant="outline"
              onClick={() => router.push("/create")}
              className="rounded-full"
            >
              Editar
            </Button>
          </div>
        </section>

        <section className="mt-4 max-w-7xl mx-auto">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid grid-cols-3 gap-2">
              {kanbanData.goals.map((goal) => {
                const hasImage = Boolean(goal.imageUrl);
                return (
                  <div
                    key={goal.id}
                    className={
                      hasImage
                        ? "aspect-square w-full rounded-lg bg-cover bg-center"
                        : "flex items-center justify-center rounded-lg bg-zinc-100 p-2 text-center dark:bg-zinc-800"
                    }
                    style={
                      hasImage
                        ? { backgroundImage: `url(${goal.imageUrl})` }
                        : undefined
                    }
                  >
                    {!hasImage && (
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                        {goal.title}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-8 max-w-2xl mx-auto">
          <div className="rounded-xl border-2 border-primary bg-primary/10 p-4 dark:bg-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Lembrete Anual
                </h3>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  R$ 5{" "}
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">
                    (pagamento único)
                  </span>
                </p>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-primary">
                <span className="text-xs text-white">✔</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 max-w-2xl mx-auto">
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
            O que acontece a seguir?
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-lg">
                ✅
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">
                Suas metas serão armazenadas com segurança.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-lg">
                💳
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">
                Você terá a opção de pagar para, em 1 ano, receber um lembrete
                por e-mail das suas metas.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-lg">
                📧
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">
                Se você escolher pagar, enviaremos suas metas de volta para você
                em exatamente um ano.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-lg">
                🎯
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">
                Reflita sobre seu progresso e celebre seu crescimento!
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 max-w-2xl mx-auto">
          <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-background-light px-4 pb-6 pt-4 dark:border-zinc-800 dark:bg-background-dark">
        <Button
          className="w-full rounded-full bg-primary py-6 text-lg font-bold"
          onClick={() =>
            alert("Preencha seus dados acima para continuar ao pagamento.")
          }
        >
          Pagar R$ 5
        </Button>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <GoalsProvider>
      <PreviewPageContent />
    </GoalsProvider>
  );
}
