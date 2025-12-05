import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createPixQRCode } from "@/lib/abacate-pay";

// Default payment amount (in cents) - e.g., R$ 29.90
const DEFAULT_AMOUNT = 2990;

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
    const pixResponse = await createPixQRCode(
      DEFAULT_AMOUNT,
      "Goals Vision Board - 1 Year Email Reminder",
      submissionId
    );

    // Update submission with payment info
    db.prepare(`
      UPDATE goal_submissions
      SET payment_id = ?, payment_amount = ?
      WHERE id = ?
    `).run(pixResponse.id, DEFAULT_AMOUNT / 100, submissionId);

    return NextResponse.json({
      qrCode: pixResponse.brCode,
      qrCodeBase64: pixResponse.brCodeBase64,
      amount: DEFAULT_AMOUNT,
      expiresAt: pixResponse.expiresAt,
      paymentId: pixResponse.id,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create payment", message },
      { status: 500 }
    );
  }
}

// Ensure Node runtime for server-side fetch and env access
export const runtime = "nodejs";
