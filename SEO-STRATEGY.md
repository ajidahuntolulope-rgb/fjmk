# FJMK — Search & Ranking Strategy
### How we get our clients found, and how we keep them found

_Internal document. Written 2026-10-09._

---

## The problem, stated plainly

A clinic owner does not want a website. They want the phone to ring. The website
is just the mechanism. So the question "how do we increase their ranking" is
really three questions stacked on top of each other:

1. **Can Google find them at all?** (technical + local presence)
2. **When it finds them, does it show them to the right person?** (relevance)
3. **When the right person arrives, do they convert?** (the website itself)

Most agencies sell answer 3 and pretend it is answer 1. We should sell all three
as one system, because that is what actually moves the number.

---

## Part 1 — The local stack (this is 80% of the value for a clinic)

For a clinic, the highest-leverage work is **not** the website. It is the Google
Business Profile. This is counter-intuitive to clients and it is the single most
valuable thing we can tell them.

**Why:** a clinic competes in the map pack — the three businesses with a map,
reviews and a "Call" button that appear above the organic results. The map pack
is driven by the profile, not the site. A new domain takes 6–12 months to rank
organically. A well-built profile can move in weeks.

### The local checklist (do in this order)

| # | Action | Why it matters | Effort |
|---|---|---|---|
| 1 | Claim & verify the Google Business Profile | Nothing else works without it | Low |
| 2 | Set the **primary category** correctly (e.g. "Dental clinic", not "Dentist") | Primary category is the strongest local ranking factor | Low |
| 3 | Complete every field: hours, phone, services, attributes, description | Completeness correlates with map-pack position | Low |
| 4 | NAP consistency — Name, Address, Phone identical everywhere | Conflicting data splits Google's confidence | Medium |
| 5 | Get to 25+ reviews, and keep them **recent** | Volume × recency. Stale reviews decay | Ongoing |
| 6 | Respond to every review, especially negatives | Response rate is a visible trust signal | Ongoing |
| 7 | Post to the profile weekly | Freshness signal, and it shows in the panel | Ongoing |
| 8 | Add real photos monthly (team, premises, equipment) | Profiles with photos get materially more clicks | Ongoing |

**The review engine** is the part clients cannot do themselves and the part that
compounds. A simple post-visit WhatsApp — sent within an hour, with a direct
review link — converts a meaningful share of patients. We build this into the
site's WhatsApp flow so it is automatic.

---

## Part 2 — Content: the "patient education" moat

This is where the FJMK content library becomes a commercial weapon rather than a
nice extra.

### The insight

A clinic cannot out-rank a national health portal for "malaria symptoms" — and
should not try. But it *can* own the specific, local, high-intent, low-competition
queries that a national portal will never write for:

- "malaria test in Surulere"
- "how much is a full body check up in Lagos"
- "fertility clinic in Lekki that accepts HMO"
- "dentist open on Saturday in Ikeja"

These are the searches where the person is ready to book, and where a well-built
local page can win in weeks rather than months.

### The content model — three layers

**Layer 1 — Service pages (one per service, per location).**
Not one "Services" page. One page per thing they actually sell: *Root Canal
Treatment in Ikeja*, *Antenatal Care in Lekki*. Each answers: what it is, what
happens, how long, what it costs, who does it, how to book. This is the
highest-converting content on the site and the most under-built.

**Layer 2 — Patient education (the library we already have).**
169 reviewed articles. These serve three jobs at once:
- they capture informational search traffic (people earlier in the decision)
- they prove clinical authority, which feeds both Google and AI answers
- they reduce the reception phone load, which clients notice immediately

**Layer 3 — Local authority pages.**
*"Choosing a hospital in Shomolu"*, *"Where to get a blood test near Yaba"*.
Lower volume, very high intent, almost no competition, and they build the
topical locality signals that lift the whole site.

### The publishing cadence

| Layer | Volume | Who writes | Review |
|---|---|---|---|
| Service pages | 1 per service, at build | Us | Client sign-off |
| Education articles | 2–4 per month | Us, from the library | Dr. Tolu / client clinician |
| Local pages | 1 per month | Us | Us |

The care plan already promises "two articles a month" — this is what that is for.
It is not filler. It is the thing that keeps the site growing after launch.

---

## Part 3 — AI search (the part competitors have not noticed)

This is the arbitrage inside the arbitrage, and it is worth explaining to clients
because it makes us look like we are paying attention.

Roughly 69% of Google searches now end without a click — the answer is in the
results page itself. More people are asking ChatGPT, Perplexity and Gemini for
recommendations. When they ask *"best fertility clinic in Lagos"*, the AI
synthesises an answer from what it can find.

**What gets a clinic into that answer:**

1. **Consistent entity data.** Same name, address, phone, hours everywhere.
   AI systems resolve you as an entity or they do not mention you.
2. **Structured content.** Clear headings, direct answers, FAQ blocks, tables.
   Machines quote what they can parse.
3. **Third-party corroboration.** Mentions on other sites, directory listings,
   review platforms. The AI cross-references.
4. **Freshness.** Last-updated dates, current hours, recent posts.

**What we implement for every client:**
- `LocalBusiness` / `MedicalClinic` schema markup (JSON-LD) with hours, geo,
  services, and `sameAs` links to their social profiles
- `FAQPage` schema on every education article
- A visible "last reviewed" date on clinical content
- Clean semantic HTML — the single biggest practical lever, and most Nigerian
  clinic sites have none of it

This is cheap to do, it is genuinely differentiating, and it costs the client
nothing extra. It also happens to be the thing that will matter most in two years.

---

## Part 4 — Technical: the unglamorous part that decides everything

Most clinic sites fail here before content ever matters.

| Check | Target | Why |
|---|---|---|
| Load time on mobile data | **Under 3s** | 53% of mobile visitors abandon after 3s |
| Page weight | Under 1MB | Nigerian mobile data is metered and slow |
| Mobile layout | Perfect at 360px | Most traffic is a cheap Android phone |
| HTTPS | Always | Browsers flag HTTP as "Not secure" |
| Click-to-call | Every phone number | The #1 conversion action on mobile |
| WhatsApp deep link | Everywhere | The actual booking channel in Nigeria |
| Tap targets | 44px minimum | Thumb accuracy |
| Core Web Vitals | Green | Direct ranking factor |

**Our structural advantage:** every site we build is hand-written static HTML with
no framework, no build step and no bloated plugin stack. A typical WordPress
clinic site ships 2–4MB of JavaScript. Ours ship almost none. We win on speed by
construction, not by optimisation. That is a genuine, defensible selling point and
we should say it out loud.

---

## Part 5 — Measurement: what we report, and why

Clients do not care about rankings. They care about patients. Report accordingly.

**Monthly report, one page:**

1. **Enquiries** — calls, WhatsApp clicks, form submissions. Total and by source.
2. **Search visibility** — impressions and clicks from Search Console, plus the
   queries driving them.
3. **Map performance** — profile views, direction requests, calls from the profile.
4. **What we changed** this month and what we expect it to do.
5. **What is next.**

Never report page views as a headline. It is the fastest way to look like every
other agency.

**The one number that matters:** enquiries per month, trended. If that line is
going up, the engagement is working. If it is not, something is wrong and we
should say so before the client notices.

---

## Part 6 — The honest limits

We should be the agency that tells clients what will not work, because it is both
right and commercially smart — it is the reason they trust us on everything else.

- **SEO is slow.** 3–6 months for an established site, 6–12 for a new domain.
  Anyone promising page one in a week is lying.
- **Reviews beat websites in local search.** If a competitor has 200 recent
  reviews and the client has 6, the profile work matters more than the site.
- **We cannot control Google.** Rankings are probabilistic. We improve odds.
- **A site that does not convert wastes everything.** If reception does not answer
  the phone, no amount of ranking fixes that. We should tell them.
- **Some niches are not worth competing in.** If a Lagos clinic wants to rank for
  "hospital", they will not. We should redirect them to what is winnable.

---

## Part 7 — How this becomes a product (not just a service)

The pieces above assemble into a repeatable, sellable ladder:

**Build (one-time)** — site, service pages, schema, profile setup, WhatsApp flow,
analytics. Fixed price. The thing we already sell.

**Care plan (monthly)** — hosting, 2 articles, profile posts, review management,
monthly report. Already in the pricing. This is the recurring revenue.

**Growth retainer (higher tier)** — everything in care, plus 4 articles, 1 local
page, quarterly content audit, competitor tracking. This is the upsell for
clinics that see results and want more.

**The library licence (new)** — the 169-article reviewed patient-education bank
licensed to a clinic as a white-label asset, with their name on it. This is a
genuinely unusual product. Most agencies cannot offer it because they have no
medical content bank and no clinical reviewer. We do. It should be a standalone
line item, priced separately, and it is the thing no competitor can copy quickly.

---

## The one-paragraph version (for a client conversation)

> We do three things. We fix your Google profile so you show up when someone
> nearby searches for what you do — that is the fastest win and it is most of the
> result. We build a page for every service you actually sell, written around what
> patients really type. And we publish reviewed health articles under your name,
> which brings in people earlier and makes Google and AI assistants treat you as
> the authority in your area. Then we measure enquiries, not page views, and we
> tell you every month what changed and what is next.
