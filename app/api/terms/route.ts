import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getTerms, saveTerms } from "../../lib/server/terms";
import type { TermsContent } from "../../data/projectTerms";
import { readAdmin } from "../../lib/server/auth";
import { termsSchema } from "../../lib/server/validation";
import { handler, unauthorized } from "../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/terms — the published project terms. */
export const GET = handler(async () => {
  return NextResponse.json({ terms: await getTerms() });
});

/** PUT /api/terms  (admin) — replaces the whole document. */
export const PUT = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const data = termsSchema.parse(await request.json());
  // The schema has already checked every field; zod's optional output types
  // are looser than the stored shape, so the cast is safe here.
  const terms = await saveTerms({
    ...data,
    sections: data.sections.map((s) => ({ title: s.title ?? "", points: (s.points ?? []).filter(Boolean) })),
  } as TermsContent);

  revalidatePath("/project-terms");
  revalidatePath("/project-terms/pdf");
  revalidatePath("/process");
  return NextResponse.json({ terms });
});
