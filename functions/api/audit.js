import { handleClinicAuditRequest } from "../../_tools/clinic-audit-core.mjs";

export async function onRequest(context) {
  return handleClinicAuditRequest(context.request, {
    pageSpeedApiKey: context.env && context.env.GOOGLE_PAGESPEED_API_KEY
  });
}
