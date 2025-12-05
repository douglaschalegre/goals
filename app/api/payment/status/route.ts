import { NextRequest, NextResponse } from "next/server";
import { checkPaymentStatus } from "@/lib/abacate-pay";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Check payment status from Abacate Pay
    const paymentStatus = await checkPaymentStatus(paymentId);

    // Update database if payment is complete
    if (paymentStatus.paid) {
      const db = getDb();
      db.prepare(`
        UPDATE goal_submissions
        SET payment_status = 'completed'
        WHERE payment_id = ?
      `).run(paymentId);
    }

    return NextResponse.json(paymentStatus);
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
