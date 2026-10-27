import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { env } from "./env";

/**
 * Shared response shapes, so every route reports failures the same way the
 * Express error handler used to. The client reads `error` and `fields`.
 */

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

export const ok = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json(data, init);

export const unauthorized = (message = "Sign in to continue") =>
  NextResponse.json({ error: message }, { status: 401 });

export const notFound = (message = "Not found") =>
  NextResponse.json({ error: message }, { status: 404 });

/**
 * Converts anything thrown inside a route into the right JSON response.
 * Keeps 5xx details out of the browser in production while still logging them.
 */
export function fail(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields",
        fields: Object.fromEntries(
          error.issues.map((i) => [i.path.join(".") || "form", i.message]),
        ),
      },
      { status: 422 },
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, ...(error.fields ? { fields: error.fields } : {}) },
      { status: error.status },
    );
  }

  const code = (error as { code?: string })?.code;

  if (code === "ER_DUP_ENTRY") {
    return NextResponse.json(
      { error: "That record already exists" },
      { status: 409 },
    );
  }

  if (code === "ECONNREFUSED" || code === "ER_ACCESS_DENIED_ERROR") {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database is unavailable" },
      { status: 503 },
    );
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json(
    {
      error: "Something went wrong on our side",
      ...(env.isProd ? {} : { detail: (error as Error)?.message }),
    },
    { status: 500 },
  );
}

/** Wraps a route handler so a throw becomes a response instead of a 500 page. */
export function handler<A extends unknown[]>(
  fn: (...args: A) => Promise<NextResponse>,
) {
  return async (...args: A): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
      return fail(error);
    }
  };
}
