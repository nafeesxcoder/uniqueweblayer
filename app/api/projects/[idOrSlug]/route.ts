import { NextResponse } from "next/server";
import {
  findProject,
  updateProject,
  deleteProject,
  forPublic,
} from "../../../lib/server/projects";
import { updateProjectSchema, formToObject } from "../../../lib/server/validation";
import { saveProjectImage } from "../../../lib/server/uploads";
import { readAdmin } from "../../../lib/server/auth";
import { handler, notFound, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ idOrSlug: string }> };

/** GET /api/projects/:idOrSlug */
export const GET = handler(async (request: Request, { params }: Ctx) => {
  const { idOrSlug } = await params;
  const project = await findProject(idOrSlug);
  if (!project) return notFound("Project not found");

  const isAdmin = readAdmin(request) !== null;
  return NextResponse.json({ project: isAdmin ? project : forPublic(project) });
});

/** PATCH /api/projects/:id  (admin) */
export const PATCH = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { idOrSlug } = await params;
  const existing = await findProject(idOrSlug);
  if (!existing) return notFound("Project not found");

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

  const data = updateProjectSchema.parse(raw);
  // No new file means keep the current screenshot rather than clearing it.
  if (imagePath) data.image = imagePath;
  else delete (data as Record<string, unknown>).image;

  const project = await updateProject(existing.id, data);
  return NextResponse.json({ project });
});

/** DELETE /api/projects/:id  (admin) */
export const DELETE = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { idOrSlug } = await params;
  const existing = await findProject(idOrSlug);
  if (!existing) return notFound("Project not found");

  await deleteProject(existing.id);
  return NextResponse.json({ success: true });
});
