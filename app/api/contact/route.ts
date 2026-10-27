import { NextResponse } from "next/server";
import { contactSchema } from "../../lib/server/validation";
import { saveLead, markEmailSent } from "../../lib/server/contact";
import { sendLeadNotification, sendAutoReply } from "../../lib/server/mailer";
import { ApiError, handler } from "../../lib/server/respond";
import { rateLimit, clientIp } from "../../lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/contact */
export const POST = handler(async (request: Request) => {
  rateLimit(request, {
    bucket: "contact",
    max: 5,
    windowMs: 10 * 60 * 1000,
    message: "Too many submissions — please try again shortly",
  });

  const data = contactSchema.parse(await request.json());

  // Honeypot — a bot fills the hidden field, a person never sees it.
  if (data.website) return NextResponse.json({ success: true });

  const ip = clientIp(request);

  // Save first: a mail outage must never lose a lead.
  const id = await saveLead({
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    service: data.service,
    budget: data.budget,
    message: data.message,
    landingPage: data.landingPage,
    referrer: data.referrer,
    ip,
    userAgent: request.headers.get("user-agent"),
  });

  const lead = {
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    service: data.service,
    budget: data.budget,
    message: data.message,
  };

  const notification = await sendLeadNotification(lead);
  if (notification.sent) {
    await markEmailSent(id);
    // Fire and forget — a failed auto-reply must not fail the request.
    void sendAutoReply(lead);
  }

  return NextResponse.json({
    success: true,
    message: notification.sent
      ? "Thanks — we have your enquiry and will reply within one working day."
      : "Thanks — we have your enquiry. If you do not hear back today, email info@uniqueweblayer.com.",
  });
});
