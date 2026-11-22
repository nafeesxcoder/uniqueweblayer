import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createProduct,
  listProducts,
  type ProductInput,
} from "../../lib/server/products";
import { readAdmin } from "../../lib/server/auth";
import { productSchema } from "../../lib/server/validation";
import { handler, unauthorized } from "../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/products — published for anyone; `?all=1` adds hidden ones for an admin. */
export const GET = handler(async (request: Request) => {
  const all = new URL(request.url).searchParams.get("all") === "1";
  const products = await listProducts(all && Boolean(readAdmin(request)));
  return NextResponse.json({ products });
});

/** POST /api/products  (admin) */
export const POST = handler(async (request: Request) => {
  if (!readAdmin(request)) return unauthorized();

  const data = productSchema.parse(await request.json()) as ProductInput;
  const product = await createProduct(data);

  revalidatePath("/collaborations");
  return NextResponse.json({ product }, { status: 201 });
});
