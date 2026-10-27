import { NextResponse } from "next/server";
import { pool } from "../../lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Also pings MySQL, so a green check means the whole stack is up — not just
 * that Node is answering.
 */
export async function GET() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return NextResponse.json({
      ok: true,
      service: "uniqueweblayer",
      database: "connected",
      time: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "uniqueweblayer",
        database: "unreachable",
        detail: (error as Error).message,
      },
      { status: 503 },
    );
  }
}
