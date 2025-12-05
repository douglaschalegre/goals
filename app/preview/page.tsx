"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoalsProvider, useGoals } from "@/lib/goals-context";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";
import { exportKanbanToPNG, exportKanbanToPDF, downloadBlob } from "@/lib/kanban-export";

function PreviewPageContent() {
  const router = useRouter();
  const { kanbanData } = useGoals();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const blob = await exportKanbanToPNG();
      if (blob) {
        downloadBlob(blob, `goals-board-${Date.now()}.png`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Falha ao exportar. Por favor, tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await exportKanbanToPDF();
      if (blob) {
        downloadBlob(blob, `goals-board-${Date.now()}.pdf`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Falha ao exportar. Por favor, tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmit = async (contactData: { email: string; name?: string }) => {
    if (kanbanData.goals.length === 0) {
      alert("Por favor, adicione pelo menos uma meta antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contactData.email,
          name: contactData.name,
          goalsData: kanbanData,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      const { submissionId } = await response.json();

      // Redirect to payment page
      router.push(`/payment/${submissionId}`);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Falha ao enviar. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Visualize Sua Cápsula do Tempo de Metas</h1>
            <p className="text-sm text-muted-foreground">
              Revise suas metas e envie para recebê-las em um ano
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/create")}>
            ← Voltar para Editar
          </Button>
        </div>
      </header>

      <div className="max-w-full mx-auto p-6">
        <div className="space-y-6">
          {/* Kanban Preview */}
          <div className="space-y-4">
            <KanbanBoard readonly />

            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={handleExportPNG}
                disabled={isExporting || kanbanData.goals.length === 0}
              >
                {isExporting ? "Exportando..." : "Baixar PNG"}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={isExporting || kanbanData.goals.length === 0}
              >
                {isExporting ? "Exportando..." : "Baixar PDF"}
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold mb-2">O que acontece a seguir?</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>✅ Suas metas serão armazenadas com segurança</li>
                <li>💳 Você terá a opção de pagar por um lembrete por e-mail de 1 ano</li>
                <li>📧 Se você escolher pagar, enviaremos suas metas de volta para você em exatamente um ano</li>
                <li>🎯 Reflita sobre seu progresso e celebre seu crescimento!</li>
              </ul>
            </div>
          </div>
        </div>
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
