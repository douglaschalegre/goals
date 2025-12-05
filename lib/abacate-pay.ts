// Abacate Pay client for PIX QR code generation
// Docs: https://docs.abacatepay.com/pages/pix-qrcode/create

interface CreatePixQRCodeRequest {
  amount: number; // in cents
  description?: string;
  externalId?: string;
  methods?: string[];
}

interface PixQRCodeResponse {
  id: string;
  url: string;
  qrCode: string;
  qrCodeBase64: string;
  expiresAt: string;
  amount: number;
  status: string;
}

const ABACATE_PAY_API_URL = "https://api.abacatepay.com/v1";

export async function createPixQRCode(
  amount: number,
  description: string,
  externalId: string
): Promise<PixQRCodeResponse> {
  const response = await fetch(`${ABACATE_PAY_API_URL}/billing/pix`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.ABACATE_PAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      description,
      externalId,
      methods: ["PIX"],
    } as CreatePixQRCodeRequest),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Abacate Pay API error:", error);
    throw new Error("Failed to create PIX QR code");
  }

  return response.json();
}

export async function checkPaymentStatus(paymentId: string): Promise<{
  status: string;
  paid: boolean;
}> {
  const response = await fetch(
    `${ABACATE_PAY_API_URL}/billing/${paymentId}`,
    {
      headers: {
        "Authorization": `Bearer ${process.env.ABACATE_PAY_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to check payment status");
  }

  const data = await response.json();
  return {
    status: data.status,
    paid: data.status === "PAID" || data.status === "COMPLETED",
  };
}
