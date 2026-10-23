import { handleClinicPageSpeedRequest } from "../../_tools/clinic-audit-core.mjs";

export async function onRequest(context) {
  return handleClinicPageSpeedRequest(context.request, {
    pageSpeedApiKey: context.env && context.env.GOOGLE_PAGESPEED_API_KEY
  });
}
