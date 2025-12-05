import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId, oneYearFromNow } from "@/lib/db";
import type { GoalsData, KanbanData } from "@/types/goals";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, goalsData } = body as {
      email: string;
      name?: string;
      goalsData: GoalsData | KanbanData;
    };

    // Validate input
    if (!email || !goalsData) {
      return NextResponse.json(
        { error: "Email and goals data are required" },
        { status: 400 }
      );
    }

    // Support both old canvas format and new kanban format
    const hasData =
      ('elements' in goalsData && goalsData.elements && goalsData.elements.length > 0) ||
      ('goals' in goalsData && goalsData.goals && goalsData.goals.length > 0);

    if (!hasData) {
      return NextResponse.json(
        { error: "Goals data must contain at least one item" },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = generateId();
    const scheduledDate = oneYearFromNow();

    // Insert submission into database
    const stmt = db.prepare(`
      INSERT INTO goal_submissions (id, email, name, goals_data, scheduled_send_date)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, email, name || null, JSON.stringify(goalsData), scheduledDate);

    return NextResponse.json({ submissionId: id });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
