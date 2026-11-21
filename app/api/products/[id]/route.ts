import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  deleteProduct,
  findProductById,
  updateProduct,
  type ProductInput,
} from "../../../lib/server/products";
import { readAdmin } from "../../../lib/server/auth";
import { updateProductSchema } from "../../../lib/server/validation";
import { handler, notFound, unauthorized } from "../../../lib/server/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/products/:id  (admin) */
export const PATCH = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const existing = await findProductById(Number(id));
  if (!existing) return notFound("Product not found");

  const data = updateProductSchema.parse(await request.json()) as Partial<ProductInput>;
  const product = await updateProduct(existing.id, data);

  revalidatePath("/products");
  revalidatePath(`/products/${existing.slug}`);
  return NextResponse.json({ product });
});

/** DELETE /api/products/:id  (admin) */
export const DELETE = handler(async (request: Request, { params }: Ctx) => {
  if (!readAdmin(request)) return unauthorized();

  const { id } = await params;
  const existing = await findProductById(Number(id));
  if (!existing) return notFound("Product not found");

  await deleteProduct(existing.id);

  revalidatePath("/products");
  revalidatePath(`/products/${existing.slug}`);
  return NextResponse.json({ success: true });
});
