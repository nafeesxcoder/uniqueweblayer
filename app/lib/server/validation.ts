import "server-only";
import { z } from "zod";
import { SERVICE_TYPES } from "../serviceTypes";

/**
 * `trimmed` — trim then cap length.
 *
 * The trim runs INSIDE `.transform()` rather than as `.trim()` on the ZodString
 * itself. `.string().trim().max(n)` widens the inferred output type to
 * `string | undefined`, which then makes every consumer of the parsed result
 * think the field might be missing even when the schema marks it required.
 * Doing the trim in a transform keeps the output type `string` — matching what
 * the runtime actually returns — so route handlers no longer need to coerce.
 */
const trimmed = (max: number) =>
  z
    .string()
    .max(max, `Must be ${max} characters or fewer`)
    .transform((v) => v.trim());

/** Accepts a real array, or the comma-separated / JSON string a form sends. */
const tagsField = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((value) => {
    if (!value) return [] as string[];
    if (Array.isArray(value))
      return value.map((t) => String(t).trim()).filter(Boolean);

    const raw = value.trim();
    if (raw.startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
          ? parsed.map(String).map((t) => t.trim()).filter(Boolean)
          : [];
      } catch {
        /* fall through to comma splitting */
      }
    }
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  })
  .pipe(z.array(z.string().max(40)).max(12, "12 tags maximum"));

/** Checkboxes arrive as "true" / "on" / "1" from multipart forms. */
const boolField = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((v) => {
    if (typeof v === "boolean") return v;
    if (v === undefined || v === "") return undefined;
    return ["1", "true", "yes", "on"].includes(String(v).toLowerCase());
  });

/**
 * An empty string is kept rather than turned into undefined, so an edit that
 * clears the live link actually clears it. Dropping it to undefined meant the
 * field was skipped on PATCH and the old link stayed forever.
 */
const optionalUrl = z
  .string()
  .max(500)
  .transform((v) => v.trim())
  .optional()
  .refine(
    (v) =>
      v === undefined ||
      v === "" ||
      v === "#" ||
      /^https?:\/\//i.test(v) ||
      v.startsWith("/"),
    "Enter a full link starting with https://",
  );

export const createProjectSchema = z.object({
  title: trimmed(180).pipe(z.string().min(2, "Project title is required")),
  category: trimmed(120).pipe(
    z.string().min(2, "Category is required (e.g. Real Estate)"),
  ),
  type: z.enum(SERVICE_TYPES, {
    errorMap: () => ({ message: "Pick one of the service lines" }),
  }),
  description: trimmed(2000).pipe(
    z.string().min(20, "Write at least 20 characters"),
  ),
  image: z
    .string()
    .max(500)
    .transform((v) => v.trim())
    .optional()
    .default(""),
  liveLink: optionalUrl,
  // NOTE: .transform() must come AFTER .regex(), because ZodEffects (the type
  // returned by .transform) does not expose .regex(). Trimming inside the
  // refinement keeps " #8b5cf6 " (with spaces) valid, and the final transform
  // normalises the stored value.
  color: z
    .string()
    .max(20)
    .refine(
      (v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim()),
      "Use a hex colour like #8b5cf6",
    )
    .transform((v) => v.trim())
    .optional()
    .default("#8b5cf6"),
  tags: tagsField,
  client: trimmed(180).optional(),
  country: trimmed(120).optional(),
  result: trimmed(255).optional(),
  featured: boolField,
  isPublished: boolField,
  sortOrder: z.coerce.number().int().min(0).max(100000).optional().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(200),
});

/**
 * A new password. Length does more for safety here than a rule demanding a
 * symbol, which mostly produces "Password1!" — so the floor is 10 characters
 * and the only other check is that it is not one of the obvious ones.
 */
const WEAK = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "1234567890",
  "qwertyuiop",
  "adminadmin",
  "admin12345",
  "letmein123",
  "uniqueweblayer",
]);

export const newPasswordField = z
  .string()
  .min(10, "Use at least 10 characters")
  .max(200, "That is too long")
  .refine((value) => !WEAK.has(value.toLowerCase()), {
    message: "That password is too easy to guess — pick another",
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password").max(200),
  newPassword: newPasswordField,
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(32, "That reset link is not valid").max(128),
  newPassword: newPasswordField,
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
});

/* ------------------------------ testimonials ----------------------------- */

const optionalId = z
  .union([z.number(), z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
  });

const optionalRating = z
  .union([z.number(), z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
  });

export const createTestimonialSchema = z.object({
  author: trimmed(120).pipe(z.string().min(2, "Whose words are these?")),
  role: trimmed(160).optional().default(""),
  company: trimmed(160).optional().default(""),
  quote: trimmed(2000).pipe(z.string().min(10, "The quote looks too short")),
  rating: optionalRating,
  projectId: optionalId,
  isPublished: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export const contactSchema = z.object({
  name: trimmed(180).pipe(z.string().min(2, "Please enter your name")),
  email: z.string().trim().email("Enter a valid email address").max(255),
  mobile: trimmed(40).pipe(z.string().min(6, "Enter a reachable phone number")),
  service: trimmed(180).pipe(z.string().min(2, "Please select a service")),
  budget: trimmed(80).optional().default(""),
  message: trimmed(5000).pipe(
    z.string().min(10, "Tell us a little more — at least 10 characters"),
  ),
  // Hidden field a human never fills in; bots usually do.
  website: z.string().optional().default(""),
  // Where the visit started. Sent by the form, never typed by anyone.
  landingPage: trimmed(255).optional().default(""),
  referrer: trimmed(400).optional().default(""),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

/** FormData → plain object, so one schema handles JSON and multipart alike. */
export function formToObject(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

/* ----------------------------- service pricing ---------------------------- */

export const servicePricingSchema = z.object({
  price: trimmed(40).pipe(
    z.string().min(1, "Enter a price, or write “On request”"),
  ),
  delivery: trimmed(80).pipe(z.string().min(1, "Enter a delivery time")),
});