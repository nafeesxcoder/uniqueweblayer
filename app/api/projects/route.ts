import { NextResponse } from "next/server";
import {
  listProjects,
  createProject,
  forPublic,
} from "../../lib/server/projects";
import { createProjectSchema, formToObject } from "../../lib/server/validation";
import { saveProjectImage } from "../../lib/server/uploads";
import { readAdmin } from "../../lib/server/auth";
import { handler, unauthorized } from "../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/projects?type=web-development&featured=1
 *
 * Auth is optional here: a signed-in admin also gets unpublished projects and
 * the `country` field, which the public site never shows.
 */
export const GET = handler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const isAdmin = readAdmin(request) !== null;

  const projects = await listProjects({
    type: searchParams.get("type") ?? undefined,
    featured: ["1", "true"].includes(searchParams.get("featured") ?? ""),
    includeUnpublished: isAdmin,
  });

  return NextResponse.json({
    projects: isAdmin ? projects : projects.map(forPublic),
  });
});

/**
 * POST /api/projects  (admin)
 * Accepts JSON, or multipart/form-data with an `image` file.
 */
export const POST = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const contentType = request.headers.get("content-type") || "";
  let raw: Record<string, unknown>;
  let imagePath: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    raw = formToObject(form);
    imagePath = await saveProjectImage(form.get("image"));
  } else {
    raw = await request.json();
  }

  const data = createProjectSchema.parse(raw);
  if (imagePath) data.image = imagePath;

  const project = await createProject(data);
  return NextResponse.json({ project }, { status: 201 });
});
