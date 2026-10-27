import { NextResponse } from "next/server";
import {
  findLead,
  setLeadStatus,
  softDeleteLead,
  restoreLead,
  purgeLead,
  isLeadStatus,
  LEAD_STATUSES,
} from "../../../../lib/server/contact";
import { readAdmin } from "../../../../lib/server/auth";
import {
  ApiError,
  handler,
  notFound,
  unauthorized,
} from "../../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * PATCH /api/contact/messages/:id  (admin)
 *
 * `status` moves the lead between states; `restore` undoes a delete.
 */
export const PATCH = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    status?: unknown;
    restore?: unknown;
  };

  if (body.restore === true) {
    const restored = await restoreLead(Number(id));
    if (!restored) return notFound("Message not found");
    return NextResponse.json({ success: true, lead: await findLead(Number(id)) });
  }

  if (!isLeadStatus(body.status)) {
    throw new ApiError(422, `Status must be one of: ${LEAD_STATUSES.join(", ")}`);
  }

  const updated = await setLeadStatus(Number(id), body.status);
  if (!updated) return notFound("Message not found");

  return NextResponse.json({ success: true, status: body.status });
});

/**
 * DELETE /api/contact/messages/:id  (admin)
 *
 * Two stages, on purpose:
 *   default      → flags the lead as discarded; the row stays and can be restored
 *   ?permanent=1 → removes the row for good, replies included
 *
 * The permanent form only works on a lead that is already discarded, so a
 * single misplaced click can never destroy a real enquiry.
 */
export const DELETE = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const lead = await findLead(Number(id));
  if (!lead) return notFound("Message not found");

  const permanent =
    new URL(request.url).searchParams.get("permanent") === "1";

  if (!permanent) {
    await softDeleteLead(lead.id);
    return NextResponse.json({
      success: true,
      deleted: "flagged",
      message: "Moved to Deleted — you can still restore it.",
    });
  }

  if (!lead.deleted_at) {
    throw new ApiError(
      409,
      "Delete it first, then remove it permanently from the Deleted list.",
    );
  }

  await purgeLead(lead.id);
  return NextResponse.json({
    success: true,
    deleted: "permanent",
    message: "Removed from the database.",
  });
});
