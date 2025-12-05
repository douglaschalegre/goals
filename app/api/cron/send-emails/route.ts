import { NextRequest, NextResponse } from "next/server";
import { getDb, now } from "@/lib/db";
import { sendGoalsReminderEmail } from "@/lib/resend";
import { exportCanvasToPNG } from "@/lib/canvas-export";
import type { GoalsData } from "@/types/goals";

// This endpoint should be called by a cron job daily
// In production, protect this with a secret key
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    const db = getDb();

    // Find submissions that need to be sent today
    const submissions = db.prepare(`
      SELECT id, email, name, goals_data
      FROM goal_submissions
      WHERE scheduled_send_date <= ?
        AND email_sent = 0
        AND payment_status = 'completed'
      LIMIT 100
    `).all(today);
    const sentEmails = [];
    const failedEmails = [];

    for (const submission of submissions) {
      try {
        // For a real implementation, you'd need to:
        // 1. Recreate the canvas from goals_data
        // 2. Export it as an image
        // 3. Upload the image to R2 or a CDN
        // 4. Get the public URL
        // For now, we'll use a placeholder

        // In a real implementation, you'd render the canvas server-side
        // and upload it to get a URL. For this demo, we'll skip that part.
        const goalsImageUrl = "https://placeholder.com/goals-image.png";

        // Send email
        await sendGoalsReminderEmail(
          submission.email,
          submission.name,
          goalsImageUrl
        );

        // Mark as sent
        db.prepare(`
          UPDATE goal_submissions
          SET email_sent = 1, email_sent_at = ?
          WHERE id = ?
        `).run(now(), submission.id);

        sentEmails.push(submission.email);
      } catch (error) {
        console.error(`Failed to send email to ${submission.email}:`, error);
        failedEmails.push(submission.email);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentEmails.length,
      failed: failedEmails.length,
      sentEmails,
      failedEmails,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to send scheduled emails" },
      { status: 500 }
    );
  }
}
