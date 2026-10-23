const MAX_BODY_BYTES = 4096;
const MAX_HTML_BYTES = 1200000;
const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 14000;
const PAGESPEED_TIMEOUT_MS = 60000;
const FORM_SUBMIT_ENDPOINT = "https://formsubmit.co/ajax/de23c2fcc84d70e0fdcf09a669c34494";

const HEALTH_IDENTITY_TERMS = /\b(?:health(?:care)?|medical|clinical|clinics?|hospitals?|doctors?|physicians?|nurses?|dental|dentists?|pharmacy|pharmacists?|pharma(?:ceutical)?|medicines?|diagnostics?|laborator(?:y|ies)|telehealth|telemedicine|physiotherap(?:y|ist|ists)|physical therapy|rehabilitation|mental health|paediatr(?:ic|ics)|pediatr(?:ic|ics)|health ?tech|medtech|biotech|biomedical|medical devices?|home ?care|care home|nursing home|hospice|optometr(?:y|ist|ists)|ophthalmolog(?:y|ist)|radiolog(?:y|ist)|fertility|midwif(?:e|ery)|veterinar(?:y|ian)|nutrition|wellness)\b/i;
const HEALTH_PAGE_TERMS = /\b(?:patients?|clinical|diagnos(?:is|tic|tics)|treatments?|prescriptions?|medicines?|doctors?|physicians?|nurses?|pharmac(?:y|ies)|hospitals?|clinics?|healthcare|health|medical|therap(?:y|ies)|therapists?|surger(?:y|ies)|laborator(?:y|ies)|screenings?|vaccinations?|rehabilitation|caregivers?)\b/gi;
const SCORE_WEIGHTS = { 1: 4, 2: 3, 3: 2, 4: 1 };
const SCORE_GRADES = [
  { min: 90, grade: "A", label: "Strong homepage signals" },
  { min: 80, grade: "B", label: "A solid foundation with a few fixes" },
  { min: 70, grade: "C", label: "Mixed signals; several improvements would help" },
  { min: 60, grade: "D", label: "Several issues need attention" },
  { min: 0, grade: "F", label: "Needs substantial improvement" }
];

class AuditError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow"
    }
  });
}

async function readRequestText(request) {
  const reader = request.body && request.body.getReader ? request.body.getReader() : null;
  if (!reader) return "";
  const chunks = [];
  let size = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new AuditError(413, "The request is too large. Enter one public website address.");
    }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function normalizePublicUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new AuditError(400, "Enter a public website address.");
  }
  let raw = value.trim();
  if (raw.length > 2048) {
    throw new AuditError(400, "That address is too long.");
  }
  if (!/^[a-z][a-z\d+.-]*:/i.test(raw)) raw = "https://" + raw;
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new AuditError(400, "Enter a valid public website address, such as clinicname.com.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new AuditError(400, "Only public HTTP and HTTPS websites can be checked.");
  }
  if (url.username || url.password) {
    throw new AuditError(400, "Sign-in details cannot be included in the address.");
  }
  if (url.port && !((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80"))) {
    throw new AuditError(400, "Only standard public website ports can be checked.");
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  const blockedSuffixes = [".localhost", ".local", ".localdomain", ".internal", ".test", ".invalid", ".example", ".onion", ".lan"];
  if (!host.includes(".") || blockedSuffixes.some(suffix => host.endsWith(suffix)) || /^\d+(?:\.\d+){0,3}$/.test(host) || host.includes(":")) {
    throw new AuditError(400, "Enter a public website domain, not a private network or IP address.");
  }
  url.hash = "";
  return url;
}

function publicIpv4(address) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b, c] = parts;
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && (b === 0 || b === 168)) return false;
  if (a === 192 && b === 88 && c === 99) return false;
  if (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) return false;
  if (a === 203 && b === 0 && c === 113) return false;
  if (a === 255 && b === 255 && c === 255) return false;
  return true;
}

function publicIpv6(address) {
  const value = address.toLowerCase();
  if (value.includes(".") || value === "::" || value === "::1") return false;
  const firstHextet = value.split(":").find(Boolean);
  const first = firstHextet ? parseInt(firstHextet, 16) : 0;
  if (first < 0x2000 || first > 0x3fff) return false;
  if (/^2001:(?:db8|0|2|10|20)(?::|$)/.test(value) || value.startsWith("2002:")) return false;
  return true;
}

function isPublicAddress(address, type) {
  return type === 1 ? publicIpv4(address) : type === 28 ? publicIpv6(address) : false;
}

async function assertPublicDns(host, signal) {
  const queries = ["A", "AAAA"].map(async type => {
    const endpoint = new URL("https://cloudflare-dns.com/dns-query");
    endpoint.searchParams.set("name", host);
    endpoint.searchParams.set("type", type);
    const response = await fetch(endpoint.href, {
      headers: { "Accept": "application/dns-json" },
      signal
    });
    if (!response.ok) throw new AuditError(502, "The website domain could not be checked safely.");
    return response.json();
  });
  let answers;
  try {
    answers = await Promise.all(queries);
  } catch (error) {
    if (error instanceof AuditError) throw error;
    throw new AuditError(502, "The website domain could not be checked safely.");
  }
  const records = answers.flatMap(result => result.Answer || []).filter(record => record.type === 1 || record.type === 28);
  if (!records.length) {
    throw new AuditError(502, "The website domain did not resolve to a public address.");
  }
  if (records.some(record => !isPublicAddress(record.data, record.type))) {
    throw new AuditError(400, "This website domain points to a private or reserved network address and cannot be checked.");
  }
}

async function fetchPublicPage(startUrl, signal) {
  let url = startUrl;
  const start = Date.now();
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    await assertPublicDns(url.hostname, signal);
    const response = await fetch(url.href, {
      method: "GET",
      redirect: "manual",
      signal,
      headers: {
        "Accept": "text/html,application/xhtml+xml;q=0.9",
        "Accept-Language": "en",
        "User-Agent": "FJMK-Clinic-Website-Check/1.0"
      }
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { response, url, responseMs: Date.now() - start };
      if (redirects === MAX_REDIRECTS) {
        await response.body?.cancel().catch(() => {});
        throw new AuditError(502, "The website redirected too many times to complete a safe check.");
      }
      let next;
      try {
        next = normalizePublicUrl(new URL(location, url).href);
      } catch {
        await response.body?.cancel().catch(() => {});
        throw new AuditError(400, "The website redirected to an address this checker cannot safely open.");
      }
      await response.body?.cancel().catch(() => {});
      url = next;
      continue;
    }
    return { response, url, responseMs: Date.now() - start };
  }
  throw new AuditError(502, "The website could not be reached.");
}

async function readHtml(response) {
  const reader = response.body && response.body.getReader ? response.body.getReader() : null;
  if (!reader) return { html: "", truncated: false };
  const chunks = [];
  let size = 0;
  let truncated = false;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    const remaining = MAX_HTML_BYTES - size;
    if (part.value.byteLength > remaining) {
      chunks.push(part.value.slice(0, Math.max(0, remaining)));
      size = MAX_HTML_BYTES;
      truncated = true;
      await reader.cancel();
      break;
    }
    chunks.push(part.value);
    size += part.value.byteLength;
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { html: new TextDecoder().decode(bytes), truncated };
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => {
      const point = Number(code);
      return point <= 0x10ffff ? String.fromCodePoint(point) : " ";
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => {
      const point = parseInt(code, 16);
      return point <= 0x10ffff ? String.fromCodePoint(point) : " ";
    });
}

function stripMarkup(value) {
  return decodeEntities(String(value || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function tagList(html, name) {
  return String(html || "").match(new RegExp("<" + name + "\\b[^>]*>", "gi")) || [];
}

function attr(tag, name) {
  const escaped = name.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  const match = String(tag || "").match(new RegExp("\\b" + escaped + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
  return match ? decodeEntities(match[1] ?? match[2] ?? match[3] ?? "") : null;
}

function metaContent(html, name) {
  const metas = tagList(html, "meta");
  const tag = metas.find(item => (attr(item, "name") || "").toLowerCase() === name.toLowerCase());
  return tag ? (attr(tag, "content") || "") : "";
}

function addCheck(checks, category, status, title, summary, nextStep, evidence, priority) {
  checks.push({ category, status, title, summary, nextStep, evidence, priority: priority || 3 });
}

function buildChecks(html, response, finalUrl, responseMs, truncated) {
  const checks = [];
  const contentType = response.headers.get("content-type") || "";
  const isHtml = /text\/html|application\/xhtml\+xml/i.test(contentType);
  const source = isHtml ? html : "";
  const titleTag = source.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i);
  const title = titleTag ? stripMarkup(titleTag[1]) : "";
  const description = metaContent(source, "description").trim();
  const viewport = metaContent(source, "viewport");
  const h1Count = tagList(source, "h1").length;
  const images = tagList(source, "img");
  const imagesWithoutAlt = images.filter(image => attr(image, "alt") === null).length;
  const pageText = stripMarkup(source.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")).toLowerCase();
  const finalHost = finalUrl.hostname.toLowerCase();
  const linkMatches = [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)];
  const actions = new Set();
  for (const match of linkMatches) {
    const href = attr("<a " + match[1] + ">", "href") || "";
    const label = stripMarkup(match[2]).toLowerCase();
    if (/^tel:/i.test(href)) actions.add("phone");
    if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) actions.add("WhatsApp");
    if (/^mailto:/i.test(href)) actions.add("email");
    if (/\b(book|booking|appointment|schedule|consultation|reserve)\b/i.test(href + " " + label)) actions.add("booking");
    if (/(^|\/)(contact|contact-us|find-us)(\/|$|[?#])/i.test(href)) actions.add("contact page");
  }
  const locationSignal = /<address\b|postaladdress|find us|directions|opening hours|open(?:ing)? times|clinic location|hospital location|\blocation\b|\baddress\b/i.test(source) ||
    /\b(lagos|ikeja|lekki|yaba|surulere|abuja|ibadan|port harcourt|kano)\b/i.test(pageText);
  const robots = (metaContent(source, "robots") + " " + (response.headers.get("x-robots-tag") || "")).toLowerCase();
  const hasNoindex = /\bnoindex\b/.test(robots);
  const formTags = tagList(source, "form");
  const insecureForms = [];
  const externalForms = [];
  for (const form of formTags) {
    const action = attr(form, "action");
    if (!action) continue;
    try {
      const actionUrl = new URL(action, finalUrl);
      if (actionUrl.protocol === "http:" && finalUrl.protocol === "https:") insecureForms.push(actionUrl.hostname);
      if (actionUrl.hostname && actionUrl.hostname !== finalHost) externalForms.push(actionUrl.hostname);
    } catch {}
  }
  const scripts = tagList(source, "script");
  const scriptSource = (source.match(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi) || scripts).join("\n");
  const externalScriptHosts = new Set();
  const trackerNames = new Set();
  const trackerRules = [
    [/google-analytics\.com|googletagmanager\.com|google\.com\/pagead|gtag\s*\(/i, "Google analytics or advertising"],
    [/connect\.facebook\.net|facebook\.com\/tr|fbq\s*\(/i, "Meta Pixel"],
    [/analytics\.tiktok\.com|tiktok\.com\/i18n|ttq\s*\(/i, "TikTok analytics"],
    [/hotjar\.com|hotjar\.io|hj\s*\(/i, "Hotjar"],
    [/clarity\.ms|clarity\s*\(/i, "Microsoft Clarity"],
    [/segment\.com|segment\.io|analytics\.load\s*\(/i, "Segment"]
  ];
  for (const script of scripts) {
    const src = attr(script, "src");
    if (src) {
      try {
        const scriptUrl = new URL(src, finalUrl);
        if (scriptUrl.hostname.toLowerCase() !== finalHost) externalScriptHosts.add(scriptUrl.hostname.toLowerCase());
      } catch {}
    }
  }
  for (const [pattern, label] of trackerRules) {
    if (pattern.test(scriptSource)) trackerNames.add(label);
  }
  const allHeaderNames = [
    ["Strict-Transport-Security", "strict-transport-security"],
    ["Content-Security-Policy", "content-security-policy"],
    ["X-Content-Type-Options", "x-content-type-options"],
    ["Referrer-Policy", "referrer-policy"]
  ];
  const presentHeaders = allHeaderNames.filter(([, name]) => response.headers.has(name)).map(([label]) => label);
  const missingHeaders = allHeaderNames.filter(([, name]) => !response.headers.has(name)).map(([label]) => label);
  const titleEvidence = title ? "Page title: " + title.slice(0, 180) : "No page title was found in the initial HTML.";
  const descriptionEvidence = description ? "Description: " + description.slice(0, 240) : "No meta description was found in the initial HTML.";

  addCheck(
    checks, "Connection", response.status >= 200 && response.status < 300 ? "good" : "review",
    "Homepage response",
    response.status >= 200 && response.status < 300 ? "The page returned HTTP " + response.status + "." : "The page returned HTTP " + response.status + ".",
    response.status >= 200 && response.status < 300 ? "This confirms that the page answered this request; it does not measure every visitor’s experience." : "Ask your host or developer to check availability and any access restrictions.",
    finalUrl.href, 1
  );
  addCheck(
    checks, "Connection", finalUrl.protocol === "https:" ? "good" : "review",
    "Secure connection",
    finalUrl.protocol === "https:" ? "The final page address uses HTTPS." : "The final page address uses HTTP, so this request was not encrypted in transit.",
    finalUrl.protocol === "https:" ? "Keep HTTPS enabled and renew the certificate before it expires." : "Enable HTTPS and redirect visitors from HTTP to the secure address.",
    finalUrl.protocol + "//" + finalHost, 1
  );
  addCheck(
    checks, "Patient route", actions.size ? "good" : "review",
    "A patient’s next step",
    actions.size ? "The homepage links to: " + [...actions].join(", ") + "." : "No direct call, WhatsApp, email, booking or contact-page link was found in the initial homepage HTML.",
    actions.size ? "Confirm each route works on a phone and reaches the right team." : "Place a clear call, WhatsApp or appointment action near the main service information.",
    actions.size ? [...actions].join(", ") : "The checker reads the first page’s HTML. A route added later by JavaScript may not appear here.", 2
  );
  addCheck(
    checks, "Patient route", locationSignal ? "good" : "review",
    "Location and opening information",
    locationSignal ? "The homepage contains a location, address, directions or opening-hours signal." : "A location, directions or opening-hours signal was not found in the initial homepage HTML.",
    locationSignal ? "Confirm the address and opening times are current and easy to act on." : "Make the clinic location and current opening hours easy to find, especially on a phone.",
    "This is a text and markup signal, not a verification of the address or hours.", 3
  );
  addCheck(
    checks, "Mobile & accessibility signals", viewport.toLowerCase().includes("width=device-width") ? "good" : "review",
    "Mobile viewport",
    viewport.toLowerCase().includes("width=device-width") ? "A responsive viewport declaration was found." : "A responsive viewport declaration was not found in the initial HTML.",
    viewport.toLowerCase().includes("width=device-width") ? "Check the live page on a small phone; this declaration alone does not prove the layout works." : "Ask your developer to add and verify a responsive viewport, then inspect the page on a phone.",
    viewport ? "Viewport: " + viewport.slice(0, 180) : "No viewport meta tag was found.", 2
  );
  addCheck(
    checks, "Mobile & accessibility signals", !isHtml ? "info" : images.length === 0 ? "info" : imagesWithoutAlt === 0 ? "good" : "review",
    "Image descriptions",
    !isHtml ? "The response was not HTML, so image markup could not be checked." : images.length === 0 ? "No image tags were found in the initial HTML." : imagesWithoutAlt === 0 ? "All " + images.length + " image tags include an alt attribute." : imagesWithoutAlt + " of " + images.length + " image tags do not include an alt attribute.",
    imagesWithoutAlt ? "Add useful alt text to informative images. Use an empty alt attribute for images that are purely decorative." : "A human should still review whether the descriptions are useful and accurate.",
    images.length ? "Images checked: " + images.length + "; without an alt attribute: " + imagesWithoutAlt + "." : "Only image tags in the first page’s initial HTML are counted.", 3
  );
  addCheck(
    checks, "Search basics", !isHtml ? "info" : title ? "good" : "review",
    "Page title",
    !isHtml ? "The response was not HTML, so the page title could not be checked." : title ? "A page title is present." : "A page title was not found in the initial HTML.",
    title ? "Make sure it names the clinic and the main service or location clearly." : "Add a distinct page title that names the clinic and what it offers.",
    titleEvidence, 3
  );
  addCheck(
    checks, "Search basics", !isHtml ? "info" : description ? "good" : "review",
    "Search description",
    !isHtml ? "The response was not HTML, so the search description could not be checked." : description ? "A meta description is present." : "A meta description was not found in the initial HTML.",
    description ? "Check that it describes the clinic accurately and gives a patient a clear reason to visit." : "Write a concise page description that accurately explains the clinic and its main service.",
    descriptionEvidence, 3
  );
  addCheck(
    checks, "Search basics", !isHtml ? "info" : hasNoindex ? "review" : h1Count ? "good" : "review",
    "Main heading and indexing signal",
    !isHtml ? "The response was not HTML, so heading and indexing signals could not be checked." : hasNoindex ? "A noindex directive was found in the homepage response." : h1Count ? "A main heading and no noindex directive were found." : "No main heading was found in the initial HTML.",
    hasNoindex ? "If this page should appear in search, ask your developer to review the noindex directive." : h1Count ? "This is only an initial signal. It does not confirm that search engines have indexed the page." : "Add a clear main heading that describes the clinic or its primary service.",
    "H1 headings found: " + h1Count + (robots ? "; robots signal: " + robots.slice(0, 160) : "; no robots directive found in the response."), 2
  );
  addCheck(
    checks, "Privacy signals", insecureForms.length ? "review" : externalForms.length ? "info" : formTags.length ? "good" : "info",
    "Form destinations",
    !isHtml ? "The response was not HTML, so form destinations could not be checked." : !formTags.length ? "No form tag was found in the initial homepage HTML." : insecureForms.length ? "A form appears to submit to an unencrypted HTTP address." : externalForms.length ? "A form submits to an external service: " + Array.from(new Set(externalForms)).join(", ") + "." : "The forms found do not point to an external or unencrypted address in the initial HTML.",
    insecureForms.length ? "Ask your developer to move the form destination to HTTPS before collecting any information." : externalForms.length ? "Confirm the external form provider, the information it receives and its privacy terms." : "This check does not inspect what the form asks for or what happens after submission.",
    "Forms found: " + formTags.length + (externalForms.length ? "; external destinations: " + Array.from(new Set(externalForms)).join(", ") : ""), 1
  );
  addCheck(
    checks, "Privacy signals", trackerNames.size ? "review" : externalScriptHosts.size ? "info" : "good",
    "External scripts and tracker signals",
    trackerNames.size ? "The homepage source references: " + [...trackerNames].join(", ") + "." : externalScriptHosts.size ? "The homepage source references scripts from " + [...externalScriptHosts].slice(0, 6).join(", ") + "." : "No external script or common tracker signal was found in the initial homepage HTML.",
    trackerNames.size || externalScriptHosts.size ? "Confirm which scripts are needed, what data they can access and whether they appear on booking or enquiry pages." : "This is a source check only. Scripts added later by JavaScript and network data sent by a script are not observed.",
    "External script hosts: " + (externalScriptHosts.size ? [...externalScriptHosts].slice(0, 8).join(", ") : "none found") + ". A script reference alone does not prove that patient data is collected or shared.", 2
  );
  addCheck(
    checks, "Security signals", missingHeaders.length ? "review" : "good",
    "Browser security headers",
    missingHeaders.length ? "These response headers were not seen: " + missingHeaders.join(", ") + "." : "The checked browser security headers were present.",
    missingHeaders.length ? "Ask your developer whether these headers fit the site. A missing header alone does not prove a security breach." : "Keep the headers aligned with the site’s scripts and embedded services.",
    "Present: " + (presentHeaders.length ? presentHeaders.join(", ") : "none of the checked headers") + ". Checked: " + allHeaderNames.map(([label]) => label).join(", ") + ".", 3
  );
  addCheck(
    checks, "Connection", "info",
    "Time to response",
    "The final page response headers arrived after about " + responseMs + " ms from the scan environment.",
    "Treat this as one request snapshot, not a Lighthouse score, Core Web Vital or Lagos mobile-network measurement.",
    "Response time varies by scan location, hosting and the target website.", 4
  );
  if (truncated) {
    addCheck(checks, "Scan limits", "info", "Page source limit", "The checker stopped reading after 1.2 MB of HTML.", "Ask for a fuller review if important page content is missing from this result.", "The response was capped to keep the public scan bounded.", 4);
  }
  return checks;
}

function isHealthRelatedSite(html, finalUrl) {
  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i);
  const title = titleTag ? stripMarkup(titleTag[1]) : "";
  const description = metaContent(html, "description");
  const headings = tagList(html, "h1").map(stripMarkup).join(" ");
  const identity = [finalUrl.hostname, finalUrl.pathname, title, description, headings].join(" ");
  if (HEALTH_IDENTITY_TERMS.test(identity)) return true;

  const readableText = stripMarkup(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
  ).toLowerCase();
  const pageSignals = new Set([...readableText.matchAll(HEALTH_PAGE_TERMS)].map(match => match[0]));
  return pageSignals.size >= 3;
}

function scoreClinicChecks(checks) {
  const scoredChecks = checks.filter(check => check.status === "good" || check.status === "review");
  const totalWeight = scoredChecks.reduce((sum, check) => sum + (SCORE_WEIGHTS[check.priority] || 1), 0);
  const earnedWeight = scoredChecks
    .filter(check => check.status === "good")
    .reduce((sum, check) => sum + (SCORE_WEIGHTS[check.priority] || 1), 0);
  let value = totalWeight ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const criticalFindings = checks.filter(check => check.status === "review" && check.priority === 1);
  const capped = criticalFindings.length > 0;
  if (capped) value = Math.min(value, 59);
  const band = SCORE_GRADES.find(item => value >= item.min) || SCORE_GRADES[SCORE_GRADES.length - 1];
  return {
    value,
    grade: band.grade,
    label: band.label,
    criticalCap: capped ? 59 : null,
    scoredChecks: scoredChecks.length,
    method: "Weighted snapshot of homepage checks. Higher-priority findings count more; context signals are excluded.",
    formula: "Good checks earn points; review flags earn none. Priority 1, 2, 3 and 4 checks carry 4, 3, 2 and 1 points. Information-only checks are excluded. Any unresolved priority 1 finding caps the score at 59. Grades are A (90–100), B (80–89), C (70–79), D (60–69) and F (below 60). PageSpeed lab scores are reported separately.",
    limitation: "Not a clinical, legal, security or accessibility verdict, or a Lagos benchmark. PageSpeed is optional and reported separately."
  };
}

function previewHighlights(checks) {
  const priorityOrder = (a, b) => (a.priority || 3) - (b.priority || 3);
  const review = checks.filter(check => check.status === "review").sort(priorityOrder);
  const selected = review.length
    ? review.slice(0, 3)
    : checks.filter(check => check.status === "good").sort(priorityOrder).slice(0, 3);
  return selected.map(({ category, status, title, summary }) => ({ category, status, title, summary }));
}

async function captureAuditLead(email, audit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(FORM_SUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // Server-side submissions do not inherit the browser's origin headers.
        // FormSubmit requires the form's site even when _url is supplied.
        "Origin": "https://fjmk.drtolu.com",
        "Referer": "https://fjmk.drtolu.com/tools"
      },
      body: JSON.stringify({
        name: "Health website audit report request",
        email,
        _replyto: email,
        _url: "https://fjmk.drtolu.com/tools",
        website: audit.finalUrl.href,
        score: audit.score.value + "/100",
        grade: audit.score.grade,
        review_items: audit.reviewCount,
        _subject: "FJMK health website audit report request",
        _captcha: "false"
      }),
      signal: controller.signal
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !(result && (result.success === true || result.success === "true"))) {
      const inactive = typeof result?.message === "string" && /needs activation/i.test(result.message);
      // Do not log the submitted email or the report. Provider setup failures
      // need an owner action; repeatedly asking visitors to retry cannot fix them.
      console.warn("Audit lead delivery failed", { status: response.status, reason: inactive ? "form_not_activated" : "provider_rejected" });
      throw new AuditError(424, inactive
        ? "Report requests are not available yet. Please contact FJMK to request your report."
        : "We could not confirm your email request, so the detailed report stayed locked. Please try again shortly.");
    }
  } catch (error) {
    if (error instanceof AuditError) throw error;
    console.warn("Audit lead delivery failed", { reason: controller.signal.aborted ? "provider_timeout" : "provider_unreachable" });
    // A failed delivery dependency uses 424. Cloudflare replaces some 502
    // responses with its HTML gateway page, hiding the actionable JSON error.
    throw new AuditError(424, "We could not confirm your email request, so the detailed report stayed locked. Please try again shortly.");
  } finally {
    clearTimeout(timer);
  }
}

async function pageSpeedSnapshot(pageUrl, apiKey) {
  if (!apiKey) return { status: "not_configured" };
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", pageUrl);
  endpoint.searchParams.set("strategy", "MOBILE");
  ["PERFORMANCE", "ACCESSIBILITY", "SEO", "BEST_PRACTICES"].forEach(category => endpoint.searchParams.append("category", category));
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("fields", "lighthouseResult(finalUrl,fetchTime,lighthouseVersion,categories(performance(score),accessibility(score),seo(score),best-practices(score)))");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PAGESPEED_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint.href, {
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });
    if (!response.ok) return { status: "unavailable" };
    const payload = await response.json();
    const lighthouse = payload && payload.lighthouseResult;
    const categories = lighthouse && lighthouse.categories;
    if (!categories) return { status: "unavailable" };
    const scores = {};
    for (const [key, category] of [["performance", "performance"], ["accessibility", "accessibility"], ["seo", "seo"], ["bestPractices", "best-practices"]]) {
      const score = categories[category] && categories[category].score;
      if (Number.isFinite(score)) scores[key] = Math.round(score * 100);
    }
    return {
      status: "available",
      strategy: "mobile",
      finalUrl: typeof lighthouse.finalUrl === "string" ? lighthouse.finalUrl : pageUrl,
      fetchedAt: typeof lighthouse.fetchTime === "string" ? lighthouse.fetchTime : new Date().toISOString(),
      lighthouseVersion: typeof lighthouse.lighthouseVersion === "string" ? lighthouse.lighthouseVersion : null,
      scores
    };
  } catch {
    return { status: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}

export async function handleClinicAuditRequest(request, options = {}) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Use POST to check a website." }, 405);
  }
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const host = new URL(origin).hostname.toLowerCase();
      const allowed = host === "fjmk.drtolu.com" || host === "fjmk.pages.dev" || host.endsWith(".fjmk.pages.dev") || host === "localhost" || host === "127.0.0.1" || host === "::1";
      if (!allowed) return jsonResponse({ error: "This scan is available from the FJMK website." }, 403);
    } catch {
      return jsonResponse({ error: "The request origin could not be verified." }, 403);
    }
  }
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return jsonResponse({ error: "Send the website address as JSON." }, 415);
  }
  let payload;
  try {
    payload = JSON.parse(await readRequestText(request));
  } catch (error) {
    return jsonResponse({ error: error instanceof AuditError ? error.message : "Enter a valid website address." }, error instanceof AuditError ? error.status : 400);
  }
  const mode = payload && payload.mode !== undefined ? payload.mode : "preview";
  if (mode !== "preview" && mode !== "report") {
    return jsonResponse({ error: "Choose a preview or report request." }, 400);
  }
  let email = "";
  if (mode === "report") {
    email = typeof payload.email === "string" ? payload.email.trim() : "";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Enter a valid email address to unlock the detailed report." }, 400);
    }
  }
  let target;
  try {
    target = normalizePublicUrl(payload && payload.url);
  } catch (error) {
    return jsonResponse({ error: error.message || "Enter a public website address." }, error.status || 400);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const result = await fetchPublicPage(target, controller.signal);
    const response = result.response;
    const contentType = response.headers.get("content-type") || "";
    const body = await readHtml(response);
    if (!isHealthRelatedSite(body.html, result.url)) {
      return jsonResponse({
        error: "This checker is for health and health-related websites. Try a clinic, hospital, pharmacy, health service or health technology homepage."
      }, 422);
    }
    const checks = buildChecks(body.html, response, result.url, result.responseMs, body.truncated);
    const reviewCount = checks.filter(check => check.status === "review").length;
    const goodCount = checks.filter(check => check.status === "good").length;
    const score = scoreClinicChecks(checks);
    const summary = reviewCount
      ? reviewCount + " of " + checks.length + " homepage checks need review. The preview shows the highest-priority findings."
      : "No review flags were detected in the checks available on this homepage.";
    const highlights = previewHighlights(checks);
    const audit = {
      requestedUrl: target.href,
      finalUrl: result.url.href,
      fetchedAt: new Date().toISOString(),
      responseStatus: response.status,
      responseTimeMs: result.responseMs,
      contentType,
      htmlPage: /text\/html|application\/xhtml\+xml/i.test(contentType),
      truncated: body.truncated,
      pageSpeed: { status: options.pageSpeedApiKey ? "pending" : "not_configured" },
      score,
      summary,
      highlights,
      reviewCount,
      goodCount,
      checks
    };
    if (mode === "preview") {
      return jsonResponse({
        requestedUrl: audit.requestedUrl,
        finalUrl: audit.finalUrl,
        fetchedAt: audit.fetchedAt,
        responseStatus: audit.responseStatus,
        responseTimeMs: audit.responseTimeMs,
        score,
        summary: audit.summary,
        highlights: audit.highlights
      }, 200);
    }
    await captureAuditLead(email, { finalUrl: result.url, score, reviewCount });
    return jsonResponse(audit, 200);
  } catch (error) {
    if (error instanceof AuditError) return jsonResponse({ error: error.message }, error.status);
    if (controller.signal.aborted) return jsonResponse({ error: "The website took too long to answer. Try again in a moment." }, 504);
    return jsonResponse({ error: "The website could not be checked. It may be offline, blocking automated requests or rejecting the connection." }, 502);
  } finally {
    clearTimeout(timer);
  }
}

export async function handleClinicPageSpeedRequest(request, options = {}) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Use POST to request a mobile Lighthouse snapshot." }, 405);
  }
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const host = new URL(origin).hostname.toLowerCase();
      const allowed = host === "fjmk.drtolu.com" || host === "fjmk.pages.dev" || host.endsWith(".fjmk.pages.dev") || host === "localhost" || host === "127.0.0.1" || host === "::1";
      if (!allowed) return jsonResponse({ error: "This scan is available from the FJMK website." }, 403);
    } catch {
      return jsonResponse({ error: "The request origin could not be verified." }, 403);
    }
  }
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return jsonResponse({ error: "Send the website address as JSON." }, 415);
  }
  if (!options.pageSpeedApiKey) {
    return jsonResponse({ error: "The mobile Lighthouse snapshot is not configured in this environment." }, 503);
  }
  let payload;
  try {
    payload = JSON.parse(await readRequestText(request));
  } catch (error) {
    return jsonResponse({ error: error instanceof AuditError ? error.message : "Enter a valid website address." }, error instanceof AuditError ? error.status : 400);
  }
  let target;
  try {
    target = normalizePublicUrl(payload && payload.url);
  } catch (error) {
    return jsonResponse({ error: error.message || "Enter a public website address." }, error.status || 400);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const result = await fetchPublicPage(target, controller.signal);
    const body = await readHtml(result.response);
    if (!isHealthRelatedSite(body.html, result.url)) {
      return jsonResponse({
        error: "This checker is for health and health-related websites. Try a clinic, hospital, pharmacy, health service or health technology homepage."
      }, 422);
    }
    clearTimeout(timer);
    const pageSpeed = await pageSpeedSnapshot(result.url.href, options.pageSpeedApiKey);
    return jsonResponse({ pageSpeed }, 200);
  } catch (error) {
    if (error instanceof AuditError) return jsonResponse({ error: error.message }, error.status);
    if (controller.signal.aborted) return jsonResponse({ error: "The website domain took too long to verify." }, 504);
    return jsonResponse({ error: "The mobile Lighthouse snapshot could not be completed." }, 502);
  } finally {
    clearTimeout(timer);
  }
}
