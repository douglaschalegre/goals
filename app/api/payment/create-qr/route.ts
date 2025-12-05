import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createPixQRCode } from "@/lib/abacate-pay";

// Default payment amount (in cents) - e.g., R$ 4.99
const DEFAULT_AMOUNT = 499;

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if submission exists
    const submission = db.prepare(`
      SELECT id, email, name FROM goal_submissions
      WHERE id = ?
    `).get(submissionId);

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Create PIX QR code via Abacate Pay
    console.log(`Creating PIX QR code for submission ${submissionId}, amount: R$ ${DEFAULT_AMOUNT / 100}`);
    const pixResponse = await createPixQRCode(
      DEFAULT_AMOUNT,
      "Goals Vision Board - 1 Year Email Reminder",
      submissionId
    );

    console.log(`PIX QR code created successfully: ${pixResponse.id}`);

    // Update submission with payment info
    db.prepare(`
      UPDATE goal_submissions
      SET payment_id = ?, payment_amount = ?
      WHERE id = ?
    `).run(pixResponse.id, DEFAULT_AMOUNT / 100, submissionId);

    const responseData = {
      qrCode: pixResponse.brCode,
      qrCodeBase64: pixResponse.brCodeBase64,
      amount: DEFAULT_AMOUNT,
      expiresAt: pixResponse.expiresAt,
      paymentId: pixResponse.id,
    };

    console.log("Returning payment data:", {
      ...responseData,
      qrCodeBase64: `${responseData.qrCodeBase64.substring(0, 50)}...`,
      qrCode: `${responseData.qrCode.substring(0, 50)}...`,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Payment creation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("Error stack:", stack);
    return NextResponse.json(
      { error: "Failed to create payment", message },
      { status: 500 }
    );
  }
}

// Ensure Node runtime for server-side fetch and env access
export const runtime = "nodejs";
