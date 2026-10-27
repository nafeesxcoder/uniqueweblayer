import { NextResponse } from "next/server";
import { countByType } from "../../../lib/server/projects";
import { SERVICE_TYPES, SERVICE_TYPE_LABELS } from "../../../lib/serviceTypes";
import { handler } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/projects/filters — labels + counts for the filter bar. */
export const GET = handler(async () => {
  const counts = await countByType();

  return NextResponse.json({
    filters: [
      { label: "All Projects", value: "all", count: counts.all || 0 },
      ...SERVICE_TYPES.map((value) => ({
        label: SERVICE_TYPE_LABELS[value],
        value,
        count: counts[value] || 0,
      })),
    ],
  });
});
