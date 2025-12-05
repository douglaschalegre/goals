"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentQRCode } from "@/components/payment/PaymentQRCode";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/ui/BottomNav";
import { toast } from "sonner";

interface PaymentData {
  qrCode: string;
  qrCodeBase64: string;
  amount: number;
  expiresAt: string;
  paymentId: string;
}

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  useEffect(() => {
    createPayment();
  }, []);

  const createPayment = async () => {
    try {
      const { id } = await params;
      const response = await fetch("/api/payment/create-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const data = await response.json();
      setPaymentData(data);
    } catch (err) {
      console.error("Payment creation error:", err);
      setError("Falha ao gerar pagamento. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentData) return;

    setIsCheckingPayment(true);
    try {
      const response = await fetch(
        `/api/payment/status?paymentId=${paymentData.paymentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const { paid } = await response.json();

      if (paid) {
        router.push("/success");
      } else {
        toast.error(
          "Pagamento ainda não recebido. Por favor, complete o pagamento e tente novamente."
        );
      }
    } catch (err) {
      console.error("Payment status check error:", err);
      toast.error(
        "Falha ao verificar status do pagamento. Por favor, tente novamente."
      );
    } finally {
      setIsCheckingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Gerando pagamento...</div>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800 mb-4">
              {error || "Dados de pagamento não disponíveis"}
            </p>
            <Button onClick={createPayment}>Tentar Novamente</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Pagamento</h1>
          <p className="text-sm text-muted-foreground">
            Complete o pagamento para receber o lembrete de suas metas em um ano
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <PaymentQRCode
          qrCodeBase64={paymentData.qrCodeBase64}
          qrCode={paymentData.qrCode}
          amount={paymentData.amount}
          expiresAt={paymentData.expiresAt}
        />

        <div className="mt-6 flex flex-col gap-4">
          <Button
            onClick={checkPaymentStatus}
            disabled={isCheckingPayment}
            className="w-full"
            size="lg"
          >
            {isCheckingPayment ? "Verificando..." : "Já Completei o Pagamento"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full"
          >
            Pular Pagamento (Sem Lembrete por E-mail)
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
