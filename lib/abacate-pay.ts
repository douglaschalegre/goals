// Abacate Pay client for PIX QR code generation
// Docs: https://docs.abacatepay.com/pages/pix-qrcode/create
// https://www.abacatepay.com/llms.txt

interface CreatePixQRCodeRequest {
  amount: number; // in cents
  description?: string;
  externalId?: string;
  methods?: string[];
}

interface PixQRCodeResponse {
  id: string;
  brCode: string; // QR string (BR Code)
  brCodeBase64: string; // Base64 image data
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
  if (!process.env.ABACATE_PAY_API_KEY) {
    throw new Error("Missing ABACATE_PAY_API_KEY env variable");
  }
  // Updated per llms doc: POST /v1/pixQrCode/create
  const response = await fetch(`${ABACATE_PAY_API_URL}/pixQrCode/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.ABACATE_PAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      description,
      metadata: { externalId },
    }),
  });

  if (!response.ok) {
    let errorText: string | undefined;
    try {
      const data = await response.json();
      errorText = JSON.stringify(data);
    } catch {
      errorText = await response.text();
    }
    console.error("Abacate Pay API error:", response.status, errorText);
    throw new Error(`Failed to create PIX QR code (status ${response.status}): ${errorText}`);
  }

  const json = await response.json();
  console.log("Abacate Pay response:", JSON.stringify(json, null, 2));

  // Normalize to expected PixQRCodeResponse shape
  const data = json.data ?? json;

  // Validate response has required fields
  if (!data.id || !data.brCode || !data.brCodeBase64) {
    console.error("Invalid Abacate Pay response:", json);
    throw new Error("Invalid response from Abacate Pay API - missing required fields");
  }

  return {
    id: data.id,
    brCode: data.brCode,
    brCodeBase64: data.brCodeBase64,
    expiresAt: data.expiresAt,
    amount: data.amount,
    status: data.status,
  };
}

export async function checkPaymentStatus(paymentId: string): Promise<{
  status: string;
  paid: boolean;
}> {
  if (!process.env.ABACATE_PAY_API_KEY) {
    throw new Error("Missing ABACATE_PAY_API_KEY env variable");
  }
  // Updated per llms doc: GET /v1/pixQrCode/check?id=...
  const url = `${ABACATE_PAY_API_URL}/pixQrCode/check?id=${encodeURIComponent(paymentId)}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${process.env.ABACATE_PAY_API_KEY}`,
    },
  });

  if (!response.ok) {
    let errorText: string | undefined;
    try {
      const data = await response.json();
      errorText = JSON.stringify(data);
    } catch {
      errorText = await response.text();
    }
    console.error("Abacate Pay status error:", response.status, errorText);
    throw new Error(`Failed to check payment status (status ${response.status})`);
  }

  const body = await response.json();
  const data = body.data ?? body;
  return {
    status: data.status,
    paid: data.status === "PAID" || data.status === "COMPLETED",
  };
}
