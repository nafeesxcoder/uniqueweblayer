import { NextResponse } from "next/server";
import { issueToken, isAdminConfigured } from "../../../lib/server/auth";
import {
  getOrSeedAdminAccount,
  verifyPassword,
  markLogin,
} from "../../../lib/server/adminAccount";
import { loginSchema } from "../../../lib/server/validation";
import { ApiError, handler } from "../../../lib/server/respond";
import { rateLimit } from "../../../lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 *
 * The password is checked against the hash in admin_account. On the very first
 * sign-in that row does not exist yet, so it is seeded from ADMIN_PASSWORD —
 * which means an existing install keeps working with the password it already
 * had, and from then on the one you set in settings is the one that counts.
 */
export const POST = handler(async (request: Request) => {
  rateLimit(request, {
    bucket: "login",
    max: 10,
    windowMs: 15 * 60 * 1000,
    message: "Too many sign-in attempts — try again in 15 minutes",
  });

  const { email, password } = loginSchema.parse(await request.json());

  if (!isAdminConfigured()) {
    throw new ApiError(503, "Admin login is not configured on the server");
  }

  const account = await getOrSeedAdminAccount();
  if (!account) {
    throw new ApiError(503, "Admin login is not configured on the server");
  }

  const emailOk = email.toLowerCase() === account.email.toLowerCase();
  // Verify the password either way: returning early on a wrong email would
  // make it measurably faster, which is how a guess finds the right address.
  const passwordOk = verifyPassword(password, account.password_hash);

  if (!emailOk || !passwordOk) {
    throw new ApiError(401, "Wrong email or password");
  }

  await markLogin();

  return NextResponse.json({
    token: issueToken(account.email),
    admin: { email: account.email },
  });
});
