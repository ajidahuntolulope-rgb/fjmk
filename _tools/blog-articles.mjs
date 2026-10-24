import fs from 'node:fs';

export const blogArticles = [
  {
    slug: 'pages-every-clinic-website-needs',
    title: 'What Pages Should a Clinic Website Have?',
    cardDescription: 'A practical page plan built around what people need to know before they contact a clinic.',
    category: 'Websites',
    description: 'A clinic website needs clear service, team, location and contact pages. Build the structure around what visitors need to decide and do next.',
    keyword: 'what pages should a clinic website have',
    body: `
<p class="blog-article-answer"><strong>Short answer:</strong> A clinic website should make its services, clinicians, location, hours and next step easy to find. Give each important service its own useful page when it answers a distinct question; do not split one thin description into many near-identical pages.</p>
<p>Most clinic websites are organised around what the organisation wants to say: a welcome, a list of departments, a gallery. A visitor arrives with a smaller job. They need to check whether the clinic offers the service they need, whether it feels credible, and how to make contact.</p>
<p>We use that decision path when we plan healthcare website concepts at FJMK. It is a design test, not a claim that our concepts have produced patient or booking results.</p>
<h2>Start with three jobs: recognise, verify, act</h2>
<ol><li><strong>Recognise:</strong> Can a visitor tell what the clinic does and whether the page is relevant to them?</li><li><strong>Verify:</strong> Can they check who provides the service, where it is available and what to expect?</li><li><strong>Act:</strong> Can they call, message or request an appointment without hunting for the route?</li></ol>
<p>If a page does not help with one of those jobs, ask whether it belongs in the main navigation or whether it is internal information that can live elsewhere.</p>
<h2>The core pages most clinics need</h2>
<h3>1. A homepage that routes people</h3>
<p>State the clinic’s real name, main services and location. Give visitors clear routes to the services, contact details and appointment process. A homepage should orient people; it cannot explain every specialty well.</p>
<h3>2. Service or specialty pages</h3>
<p>Use a separate page when a service has its own audience, questions, clinician, location, preparation steps or booking route. Explain what the clinic actually offers, where it is offered, who to contact and what a first enquiry involves. Avoid publishing a page for every keyword variation if the underlying service and answer are the same.</p>
<h3>3. Clinician and team information</h3>
<p>For each clinician featured, publish only verified names, roles, qualifications and relevant experience. Make it clear who is responsible for care and how the person fits the service. Do not pad biographies with unverified claims.</p>
<h3>4. Location and practical visit information</h3>
<p>Show the correct address, directions, phone number, opening hours and any practical access details. If the clinic has multiple real branches, give each branch accurate information. Do not create a location page for a place where the clinic does not operate.</p>
<h3>5. Contact and appointment information</h3>
<p>Say whether a person can call, use WhatsApp, submit a request or book a confirmed time. Explain what happens after someone gets in touch. A request form is not the same thing as a confirmed appointment.</p>
<h3>6. Patient information and privacy</h3>
<p>Explain relevant processes such as what to bring, how to prepare, payment or insurance information if the clinic chooses to publish it, and how personal information is handled. Keep clinical instructions under an accountable clinical review process.</p>
<h2>How to decide whether a service needs its own page</h2>
<p>Give it a dedicated page if the answer to at least one of these is yes:</p>
<ul><li>Would someone search for this service by name?</li><li>Does the clinic provide it at only some locations?</li><li>Does it have a distinct clinician, timetable or booking route?</li><li>Would a visitor need different preparation or practical information?</li><li>Can the clinic provide accurate, specific information that is not already on another page?</li></ul>
<p>That last question is the quality check. A page that only swaps “dentist” for “paediatrician” is not a useful service page. It is a duplicate with a different label.</p>
<h2>A five-minute mobile test</h2>
<p>Open the site on a phone and ask someone unfamiliar with it to find one service, the clinician or team responsible, the clinic’s location, and the correct way to request an appointment. Watch where they hesitate. Those pauses point to missing information or weak page paths more clearly than another round of decorative redesign.</p>
<p>Google recommends crawlable links between important pages and descriptive page titles. That helps discovery, but it does not guarantee indexing or ranking. The page still needs to answer the visitor’s question well.</p>
<p class="article-source">Further reading: <a href="https://developers.google.com/search/docs/fundamentals/get-started-developers">Google’s guide to helping Google understand your site</a>.</p>
<h2>What should a clinic fix first?</h2>
<p>Start with the page that blocks a real decision. If visitors cannot tell whether you offer a service, fix that service page. If they can find the clinic but cannot work out how to contact it, fix the contact route. More pages are useful only when they add a distinct, accurate answer.</p>`
  },
  {
    slug: 'medical-content-and-trust',
    title: 'Who Should Write Medical Content for a Clinic Website?',
    cardDescription: 'A clear division of work between the writer, the clinical reviewer and the person who keeps a page current.',
    category: 'Content',
    description: 'A writer can make clinic information clear, but a qualified clinical reviewer must check medical accuracy, scope and safety before publication.',
    keyword: 'who should write medical content for a clinic website',
    body: `
<p class="blog-article-answer"><strong>Short answer:</strong> A skilled writer can organise and explain a clinic’s information, but a suitably qualified clinician should review medical claims before publication. The clinic also needs a named owner who can correct practical details when services, clinicians or hours change.</p>
<p>“Clinician reviewed” is not a decoration to add after a page is written. It is a responsibility: someone with the right expertise must check that the content is accurate, relevant to the clinic and safe for the audience it serves.</p>
<p>Our position at FJMK is that healthcare content has two jobs that should not be confused. It must help the right person understand what the clinic offers, and it must stay within what the clinic can substantiate. Search visibility is downstream of those jobs.</p>
<h2>Give each person a distinct role</h2>
<ul><li><strong>The clinic supplies the facts:</strong> services actually provided, locations, appointment steps, fees or payment details it is willing to publish, and the person responsible for each service.</li><li><strong>The writer makes the facts usable:</strong> plain language, a clear answer near the top, useful headings and a route to the next step.</li><li><strong>The clinical reviewer checks the medicine:</strong> accuracy, boundaries, important qualifications and whether the page could mislead someone about diagnosis or treatment.</li><li><strong>The page owner maintains it:</strong> review dates, broken links, outdated service details and changes that require another clinical check.</li></ul>
<p>One person may hold more than one role, but the checks still need to happen. A writer should not invent clinical detail to fill a gap; a clinician should not have to reverse-engineer the page’s purpose from a draft.</p>
<h2>Make the review visible and specific</h2>
<p>For health information, readers should be able to understand who created the page and who reviewed it, when that review happened, and which sources support important claims. Use real names and credentials only with permission and verification. If a page has no qualified reviewer, do not label it clinically reviewed.</p>
<p>A review date is useful only if somebody actually checked the page on that date. Do not update dates just to make a page look new.</p>
<h2>Write for the question before the keyword</h2>
<p>Suppose a visitor asks, “Do you offer this service at your Ikeja branch, and how do I book?” A generic page about the importance of healthcare will not answer. A useful page states what the clinic offers at that location, identifies the correct contact route, and says whether the request is confirmed or still needs a call back.</p>
<p>For medical education, keep the boundary equally clear: explain what the clinic can responsibly explain, point to reliable sources, and tell readers how to contact a qualified professional for personal advice. Do not turn a marketing page into a substitute consultation.</p>
<h2>Where AI tools can help, and where they stop</h2>
<p>AI can help organise interview notes, propose a plain-language structure or flag jargon for review. It cannot supply the clinic’s real service facts, approve a clinical claim or take responsibility for errors. A polished paragraph is not evidence that its statements are correct.</p>
<p>Google’s people-first guidance asks whether content shows effort, originality and accuracy, with especially strong expectations for health topics. It also warns against publishing scaled summaries that add little value. For FJMK, the practical test is simple: can the clinic point to a real person and a real process behind each important claim?</p>
<p class="article-source">Further reading: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content">Google’s guidance on helpful, reliable, people-first content</a>.</p>
<h2>A publication check that catches the common failures</h2>
<ol><li>Can the reader identify the page’s author or responsible organisation?</li><li>Is the medical content reviewed by the right clinician?</li><li>Are service, location and booking facts confirmed by the clinic?</li><li>Does the page answer its title directly?</li><li>Is there a clear owner and reason to review it again?</li></ol>
<p>If any answer is no, the page is not ready just because it is grammatically finished.</p>`
  },
  {
    slug: 'clinic-on-google-maps-guide',
    title: 'How Do I Add My Clinic to Google Maps?',
    cardDescription: 'How to claim a real clinic profile, verify it and keep its details consistent with the clinic website.',
    category: 'Local search',
    description: 'Add or claim a clinic through Google Business Profile, verify that you represent it and use accurate real-world details for its name, address and services.',
    keyword: 'how to add a clinic to Google Maps',
    body: `
<p class="blog-article-answer"><strong>Short answer:</strong> Search for the clinic on Google Maps first. If its profile already exists, claim it or request access. If it does not, create a Google Business Profile, enter the clinic’s real-world details and complete the verification Google offers.</p>
<p>A Maps listing is not a substitute for a useful clinic website. The listing helps a person find the clinic and check basic facts; the website should confirm the services, location and next step in more detail. When those sources disagree, a prospective visitor has to guess which is current.</p>
<h2>Before creating a profile, check for an existing one</h2>
<ol><li>Search the clinic’s real name and area in Google Maps.</li><li>Open any likely match and check its address, phone and website.</li><li>If it is the correct profile, use Google’s claim or request-access process.</li><li>Create a new profile only if the clinic does not already have one.</li></ol>
<p>Google’s own instructions cover adding or claiming a profile and the verification options available for the account. The clinic should retain ownership of its profile; staff or an agency can be granted access without making a personal account the permanent owner.</p>
<h2>Use the clinic’s actual information</h2>
<ul><li><strong>Name:</strong> Use the name patients see on the clinic’s signage and real-world materials. Do not add service keywords or a neighbourhood to the name unless they are genuinely part of it.</li><li><strong>Address:</strong> Show a location where the clinic actually receives patients. Do not use a virtual office or another business’s address.</li><li><strong>Category:</strong> Choose the closest accurate primary category, then add relevant categories only where they truly describe the business.</li><li><strong>Hours:</strong> Keep public-facing hours accurate, including changes and appointment-only arrangements.</li><li><strong>Phone and website:</strong> Use a number the clinic controls and answers, and link to a page that represents that clinic or branch.</li><li><strong>Services:</strong> List only services the clinic currently provides at that location.</li></ul>
<p>For multiple branches, each profile and landing page must describe a real location with its own correct contact and visit details. Do not multiply profiles or location pages just to cover more map searches.</p>
<h2>What helps a clinic appear in local results?</h2>
<p>Google says local results are mainly based on relevance, distance and prominence. A complete profile can help Google understand what the clinic does; distance depends on the searcher’s location; prominence can reflect how well-known the business is, including information and links from around the web and review signals.</p>
<p>This means no agency can promise a clinic the top map position. Accurate details remove avoidable confusion, but a clinic cannot control where every searcher is or how Google orders results.</p>
<h2>Make the profile and website agree</h2>
<p>Check the clinic name, address, phone, service wording and opening details on the profile against the website. Link to the most relevant page, not always the homepage: a branch page or service page may answer the visitor’s next question more directly.</p>
<p>After verification, review the profile periodically. If the clinic changes address, phone, hours or services, update both places. Do not add a city to the business name or collect fake reviews as a shortcut; Google prohibits misleading profile information and incentivised reviews.</p>
<p class="article-source">Official steps: <a href="https://support.google.com/business/answer/2911778">add or claim a Business Profile</a>; <a href="https://support.google.com/business/answer/7091">understand local ranking factors</a>; <a href="https://support.google.com/business/answer/3038177">follow Google’s business representation guidelines</a>.</p>
<h2>A simple monthly check</h2>
<p>Open the profile as a visitor. Can you confirm the right clinic, correct branch, current hours, working phone number and useful website page? Then check that the same facts appear on the site. This basic consistency check is more defensible than adding keywords to the business name.</p>`
  },
  {
    slug: 'why-visitors-dont-book-appointments',
    title: 'Why Is My Clinic Website Getting Visitors but No Bookings?',
    cardDescription: 'A five-point check for the gap between arriving on a clinic site and making a real enquiry.',
    category: 'Websites',
    description: 'When a clinic site gets visits but few enquiries, check search intent, service clarity, trust, contact friction and what happens after a request.',
    keyword: 'clinic website visitors but no bookings',
    body: `
<p class="blog-article-answer"><strong>Short answer:</strong> A visit can fail to become an enquiry when the page does not match the search, leaves service questions unanswered, gives too little confidence, hides the contact route or sends a request into an unmonitored inbox. Check those five handoffs before buying more traffic.</p>
<p>“We need more traffic” is an easy diagnosis because traffic is visible. The missing step is often harder to see: what did the visitor expect to find, and what did the website make them do next?</p>
<p>FJMK’s practical lens is the handoff from discovery to response. A site is not finished when the button works. Someone must receive the enquiry, know what to do with it and follow up within a clear timeframe. That is a workflow question as much as a design question.</p>
<h2>Check these five failure points</h2>
<h3>1. The page does not match the search</h3>
<p>A person searching for a specific service may land on a homepage with only a broad list of departments. Give important services a page that says what is offered, where it is available and how to enquire. Do not send every search to the same generic page.</p>
<h3>2. The page names a service but does not explain it</h3>
<p>People may still need to know which clinician provides it, whether it is offered at this branch, what the first visit involves, or whether they need to call first. Add only the practical information the clinic can verify.</p>
<h3>3. The next step is hard to find or unclear</h3>
<p>Make phone, WhatsApp, appointment request or booking routes visible on mobile. Label the action honestly. “Request an appointment” should explain who will respond and when; it should not imply a confirmed time if the clinic still needs to call back.</p>
<h3>4. The site asks for trust without showing its basis</h3>
<p>Use accurate clinician information, real clinic details and clear service descriptions. Avoid stock promises, invented testimonials, unverified outcomes or credentials that the clinic cannot support. More claims do not necessarily create more confidence.</p>
<h3>5. The enquiry has no reliable owner</h3>
<p>Test the route from submission to reply. Who receives it? What happens outside office hours? Is there a backup if a staff member is away? A well-designed form that nobody checks is a broken booking route.</p>
<h2>Run a short test before changing the design</h2>
<ol><li>On a phone, search for one service the clinic provides.</li><li>Open the page a new visitor is most likely to reach.</li><li>Find the service details, location and contact route without asking for help.</li><li>Submit a test enquiry only through an authorised internal process.</li><li>Record who receives it and how long a real reply takes.</li></ol>
<p>Separate the evidence. Search Console can show whether pages earn impressions and clicks. Website analytics can show which page or action visitors use if analytics is configured. The clinic’s enquiry log can show whether requests were answered. None of those metrics alone explains the whole journey.</p>
<p>A technical first-page check can flag observable HTML and header signals such as page titles, contact links and mobile viewport settings. It does not measure rankings, render the page as a browser, or establish why a visitor did not book.</p>
<h2>What should the clinic fix first?</h2>
<p>Fix the earliest broken handoff you can verify. If people do not see the relevant service page in search, work on discoverability and page relevance. If they arrive but cannot find the contact route, make the action clearer. If enquiries arrive but receive no reply, fix ownership and response handling before redesigning the page.</p>
<p>That order prevents a common waste: sending more people to a route the clinic cannot yet complete.</p>`
  },
  {
    slug: 'how-businesses-appear-in-chatgpt-answers-geo',
    title: 'How Can a Clinic Appear in AI Search Answers?',
    cardDescription: 'What clinics can control for AI-assisted search, and what no website can promise.',
    category: 'Search',
    description: 'Clinics cannot guarantee AI citations. Make important pages crawlable, accurate, specific and useful, then keep Business Profile facts current.',
    keyword: 'how can a clinic appear in AI search answers',
    body: `
<p class="blog-article-answer"><strong>Short answer:</strong> A clinic cannot guarantee that ChatGPT, Google AI Overviews or another system will mention it. For Google’s AI features, Google says the usual search fundamentals apply: pages must be indexable, useful, clear and supported by accurate business information. There is no special AI schema or file that guarantees a citation.</p>
<p>Start with facts a patient can verify: the clinic’s actual services, the people providing them, the locations where they operate and the route for a safe enquiry. Clear, consistent information gives both readers and search systems fewer gaps to fill.</p>
<h2>Start with what the clinic controls</h2>
<ol><li><strong>Make the page discoverable.</strong> Link to it from the site, include it in the sitemap when it is an important canonical page and allow crawling.</li><li><strong>Answer one real question well.</strong> Put the direct answer near the top, then explain limits, process and the practical next step.</li><li><strong>Use specific, consistent facts.</strong> The clinic’s service, branch, clinician and contact details should agree across its website and Business Profile.</li><li><strong>Show who is responsible.</strong> Use accurate authorship and clinical review information for health content. Cite reliable sources for claims that need support.</li><li><strong>Keep the page useful after publication.</strong> Correct details when they change; do not change dates unless the content was materially reviewed.</li></ol>
<h2>Do not mistake formatting for authority</h2>
<p>Headings, short answers and lists make a page easier to scan. They do not make a generic summary original. The valuable part is the clinic-specific information or the clearly owned point of view that another page cannot supply.</p>
<p>At FJMK, the perspective we can responsibly own is the link between healthcare information and the next action: a service must be clear, the clinic’s details must be credible, and the contact path must work for the team behind it. We can show that through our design decisions and tools; we should not present fictional concepts as client results.</p>
<h2>What the evidence does and does not say</h2>
<p>Google’s current guidance says its AI Search features use the same core SEO and quality systems, and that meeting the technical requirements does not guarantee crawling, indexing or serving. It specifically says no extra technical requirements or special schema are needed for AI Overviews or AI Mode.</p>
<p>The LinkedIn/Meltwater research you supplied reports patterns in a large sample of B2B AI citations, including the value of original expert voices and clear structure. That is useful as a publishing hypothesis for LinkedIn. It is not a Google ranking study, a healthcare search study or a promise that posting at a particular frequency will produce citations for FJMK.</p>
<p>So avoid buying “AI ranking” tactics built around keyword stuffing, mass-produced FAQ pages, invented expert biographies or special markup. Publish only when the page will help a real person who finds it.</p>
<p class="article-source">Further reading: <a href="https://developers.google.com/search/docs/appearance/ai-features">Google’s guidance on AI features and your website</a> and <a href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide">Google’s guide to generative AI features in Search</a>.</p>
<h2>A realistic measurement plan</h2>
<p>Use Search Console to see whether the page is indexed and whether it earns impressions or clicks in ordinary web search. Google includes AI feature traffic in the Web performance report; the report does not label each visit as an AI Overview citation. For other AI platforms, visibility and referral measurement varies. Keep the claim proportionate to what the data actually shows.</p>
<p>For FJMK, the starting point is still to get the active pages crawled and build a baseline. AI visibility is a possible outcome of useful, findable work, not a separate publishing system.</p>`
  },
  {
    slug: 'reviews-and-patient-decisions',
    title: 'How Should a Clinic Reply to a Negative Google Review?',
    cardDescription: 'A response approach that shows attention without exposing or confirming private patient information.',
    category: 'Reputation',
    description: 'A clinic should reply calmly, avoid confirming anyone’s patient status or sharing private details, and move individual concerns to a private channel.',
    keyword: 'how should a clinic reply to a negative Google review',
    body: `
<p class="blog-article-answer"><strong>Short answer:</strong> Acknowledge the feedback, keep the reply brief, do not confirm that the reviewer is or was a patient, and invite them to contact the clinic through a private, appropriate channel. Never publish personal or clinical details to defend the clinic in public.</p>
<p>A public review creates two conversations. One is with the person who wrote it. The other is with everyone deciding whether the clinic seems attentive and trustworthy. The reply has to respect both, while protecting the privacy of the person involved.</p>
<h2>A four-step response</h2>
<ol><li><strong>Acknowledge:</strong> Thank the reviewer for raising a concern without confirming a visit or treatment.</li><li><strong>Set a privacy boundary:</strong> Say that the clinic cannot discuss individual circumstances in a public reply.</li><li><strong>Offer a private route:</strong> Provide a suitable phone number or email monitored by someone who can investigate.</li><li><strong>Follow up internally:</strong> Check the issue through the clinic’s normal process and record what needs to change.</li></ol>
<p>A neutral template might read: “Thank you for sharing this feedback. We take concerns seriously, but we cannot discuss individual circumstances in a public forum. Please contact [role or department] through [private contact route] so the team can understand the concern.” Adapt it to the clinic’s real process; do not promise a result or response time the team cannot meet.</p>
<h2>What not to put in the reply</h2>
<ul><li>Do not confirm that the reviewer attended, received treatment or has a diagnosis.</li><li>Do not quote appointment details, records, dates or messages, even if the reviewer has included them first.</li><li>Do not accuse the reviewer of lying or disclose what the clinic thinks happened.</li><li>Do not offer a discount, gift or other incentive in exchange for changing or removing a review.</li><li>Do not ask only satisfied visitors for reviews or discourage negative feedback.</li></ul>
<p>Google says businesses may ask customers for honest reviews based on genuine experiences, but incentives and selectively soliciting positive reviews are prohibited. Google also recommends protecting privacy and moving complex concerns into a private channel.</p>
<h2>Is replying a shortcut to higher rankings?</h2>
<p>No reliable source supports treating a reply as a ranking trick. Google says local results are mainly based on relevance, distance and prominence; it notes that review count and positive ratings can contribute to prominence. Its review guidance says replies show that a business values feedback and help people understand how it responds. Those are useful reasons to reply, but they are not a guarantee of higher placement.</p>
<h2>Make the process work before a review arrives</h2>
<p>Choose who monitors reviews, which concerns need escalation and which private contact route is safe and staffed. Train that person not to confirm patient status in public. If a review appears to violate platform rules, use Google’s reporting process rather than arguing about it in the reply.</p>
<p>For a clinic, the strongest response is a calm public boundary followed by a real private follow-up. The reply cannot repair the underlying experience by itself; the clinic’s process has to do that work.</p>
<p class="article-source">Further reading: <a href="https://support.google.com/business/answer/3474122">Google’s tips for getting and responding to reviews</a>, <a href="https://support.google.com/business/answer/7091">local ranking factors</a> and <a href="https://support.google.com/business/answer/7400114">prohibited and restricted content</a>.</p>`
  },
  {
    slug: 'how-many-lagos-clinics-have-a-website',
    title: 'How Many Clinics in Lagos Have a Website?',
    cardDescription: 'A search-derived review of website availability and phone usability across 20 Lagos local government areas.',
    category: 'Research',
    description: 'Public searches found no website candidate for 316 of 388 Lagos healthcare listings. See the area breakdown and phone-screen results.',
    keyword: 'how many clinics in Lagos have a website',
    author: { name: 'Dr Tolulope Ajidahun', jobTitle: 'Physician' },
    byline: 'Dr Tolulope Ajidahun · Physician, Lagos',
    body: fs.readFileSync('_tools/lagos-clinic-website-gap-body.html', 'utf8')
  }
];
