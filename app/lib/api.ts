"use client";

import type { ServiceTypeSlug } from "./serviceTypes";

/**
 * Browser-side client for this app's own /api routes.
 *
 * Paths are relative, because the API now lives inside this Next app rather
 * than on a separate Express origin. That removes NEXT_PUBLIC_API_URL entirely
 * — which was the single most common deployment mistake here, since it is
 * baked in at build time and a wrong value silently emptied the portfolio page.
 * Same origin also means no CORS configuration to keep in step.
 *
 * Server components do NOT use this file. They import app/lib/server/projects
 * and query MySQL directly, so a page render never makes an HTTP call to itself.
 */

export type { ServiceTypeSlug };

export interface ApiProject {
  id: number;
  title: string;
  slug: string;
  category: string;
  type: ServiceTypeSlug;
  description: string;
  image: string;
  liveLink: string;
  color: string;
  tags: string[];
  client?: string;
  /** Only present for a signed-in admin — stripped from public responses. */
  country?: string;
  result?: string;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilter {
  label: string;
  value: "all" | ServiceTypeSlug;
  count: number;
}

/** Thrown for any non-2xx response, carrying per-field errors when present. */
export class ApiRequestError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fields = fields;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  cache?: RequestCache;
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token, cache }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  // Let the browser set the multipart boundary itself.
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers,
      body: body
        ? isFormData
          ? (body as FormData)
          : JSON.stringify(body)
        : undefined,
      ...(cache ? { cache } : {}),
    });
  } catch {
    throw new ApiRequestError(0, "Cannot reach the server. Please try again.");
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const data = (payload || {}) as {
      error?: string;
      fields?: Record<string, string>;
    };
    throw new ApiRequestError(
      response.status,
      data.error || `Request failed (${response.status})`,
      data.fields,
    );
  }

  return payload as T;
}

/* --------------------------- public endpoints --------------------------- */

export async function fetchProjects(
  params: { type?: string; featured?: boolean } = {},
) {
  const search = new URLSearchParams();
  if (params.type && params.type !== "all") search.set("type", params.type);
  if (params.featured) search.set("featured", "1");
  const qs = search.toString();

  const data = await apiRequest<{ projects: ApiProject[] }>(
    `/api/projects${qs ? `?${qs}` : ""}`,
  );
  return data.projects;
}

export async function fetchProjectFilters() {
  const data = await apiRequest<{ filters: ProjectFilter[] }>(
    "/api/projects/filters",
  );
  return data.filters;
}

/* ---------------------------- admin endpoints --------------------------- */

export async function adminLogin(email: string, password: string) {
  return apiRequest<{ token: string; admin: { email: string } }>(
    "/api/auth/login",
    { method: "POST", body: { email, password } },
  );
}

export async function verifyAdminToken(token: string) {
  return apiRequest<{ admin: { email: string } }>("/api/auth/me", { token });
}

export async function createProject(form: FormData, token: string) {
  const data = await apiRequest<{ project: ApiProject }>("/api/projects", {
    method: "POST",
    body: form,
    token,
  });
  return data.project;
}

/**
 * Partial update. Only the fields present in `form` change, so editing the
 * description never clears the screenshot.
 */
export async function updateProject(id: number, form: FormData, token: string) {
  const data = await apiRequest<{ project: ApiProject }>(`/api/projects/${id}`, {
    method: "PATCH",
    body: form,
    token,
  });
  return data.project;
}

export async function deleteProject(id: number, token: string) {
  return apiRequest<{ success: boolean }>(`/api/projects/${id}`, {
    method: "DELETE",
    token,
  });
}

/* ------------------------------ admin inbox ----------------------------- */

export type LeadStatus = "new" | "read" | "replied" | "archived";

export interface ContactLead {
  id: number;
  name: string;
  email: string;
  mobile: string;
  service: string;
  budget: string | null;
  message: string;
  status: LeadStatus;
  /** 0 when the notification email could not be sent — chase these. */
  email_sent: 0 | 1;
  /** Set when the lead was discarded. The row survives until purged. */
  deleted_at: string | null;
  replied_at: string | null;
  reply_count: number;
  /** First page of the visit that produced this enquiry. */
  landing_page: string | null;
  referrer: string | null;
  /** Short label worked out from the referrer: google, facebook, direct… */
  source: string | null;
  created_at: string;
}

export interface LeadReply {
  id: number;
  message_id: number;
  body: string;
  email_sent: 0 | 1;
  error: string | null;
  created_at: string;
}

export interface LeadCounts {
  total: number;
  unread: number;
  undelivered: number;
  deleted: number;
}

export async function fetchLeads(token: string, limit = 100, deleted = false) {
  return apiRequest<{ messages: ContactLead[]; counts: LeadCounts }>(
    `/api/contact/messages?limit=${limit}${deleted ? "&deleted=1" : ""}`,
    { token, cache: "no-store" },
  );
}

export async function setLeadStatus(
  id: number,
  status: LeadStatus,
  token: string,
) {
  return apiRequest<{ success: boolean; status: LeadStatus }>(
    `/api/contact/messages/${id}`,
    { method: "PATCH", body: { status }, token },
  );
}

export async function fetchReplies(id: number, token: string) {
  const data = await apiRequest<{ replies: LeadReply[] }>(
    `/api/contact/messages/${id}/reply`,
    { token, cache: "no-store" },
  );
  return data.replies;
}

export async function sendLeadReply(id: number, body: string, token: string) {
  return apiRequest<{
    success: boolean;
    sent: boolean;
    message: string;
    replies: LeadReply[];
    lead: ContactLead;
  }>(`/api/contact/messages/${id}/reply`, {
    method: "POST",
    body: { body },
    token,
  });
}

/** Flags the lead as discarded; the row stays and can be restored. */
export async function deleteLead(id: number, token: string) {
  return apiRequest<{ success: boolean; deleted: string; message: string }>(
    `/api/contact/messages/${id}`,
    { method: "DELETE", token },
  );
}

export async function restoreLead(id: number, token: string) {
  return apiRequest<{ success: boolean; lead: ContactLead }>(
    `/api/contact/messages/${id}`,
    { method: "PATCH", body: { restore: true }, token },
  );
}

/** Removes the row for good. Only allowed on an already-discarded lead. */
export async function purgeLead(id: number, token: string) {
  return apiRequest<{ success: boolean; deleted: string; message: string }>(
    `/api/contact/messages/${id}?permanent=1`,
    { method: "DELETE", token },
  );
}

/* ------------------------------- documents ------------------------------- */

export interface ApiDocument {
  id: number;
  title: string;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size_bytes: number;
  note: string | null;
  created_at: string;
}

export async function fetchDocuments(token: string) {
  const data = await apiRequest<{ documents: ApiDocument[] }>(
    "/api/documents",
    { token, cache: "no-store" },
  );
  return data.documents;
}

export async function uploadDocument(form: FormData, token: string) {
  const data = await apiRequest<{ document: ApiDocument }>("/api/documents", {
    method: "POST",
    body: form,
    token,
  });
  return data.document;
}

export async function deleteDocument(id: number, token: string) {
  return apiRequest<{ success: boolean }>(`/api/documents/${id}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Fetches the bytes of one document.
 *
 * A plain link cannot do this: the file is behind the admin session, and a
 * browser will not attach an Authorization header to an <a href> or an
 * <iframe src>. So the bytes come back here and are handed to the browser as
 * a blob — which both the download and the preview are built on.
 *
 * The caller owns the returned URL and must revoke it when finished.
 */
export async function fetchDocumentBlob(doc: ApiDocument, token: string) {
  const response = await fetch(`/api/documents/${doc.id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiRequestError(
      response.status,
      (payload as { error?: string })?.error || "Could not open that file",
    );
  }

  return response.blob();
}

export async function downloadDocument(doc: ApiDocument, token: string) {
  const blob = await fetchDocumentBlob(doc, token);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = doc.original_name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Freed on the next tick — revoking immediately cancels the download in Safari.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* -------------------------------- pricing -------------------------------- */

export interface ServicePrice {
  slug: string;
  name: string;
  category: string;
  price: string;
  delivery: string;
  /** True when this one was changed in the admin panel. */
  isCustom: boolean;
}

export async function fetchPricing() {
  const data = await apiRequest<{ pricing: ServicePrice[] }>("/api/pricing", {
    cache: "no-store",
  });
  return data.pricing;
}

export async function setServicePrice(
  slug: string,
  input: { price: string; delivery: string },
  token: string,
) {
  return apiRequest<{ slug: string; pricing: ServicePrice }>(
    `/api/pricing/${slug}`,
    { method: "PATCH", body: input, token },
  );
}

/** Drops the override so the price written in the code applies again. */
export async function resetServicePrice(slug: string, token: string) {
  return apiRequest<{ slug: string; pricing: ServicePrice }>(
    `/api/pricing/${slug}`,
    { method: "DELETE", token },
  );
}

/* ------------------------------ testimonials ----------------------------- */

export interface ApiTestimonial {
  id: number;
  author: string;
  role: string | null;
  company: string | null;
  quote: string;
  rating: number | null;
  project_id: number | null;
  is_published: 0 | 1;
  sort_order: number;
  created_at: string;
  updated_at: string;
  /** Joined from the linked project, when there is one. */
  project_title: string | null;
  project_slug: string | null;
  project_image: string | null;
  project_color: string | null;
  project_live_link: string | null;
}

export interface TestimonialInput {
  author: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number | null;
  projectId?: number | null;
  isPublished?: boolean;
  sortOrder?: number;
}

/** Pass a token with `all` to include unpublished drafts. */
export async function fetchTestimonials(token?: string | null, all = false) {
  const data = await apiRequest<{ testimonials: ApiTestimonial[] }>(
    `/api/testimonials${all ? "?all=1" : ""}`,
    { token, cache: "no-store" },
  );
  return data.testimonials;
}

export async function createTestimonial(input: TestimonialInput, token: string) {
  const data = await apiRequest<{ testimonial: ApiTestimonial }>(
    "/api/testimonials",
    { method: "POST", body: input, token },
  );
  return data.testimonial;
}

export async function updateTestimonial(
  id: number,
  input: Partial<TestimonialInput>,
  token: string,
) {
  const data = await apiRequest<{ testimonial: ApiTestimonial }>(
    `/api/testimonials/${id}`,
    { method: "PATCH", body: input, token },
  );
  return data.testimonial;
}

export async function deleteTestimonial(id: number, token: string) {
  return apiRequest<{ success: boolean }>(`/api/testimonials/${id}`, {
    method: "DELETE",
    token,
  });
}

/* --------------------------- account & password -------------------------- */

export async function requestPasswordReset(email: string) {
  return apiRequest<{ success: boolean; message: string }>(
    "/api/auth/forgot",
    { method: "POST", body: { email } },
  );
}

export async function resetPassword(token: string, newPassword: string) {
  return apiRequest<{ success: boolean; message: string }>("/api/auth/reset", {
    method: "POST",
    body: { token, newPassword },
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  token: string,
) {
  return apiRequest<{ success: boolean; message: string }>(
    "/api/auth/password",
    { method: "POST", body: { currentPassword, newPassword }, token },
  );
}

/* --------------------------- nav badge counts ---------------------------- */

export interface AdminBadges {
  unread: number;
  drafts: number;
}

export async function fetchBadges(token: string) {
  return apiRequest<AdminBadges>("/api/admin/badges", {
    token,
    cache: "no-store",
  });
}

/* ------------------------------- dashboard ------------------------------- */

export interface AdminOverview {
  leads: LeadCounts & { thisWeek: number };
  projects: {
    total: number;
    published: number;
    featured: number;
    drafts: number;
  };
  recentLeads: ContactLead[];
  recentProjects: {
    id: number;
    title: string;
    slug: string;
    updated_at: string;
  }[];
  testimonials: { total: number; published: number };
  account: {
    email: string;
    passwordChangedAt: string | null;
    lastLoginAt: string | null;
  };
  smtp: { ok: boolean; reason: string | null };
}

export async function fetchOverview(token: string) {
  return apiRequest<AdminOverview>("/api/admin/overview", {
    token,
    cache: "no-store",
  });
}

/* -------------------------------- insights ------------------------------- */

export interface InsightRow {
  label: string;
  count: number;
}

export interface AdminInsights {
  days: number;
  totals: {
    total: number;
    replied: number;
    undelivered: number;
    perWeek: number;
  };
  weekly: { weekStart: string; count: number }[];
  byService: InsightRow[];
  bySource: InsightRow[];
  byLanding: InsightRow[];
  byBudget: InsightRow[];
}

export async function fetchInsights(token: string, days = 90) {
  return apiRequest<AdminInsights>(`/api/admin/insights?days=${days}`, {
    token,
    cache: "no-store",
  });
}

/* ----------------------------- contact form ----------------------------- */

export async function submitContactForm(payload: {
  name: string;
  email: string;
  mobile: string;
  service: string;
  budget?: string;
  message: string;
  website?: string;
  landingPage?: string;
  referrer?: string;
}) {
  return apiRequest<{ success: boolean; message: string }>("/api/contact", {
    method: "POST",
    body: payload,
  });
}
