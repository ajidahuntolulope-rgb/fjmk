// Offline regression checks: no requests or emails leave this process.
import assert from "node:assert/strict";
import fs from "node:fs";
import { handleClinicAuditRequest } from "./clinic-audit-core.mjs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const originalFetch = globalThis.fetch;
let providerCalls = 0;
let providerResult;
globalThis.fetch = async (input, options) => {
  const url = new URL(input);
  if (url.hostname === "cloudflare-dns.com") {
    return Response.json({ Answer: [{ type: 1, data: "93.184.216.34" }] });
  }
  if (url.hostname === "clinic.example.org") return new Response(html, { headers: { "Content-Type": "text/html" } });
  assert.equal(url.hostname, "formsubmit.co", "Unexpected outbound request");
  assert.equal(options.headers.Origin, "https://fjmk.drtolu.com");
  assert.equal(options.headers.Referer, "https://fjmk.drtolu.com/tools");
  providerCalls++;
  const lead = JSON.parse(options.body);
  assert.equal(lead.email, "test@example.com");
  assert.equal(lead.website, "https://clinic.example.org/");
  assert.match(lead.score, /^\d+\/100$/);
  if (providerResult instanceof Error) throw providerResult;
  return new Response(providerResult, { headers: { "Content-Type": "text/html" } });
};
const request = mode => new Request("https://fjmk.drtolu.com/api/audit", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: "https://fjmk.drtolu.com" },
  body: JSON.stringify({ mode, url: "https://clinic.example.org/", email: "test@example.com" })
});
try {
  const preview = await handleClinicAuditRequest(request("preview"));
  assert.equal(preview.status, 200);
  assert.equal(providerCalls, 0);
  assert.equal((await preview.json()).checks, undefined);
  for (const result of [
    JSON.stringify({ success: "false", message: "This form needs Activation." }),
    JSON.stringify({ success: false, message: "Rejected" }),
    "<!DOCTYPE html><html>Bad gateway</html>",
    new Error("Connection failed")
  ]) {
    providerResult = result;
    const response = await handleClinicAuditRequest(request("report"));
    assert.equal(response.status, 424);
    assert.match(response.headers.get("Content-Type"), /application\/json/);
    const body = await response.json();
    assert.equal(body.checks, undefined, "Failed leads must not unlock the report");
    assert.equal(typeof body.error, "string");
    if (typeof result === "string" && result.includes("Activation")) assert.match(body.error, /contact FJMK/);
  }
  for (const success of [true, "true"]) {
    providerResult = JSON.stringify({ success });
    const response = await handleClinicAuditRequest(request("report"));
    assert.equal(response.status, 200);
    assert.ok((await response.json()).checks.length);
  }
  assert.equal(providerCalls, 6);
  const saved = [];
  const leadStore = { put: async (key, value, options) => saved.push({ key, value: JSON.parse(value), options }) };
  const storedResponse = await handleClinicAuditRequest(request("report"), { leadStore, requireLeadStore: true });
  assert.equal(storedResponse.status, 200);
  const storedReport = await storedResponse.json();
  assert.equal(storedReport.leadNotification, "browser");
  assert.ok(storedReport.checks.length);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].value.email, "test@example.com");
  assert.equal(saved[0].value.checks, undefined);
  assert.equal(saved[0].options.expirationTtl, 2592000);
  assert.equal(providerCalls, 6, "Production capture must not depend on a server-side email request");
  const failedStore = { put: async () => { throw new Error("Storage unavailable"); } };
  const failedResponse = await handleClinicAuditRequest(request("report"), { leadStore: failedStore, requireLeadStore: true });
  assert.equal(failedResponse.status, 424);
  assert.equal((await failedResponse.json()).checks, undefined);
  const missingStore = await handleClinicAuditRequest(request("report"), { requireLeadStore: true });
  assert.equal(missingStore.status, 424);
  assert.equal((await missingStore.json()).checks, undefined);
  const storedPreview = await handleClinicAuditRequest(request("preview"), { leadStore, requireLeadStore: true });
  assert.equal(storedPreview.status, 200);
  assert.equal(saved.length, 1, "Previews must not create a lead");
  console.log("Audit lead checks passed: preview, inactive form, rejection, HTML, connection failure and successful unlock.");
} finally {
  globalThis.fetch = originalFetch;
}
