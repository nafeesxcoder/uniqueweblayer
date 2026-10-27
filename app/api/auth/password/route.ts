import { NextResponse } from "next/server";
import { readAdmin } from "../../../lib/server/auth";
import {
  getOrSeedAdminAccount,
  verifyPassword,
  setPassword,
} from "../../../lib/server/adminAccount";
import { changePasswordSchema } from "../../../lib/server/validation";
import { ApiError, handler, unauthorized } from "../../../lib/server/respond";
import { rateLimit } from "../../../lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/password  (admin)
 *
 * Changing the password asks for the current one as well, even though you are
 * already signed in. A session left open on a shared screen should not be
 * enough to lock you out of your own admin area.
 */
export const POST = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  rateLimit(request, {
    bucket: "password-change",
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: "Too many attempts — try again in an hour",
  });

  const { currentPassword, newPassword } = changePasswordSchema.parse(
    await request.json(),
  );

  const account = await getOrSeedAdminAccount();
  if (!account) throw new ApiError(503, "Admin login is not configured");

  if (!verifyPassword(currentPassword, account.password_hash)) {
    throw new ApiError(401, "That is not your current password", {
      currentPassword: "Wrong password",
    });
  }

  if (verifyPassword(newPassword, account.password_hash)) {
    throw new ApiError(422, "That is already your password", {
      newPassword: "Pick a different password",
    });
  }

  await setPassword(newPassword);

  return NextResponse.json({
    success: true,
    message:
      "Password changed. It is stored in the database now, so ADMIN_PASSWORD " +
      "in .env.local no longer has any effect.",
  });
});
