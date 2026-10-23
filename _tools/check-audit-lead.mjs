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
  console.log("Audit lead checks passed: preview, inactive form, rejection, HTML, connection failure and successful unlock.");
} finally {
  globalThis.fetch = originalFetch;
}
