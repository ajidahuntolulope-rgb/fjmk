import { handleClinicAuditRequest } from "../../_tools/clinic-audit-core.mjs";

function rateLimitError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

export async function onRequest(context) {
  const request = context.request;
  const limiter = context.env && context.env.AUDIT_RATE_LIMITER;
  if (request.method === "POST") {
    if (!limiter) {
      return rateLimitError(503, "The website check is not available yet. Please try again later.");
    }
    const key = request.headers.get("CF-Connecting-IP") || "unknown-client";
    let result;
    try {
      result = await limiter.limit({ key });
    } catch {
      return rateLimitError(503, "The website check is temporarily unavailable. Please try again later.");
    }
    if (!result.success) {
      return rateLimitError(429, "This check has been run recently. Please wait a minute and try again.");
    }
  }
  return handleClinicAuditRequest(request, {
    pageSpeedApiKey: context.env && context.env.GOOGLE_PAGESPEED_API_KEY
  });
}
