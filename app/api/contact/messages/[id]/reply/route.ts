import { NextResponse } from "next/server";
import { z } from "zod";
import { findLead, saveReply, listReplies } from "../../../../../lib/server/contact";
import { sendReply } from "../../../../../lib/server/mailer";
import { readAdmin } from "../../../../../lib/server/auth";
import { handler, notFound, unauthorized } from "../../../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const replySchema = z.object({
  body: z
    .string()
    .trim()
    .min(5, "Write a reply first")
    .max(5000, "Reply is too long"),
});

/** GET /api/contact/messages/:id/reply — the reply history for one lead. */
export const GET = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const lead = await findLead(Number(id));
  if (!lead) return notFound("Message not found");

  return NextResponse.json({ replies: await listReplies(lead.id) });
});

/** POST /api/contact/messages/:id/reply — email the enquirer. */
export const POST = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const lead = await findLead(Number(id));
  if (!lead) return notFound("Message not found");

  const { body } = replySchema.parse(await request.json());

  const result = await sendReply({
    to: lead.email,
    name: lead.name,
    service: lead.service,
    body,
  });

  // Recorded either way: a failed send must not lose what you wrote.
  await saveReply(lead.id, body, result.sent, result.reason);

  return NextResponse.json({
    success: result.sent,
    sent: result.sent,
    message: result.sent
      ? `Reply sent to ${lead.email}`
      : `Saved, but the email did not send: ${result.reason}`,
    replies: await listReplies(lead.id),
    lead: await findLead(lead.id),
  });
});
