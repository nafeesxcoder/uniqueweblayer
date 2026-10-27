import { NextResponse } from "next/server";
import {
  getOrSeedAdminAccount,
  createResetToken,
  lastResetRequestAge,
} from "../../../lib/server/adminAccount";
import { sendPasswordReset } from "../../../lib/server/mailer";
import { forgotPasswordSchema } from "../../../lib/server/validation";
import { handler } from "../../../lib/server/respond";
import { rateLimit } from "../../../lib/server/rateLimit";
import { SITE_URL } from "../../../data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESET_TTL_MINUTES = 30;
/** One reset email per two minutes, however many times the form is submitted. */
const COOLDOWN_MS = 2 * 60 * 1000;

/**
 * POST /api/auth/forgot
 *
 * Always answers the same way, whatever address was typed. Saying "no such
 * admin" would confirm the real address to anyone probing the form, and the
 * email itself only ever goes to the address on the account.
 */
export const POST = handler(async (request: Request) => {
  rateLimit(request, {
    bucket: "forgot",
    max: 5,
    windowMs: 60 * 60 * 1000,
    message: "Too many reset requests — try again in an hour",
  });

  const { email } = forgotPasswordSchema.parse(await request.json());

  const same = {
    success: true,
    message:
      "If that address belongs to the admin account, a reset link is on its way. " +
      "It expires in 30 minutes.",
  };

  const account = await getOrSeedAdminAccount();
  if (!account) return NextResponse.json(same);
  if (email.toLowerCase() !== account.email.toLowerCase()) {
    return NextResponse.json(same);
  }

  // A correct address should not mean an unlimited supply of emails.
  const age = await lastResetRequestAge();
  if (age !== null && age < COOLDOWN_MS) return NextResponse.json(same);

  const token = await createResetToken();
  const base = process.env.PUBLIC_SITE_URL || SITE_URL;
  const link = `${base.replace(/\/$/, "")}/admin/reset?token=${token}`;

  const result = await sendPasswordReset({
    to: account.email,
    link,
    expiresInMinutes: RESET_TTL_MINUTES,
  });

  // The failure is logged in the mailer. The answer stays the same either way,
  // because an error here would otherwise reveal that the address was right.
  if (!result.sent) {
    console.error("Reset link could not be emailed:", result.reason);
  }

  return NextResponse.json(same);
});
