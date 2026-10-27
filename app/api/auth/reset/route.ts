import { NextResponse } from "next/server";
import { consumeResetToken } from "../../../lib/server/adminAccount";
import { resetPasswordSchema } from "../../../lib/server/validation";
import { ApiError, handler } from "../../../lib/server/respond";
import { rateLimit } from "../../../lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/reset
 *
 * Sets a new password from an emailed token. Wrong, used and expired tokens
 * all give the same answer, so guessing learns nothing from the reply.
 */
export const POST = handler(async (request: Request) => {
  rateLimit(request, {
    bucket: "reset",
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: "Too many attempts — try again in an hour",
  });

  const { token, newPassword } = resetPasswordSchema.parse(await request.json());

  const done = await consumeResetToken(token, newPassword);
  if (!done) {
    throw new ApiError(
      400,
      "That reset link has expired or has already been used. Ask for a new one.",
    );
  }

  return NextResponse.json({
    success: true,
    message: "Password changed. Sign in with the new one.",
  });
});
