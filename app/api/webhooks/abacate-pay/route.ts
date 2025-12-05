import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (in production, you should verify the webhook secret)
    const signature = request.headers.get("x-webhook-signature");

    // For now, we'll accept the webhook but in production you should verify
    // if (signature !== process.env.ABACATE_PAY_WEBHOOK_SECRET) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const body = await request.json();
    const { id: paymentId, status, externalId } = body;

    const db = getDb();

    // Update payment status in database
    if (status === "PAID" || status === "COMPLETED") {
      db.prepare(`
        UPDATE goal_submissions
        SET payment_status = 'completed'
        WHERE payment_id = ? OR id = ?
      `).run(paymentId, externalId);
    } else if (status === "FAILED" || status === "CANCELLED") {
      db.prepare(`
        UPDATE goal_submissions
        SET payment_status = 'failed'
        WHERE payment_id = ? OR id = ?
      `).run(paymentId, externalId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
