"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentQRCodeProps {
  qrCodeBase64: string;
  qrCode: string;
  amount: number;
  expiresAt: string;
}

export function PaymentQRCode({ qrCodeBase64, qrCode, amount, expiresAt }: PaymentQRCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const formatExpiry = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Seu Pagamento</CardTitle>
        <CardDescription>
          Escaneie o código QR com o app do seu banco ou copie o código PIX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount */}
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">
            {formatAmount(amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            Pagamento único para lembrete por e-mail de 1 ano
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="border-4 border-gray-200 rounded-lg p-4 bg-white">
            <Image
              src={qrCodeBase64}
              alt="PIX QR Code"
              width={256}
              height={256}
              className="w-64 h-64"
              unoptimized
            />
          </div>
        </div>

        {/* PIX Code */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">PIX Copia e Cola</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrCode}
              readOnly
              className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm font-mono"
            />
            <Button onClick={handleCopy} variant="outline">
              {copied ? "✓ Copiado!" : "Copiar"}
            </Button>
          </div>
        </div>

        {/* Expiry */}
        <div className="text-center text-sm text-muted-foreground">
          Expira em: {formatExpiry(expiresAt)}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-sm">Como pagar:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside text-gray-700">
            <li>Abra o app do seu banco</li>
            <li>Vá para a seção PIX</li>
            <li>Escaneie o código QR ou cole o código acima</li>
            <li>Confirme o pagamento</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
