---
theme: seriph
colorSchema: light
title: The Properties of Good Software
info: |
  A shared vocabulary for building well-crafted systems.
  Reference: the-properties-of-good-software.md
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
---

# The Properties of Good Software

### A shared vocabulary for building well-crafted systems

<!--
Welcome everyone. Today we're going to introduce a shared language for talking about *how good software is built*.

Each property is a specific characteristic of your software — something you can plan for, measure, and address. So instead of "it's good" or "it's messy", you know exactly what's working, what's failing, and why.
-->

---
layout: center
class: text-center
---

# Have you ever shipped something that worked...
# ...but wasn't *good*?

<br>

- It was slow under load
- It was impossible to change without breaking something else
- A security issue made it to production
- It broke and nobody knew for hours

<!--
Ask this out loud. Give them 5 seconds of silence.

The goal today: give each of these a name — so we can plan for them, measure them, and argue precisely. Not just "it's messy."
-->

---
layout: center
---

# From vague to precise

<div class="grid grid-cols-2 gap-8 mt-8 max-w-3xl mx-auto">
  <div class="border rounded-lg p-5 opacity-60">
    <div class="text-red-500 font-bold mb-4">What we say</div>
    <div class="text-sm mb-2 italic">"Make it more robust"</div>
    <div class="text-sm mb-2 italic">"It needs to be secure"</div>
    <div class="text-sm mb-2 italic">"The code is messy"</div>
    <div class="text-sm italic">"It's too slow"</div>
  </div>
  <div class="border-2 border-green-500 rounded-lg p-5">
    <div class="text-green-600 font-bold mb-4">What we should say</div>
    <div class="text-sm mb-2"><strong>Reliability</strong> — it recovers from failures automatically</div>
    <div class="text-sm mb-2"><strong>Security</strong> — no critical CVEs in dependencies; all endpoints verify authorization</div>
    <div class="text-sm mb-2"><strong>Maintainability</strong> — a new dev can contribute within a week</div>
    <div class="text-sm"><strong>Performance</strong> — page loads under 2s; API responses under 200ms</div>
  </div>
</div>

<!--
We all care about quality. The problem is we don't have a precise, shared language for it.

"Make it more robust" — what do you actually change? What do you measure? Without precision, these are just vibes.

On the right: the same concerns, but each one has a name and a clear meaning. These are properties — and each one can be planned for, measured, and improved over time.

That's what we're building today — a shared vocabulary. Later we'll get into the specific metrics for each property.
-->

---

# 18 Properties — 6 Groups

| Group | Theme | Properties |
|-------|-------|------------|
| 1 | Reliability & Correctness | Correctness, Reliability, Availability, Data Integrity |
| 2 | User Experience | Usability, Performance |
| 3 | Security & Trust | Security, Privacy, Auditability |
| 4 | Architecture | Modularity, Extensibility, Interoperability, Portability |
| 5 | Engineering Excellence | Maintainability, Testability, Deployability |
| 6 | Scale & Operations | Scalability, Observability |

<!--
18 properties. Each one could be its own 2-hour session.

We're not going deep on all of them today. We're building the map — so we know what exists, what each one means, and how to talk about them.

The groups are thematic. A property can appear in more than one group when it genuinely belongs to both — for example, Performance is in both User Experience and Scale & Operations.

The reference document has full depth on every property: what it includes, where it belongs in the SDLC, how to measure it, how to master it.
-->

---

# Today's Agenda

<div class="grid grid-cols-3 gap-6 mt-8">
  <div class="border rounded-lg p-5">
    <div class="text-3xl mb-3">🔍</div>
    <div class="font-bold text-lg">Deep Dive</div>
    <div class="text-sm text-gray-500 mb-3">8 properties</div>
    <div class="text-sm">Definition · Key concepts · Real example · Your turn</div>
  </div>
  <div class="border rounded-lg p-5">
    <div class="text-3xl mb-3">⚡</div>
    <div class="font-bold text-lg">Quick Pass</div>
    <div class="text-sm text-gray-500 mb-3">10 properties</div>
    <div class="text-sm">Definition · One key insight · SDLC placement</div>
  </div>
  <div class="border rounded-lg p-5">
    <div class="text-3xl mb-3">🎯</div>
    <div class="font-bold text-lg">The Framework</div>
    <div class="text-sm text-gray-500 mb-3">~15 min</div>
    <div class="text-sm">How to pick what matters for your project</div>
  </div>
</div>

<br>

> Quick pass doesn't mean unimportant — the reference doc has full depth on every property.

<!--
We have about 2.5 hours together. There will be a break after Group 3.

For deep-dive properties: I'll give the definition and key concepts, share what I've seen in IDM or Central, then ask you — "Have you seen this? Where?"

For quick-pass: I give the definition and one key insight. Questions go to the end or to the reference doc.

The last 15 minutes is the most important part: we'll talk about how to pick which properties to focus on per project, and what this means for our definition of done.
-->

---
layout: section
---

# Group 1 — Reliability & Correctness

> Does the system do what it's supposed to, consistently?

---

# Correctness

> The system produces the right output for every valid input.

<br>

- **Input validation** — reject or handle invalid inputs gracefully
- **Business logic accuracy** — the core rules are implemented exactly as specified
- **Edge case handling** — boundary values, empty inputs, concurrent operations behave correctly

<br>

📍 **SDLC:** Requirements · Design · Development

🔴 **Red flag:** Bugs repeatedly found in production for the same component

<!--
SPEAKER NOTES — SLIDE A

Start with a question: "What happens when the system does the wrong thing?" Let them answer mentally.

For IDM, an incorrect authorization check isn't just a bug — it's a security incident. A user sees data they shouldn't. Correctness has consequences that vary by domain.

KEY INSIGHT: Correctness is a DESIGN and REVIEW activity, not a testing activity. Tests can only verify what you thought to test. If you didn't think of the edge case, the test doesn't exist.

Contract design: for every function, define what goes in, what comes out, what errors are possible. The implementation must honor that contract. This is the foundation of correct software.

Boundary analysis: the most common correctness bugs live at: the empty list, the zero value, the maximum integer, the concurrent write. Identify these as part of design, not discovery during testing.

Defect density: bugs per KLOC. A trend, not an absolute. If the same component keeps producing bugs, that's a correctness debt signal.

Transition: "Let me show you where I've seen this matter most, then I want to hear from you."
-->

---
layout: two-cols
---

# Correctness — In Practice

::left::

**What I've seen (IDM)**

Authorization logic correctness has security consequences, not just functional ones — an incorrect access check is a direct breach.

The fix isn't more tests. It's:
1. Precise acceptance criteria before coding
2. Contract-first design (define the check before implementing it)
3. Code review focused on logic, not style

::right::

**Your turn** 💬

Have you encountered a correctness failure that had consequences beyond a simple "wrong answer"?

- Where in the system?
- Was it an unclear spec, an untested edge case, or something else?

<!--
SPEAKER NOTES — SLIDE B (Discussion)

Wait for responses. Don't rush. This is the interaction point.

If nobody speaks, prompt: "Think about a bug you fixed in the last 6 months. Was it a logic error? Did the spec cover that case?"

Guide the discussion toward: correctness failures usually trace back to unclear requirements or untested edge cases — not careless coding.

Key takeaway to land: "Correctness is owned at requirements and design, not rescued at testing."

Time: aim for 2-3 minutes of discussion, then move on.
-->

---

# Reliability / Resilience

> The system works consistently and degrades gracefully when unexpected things happen.

<br>

- **Circuit breaker pattern** — stop calling a failing dependency; don't let failures cascade
- **Retry logic** — transient failures retried with backoff; permanent failures are not retried
- **Graceful degradation** — return partial results rather than complete failure

<br>

📍 **SDLC:** Requirements · Design · Development · Deployment

🔴 **Red flag:** Incidents caused by a dependency failure that could have been circuit-broken

<!--
SPEAKER NOTES — SLIDE A

The key distinction: reliability isn't about never failing. It's about failing well.

The Circuit Breaker pattern: when a dependency is consistently failing, STOP calling it. The circuit "opens" — subsequent calls fail fast. Occasional "half-open" probes check if the dependency recovered. When it does, the circuit "closes" again. This prevents one failing service from cascading into a full system outage.

MTBF (Mean Time Between Failures) and MTTR (Mean Time to Recovery) are the core metrics. Most teams track MTTR because it's actionable.

The most important reliability insight: MOST RELIABILITY FAILURES ARE DESIGN FAILURES. A system not designed for failure cannot be made reliable by testing alone.

Bulkhead pattern: isolate failure domains so a failure in one doesn't drain shared resources (thread pools, connection pools) from others. Like a ship: one flooded compartment doesn't sink the ship.

Transition: "Here's what reliability looks like in our codebase."
-->

---
layout: two-cols
---

# Reliability — In Practice

::left::

**What I've seen (IDM + Central)**

When a connector target system fails, the failure is isolated — other connectors and the rest of IDM keep running.

Transient failures trigger retries before surfacing as errors. Modules operate within error boundaries so one failing part doesn't bring down others.

::right::

**Your turn** 💬

Have you experienced a cascading failure — where one thing going down took down something else that shouldn't have been affected?

- What was the dependency chain?
- Was there a circuit breaker? Should there have been?

<!--
SPEAKER NOTES — SLIDE B (Discussion)

Cascading failures are often the most damaging production incidents. One service goes down, every service that depends on it starts timing out, thread pools fill up, the whole system grinds to a halt.

If nobody has examples, prompt: "Have you ever had a feature go down because a database was slow, even though the feature didn't need fresh data?"

Key insight to land: the question to ask in design is — "What happens if THIS specific dependency is slow? What happens if it returns an error? What happens if it's completely unreachable?" These answers must be in the code, not improvised during an incident.
-->

---

# Availability

> The system is operational and accessible when users need it.

<br>

| SLA | Downtime/year | Downtime/month |
|-----|:---:|:---:|
| 99% | 87.6 hours | 7.3 hours |
| 99.9% | 8.76 hours | 43.8 minutes |
| 99.99% | 52.6 minutes | 4.4 minutes |

<br>

- **SLI** (what you measure) → **SLO** (your target) → **SLA** (your commitment)
- Zero-downtime deployments are an availability requirement, not a nice-to-have

📍 **SDLC:** Requirements · Deployment · Operations

🔴 **Red flag:** No defined SLO for any product

<!--
SPEAKER NOTES — QUICK PASS

Availability is the outcome. Reliability is how you achieve it.

The SLI/SLO/SLA framework:
- SLI: the actual measurement (e.g., % of requests that succeed)
- SLO: your internal engineering target (e.g., 99.9% success rate)
- SLA: the contractual commitment to customers — usually looser than the SLO (the SLO is your safety buffer)

The table is humbling. 99.9% sounds good but it's 43 minutes of downtime per month. For a product customers depend on daily, that matters.

The most important shift: every product should have a defined SLO. Without one, there's no way to know if you're meeting customer expectations.

Deployment strategies for zero-downtime: blue-green (two environments, instant switch), canary (small % of traffic first), rolling (replace instances one at a time). Schema migrations are the most common source of deployment downtime — use the expand/contract pattern.
-->

---

# Data Integrity

> Data remains accurate, consistent, and trustworthy throughout its lifecycle.

<br>

- **ACID transactions** — Atomicity, Consistency, Isolation, Durability
- **Idempotency** — processing the same event twice produces the same result
- **Referential integrity** — no orphaned records, valid foreign key relationships

<br>

📍 **SDLC:** Design · Development

🔴 **Red flag:** "We can't trust the data in this table"

<!--
SPEAKER NOTES — QUICK PASS

The key distinction from Correctness: Correctness is about system behavior. Data Integrity is about the data itself.

ACID: Atomicity = all-or-nothing. If a transaction updating 5 records fails on record 3, records 1 and 2 must be rolled back. Consistency = valid state before and after. Isolation = concurrent transactions don't interfere. Durability = committed data survives failures.

Idempotency is critical in distributed systems. If you process an event twice (which happens with retries), the result must be the same as processing it once. Design for this from the start.

IDM example: changing an MV Attribute affects several records and must succeed or fail atomically. A partial update leaves the system in an inconsistent state — which can cause incorrect access decisions downstream.

The "we can't trust this table" red flag is serious. When engineers stop trusting the data, they add workarounds. Workarounds create more inconsistencies. The debt compounds.
-->

---
layout: section
---

# Group 2 — User Experience

> Is the system good to use?

---

# Usability

> How easy, efficient, and satisfying it is for users to achieve their goals.

<br>

- **Learnability** — can a new user figure it out without training or documentation?
- **Error prevention & recovery** — stop mistakes before they happen; help recovery when they do
- **Accessibility (a11y)** — WCAG 2.1 AA: 4.5:1 contrast ratio, keyboard nav, screen readers

<br>

📍 **SDLC:** Requirements · Design · Testing

🔴 **Red flag:** Users requesting training for basic tasks

<!--
SPEAKER NOTES — SLIDE A

Usability is often treated as a UX/design problem. It's not — engineers contribute to usability or degrade it with every PR they write.

Nielsen's 10 Heuristics are a practical checklist for design reviews. The most impactful:
1. Visibility of system status — does the user always know what's happening? (loading states, confirmations)
2. User control and freedom — can users undo? Can they escape?
3. Error prevention — does the UI stop users from making mistakes?
4. Consistency — does the same action always produce the same result?

Accessibility isn't optional for enterprise products. WCAG 2.1 Level AA is the standard. Practically:
- 4.5:1 contrast ratio for normal text
- All interactive elements are keyboard-navigable
- ARIA labels on non-standard elements
- Focus indicators visible

The engineer's role: implement what designers specify, don't degrade it, and catch a11y issues in code review.

SUS score (System Usability Scale) is a simple 10-question survey giving a 0-100 score. Under 68 is below average. Simple to run after any user testing session.

Transition: "Let me share the most common engineering contributions to usability failures."
-->

---
layout: two-cols
---

# Usability — In Practice

::left::

**What I've seen**

The most common engineering contributions to usability failures:

- Missing loading states — user doesn't know if the system is working
- Cryptic error messages — "Error 500" instead of "We couldn't save your changes — please try again"
- Keyboard traps in modals — focus doesn't return after closing

::right::

**Your turn** 💬

Think about a UI you've built or used recently.

- Was there a moment where a user was confused about what the system was doing?
- Was there an error message that didn't actually help?
- Could you navigate it entirely by keyboard?

<!--
SPEAKER NOTES — SLIDE B (Discussion)

The goal isn't to make engineers UX designers. It's to make engineers aware that their implementation decisions affect usability directly.

Prompts if discussion is slow:
- "Have you ever shipped a feature without a loading state? What did users see?"
- "Have you ever seen a form that let users submit invalid data silently?"
- "Has an a11y audit ever flagged something in your code?"

Key takeaway: usability is tested with real users, not by engineers checking their own work. Five users, real tasks, observe without intervening or explaining. You'll see failures you never imagined.

The design handoff contract: engineers implement what designers specify. If you deviate because "it's faster to code differently," you're degrading usability. Flag it as a tradeoff, don't silently diverge.
-->

---

# Performance

> How fast and efficient the system is — for users and for infrastructure.

<br>

- **Response time targets** — page load under 2s · API responses under 200ms
- **Don't measure averages — measure worst cases** — if 99 users get 50ms and 1 gets 5 seconds, the average looks fine but someone had a terrible experience
  - **p50** — the median; half of requests are faster than this
  - **p95** — 95% of requests are faster; this is your near-worst case
  - **p99** — only 1 in 100 requests is slower than this; your true worst case
- **Cache hit rate** — how often data is served from cache vs database

<br>

📍 **SDLC:** Requirements / Design · Development · Testing

🔴 **Red flag:** most users are fast but some requests are consistently 10–100× slower

<!--
SPEAKER NOTES — QUICK PASS

Performance has two perspectives: user-facing (how fast does it feel?) and system-level (how efficiently does it use resources?). Both matter.

Averages are misleading. If 99 users get a 50ms response and 1 user waits 5 seconds, the average is about 100ms — looks fine in a dashboard, but that one user had a broken experience. You want to know about the slow outliers.

That's what percentiles give you — rank all your requests by response time and ask: what does the slowest 1% look like? That's your real worst case.

Practical targets: page loads under 2 seconds, API calls under 200ms. These are good starting benchmarks, but the right numbers depend on your product.

Profile before optimizing. "The database is slow" isn't actionable. "This query does a full table scan because it's missing an index" is.

IDM example: inbound sync was identified as too slow through benchmarking. Profiling pinpointed specific bottlenecks, and targeted refactoring brought it to an acceptable level. No guessing.

Database indexing is the single highest-ROI performance skill for backend engineers.
-->

---
layout: section
---

# Group 3 — Security & Trust

> Is the system safe and accountable?

---

# Security

> Protection against unauthorized access, misuse, and malicious attacks.

<br>

- **Authentication & Authorization** — who can log in, what they can do (RBAC/ABAC)
- **OWASP Top 10** — Injection · Broken Access Control · XSS (know the attack, not just the name)
- **Secrets management** — credentials never in code, git history, or logs

<br>

📍 **SDLC:** Requirements · Design · Development · Testing · Operations

🔴 **Red flag:** Secrets in git history · No SAST in CI · Critical CVEs older than 30 days

<!--
SPEAKER NOTES — SLIDE A

Security is not a feature you add at the end. It is a property you design for from the beginning.

OWASP Top 10 — the three most critical to know in practice:
1. Injection (SQL, command) — parameterized queries, never string concatenation. Ever.
2. Broken Access Control — verify authorization at EVERY endpoint SERVER-SIDE. The UI hiding a button is not authorization. This is the most common failure I see.
3. XSS — escape all output, use Content Security Policy headers

STRIDE threat modeling: for any feature, ask:
- Who could Spoof identity?
- What could be Tampered with?
- What could be Repudiated (denied)?
- What Information could be Disclosed?
- How could Denial of Service occur?
- How could Elevation of Privilege happen?

For IDM specifically: SAST runs in CI on every build. OAuth 2.0 and OIDC knowledge is non-negotiable — know how access tokens and refresh tokens work, what JWTs contain, and the common JWT vulnerabilities (alg:none, weak signing secrets, missing expiry validation).

The 30× rule: a security vulnerability found in design costs 30× less to fix than one found in production.

Principle of least privilege: every service account, component, and user should have exactly the permissions needed — nothing more. Over-privileged systems turn small breaches into large ones.
-->

---
layout: two-cols
---

# Security — In Practice

::left::

**What I've seen (IDM)**

SAST checks run in the CI/CD pipeline on every build, catching security issues before they reach production.

Authorization logic correctness is a security concern — an incorrect access check is not a bug, it's a breach.

The most dangerous misconception: *"we can add security later."*

::right::

**Your turn** 💬

- Have you ever found a security issue during code review that would have reached production without it?
- Has a dependency ever had a CVE you didn't know about until it was flagged?
- Have you run a threat model on a feature before building it?

<!--
SPEAKER NOTES — SLIDE B (Discussion)

This is one of the most important discussions in the session. Security debt is the most expensive debt to pay.

If nobody has examples, share: "The most common security failure I see is authorization checks that live only in the UI. The API endpoint doesn't verify. An attacker bypasses the UI entirely."

JWT vulnerabilities to be aware of:
- alg:none attack — a malformed JWT claims no signature is needed
- Weak signing secret — brute-forceable
- Missing expiry validation — tokens that never expire

Key message: security is a shared responsibility. It doesn't belong only to a security team or to the most senior engineer. Every PR is a security review opportunity.

After discussion: announce the break.
-->

---

# Privacy

> Personal data is collected, stored, and used in ways that respect user rights.

<br>

- **Data minimization** — collect only what you need; use it only for what you said
- **Right to erasure** — users can request deletion (GDPR, 30-day window)
- **PII handling** — never in logs; anonymized in non-production environments

<br>

📍 **SDLC:** Requirements · Design · Development

🔴 **Red flag:** PII visible in log files

<!--
SPEAKER NOTES — QUICK PASS

Security keeps data safe from unauthorized access. Privacy ensures data is used appropriately even by authorized parties.

GDPR's core principles in plain terms:
- Collect only what you need (minimization)
- Use it only for what you said (purpose limitation)
- Delete it when you no longer need it (storage limitation)
- Honor requests to access or delete it (data subject rights — 30-day response window)

Privacy by Design: privacy is built in from the start. The practical question in every design: "what personal data does this feature touch, and does it actually need to?"

Anonymization vs pseudonymization:
- Anonymized: permanently stripped of all identifying info — no longer personal data under GDPR
- Pseudonymized: identifying fields replaced with tokens, but mapping exists — still personal data

Engineer's practical rule: never log PII. Mask or omit email addresses, names, IDs, locations from all logs. Use synthetic data in development.
-->

---

# Auditability / Compliance

> The system records a verifiable, immutable history of who did what, when.

<br>

- **Audit log fields** — actor · action · resource · timestamp (UTC) · outcome · source
- **Immutability** — logs cannot be modified after writing (append-only, WORM storage)
- **Not the same as Observability** — different audience, purpose, retention, and access control

<br>

📍 **SDLC:** Requirements · Design · Development

🔴 **Red flag:** "We don't know who made this change"

<!--
SPEAKER NOTES — QUICK PASS

Observability helps engineers understand system behavior. Auditability provides evidence for compliance, legal proceedings, and accountability.

The critical distinction:
|               | Observability     | Auditability          |
|---------------|-------------------|-----------------------|
| Audience      | Engineers         | Legal, compliance     |
| Purpose       | Debug             | Prove what happened   |
| Retention     | Days/weeks        | Months/years          |
| Access        | Engineering team  | Restricted            |

Audit logs stored in the same database they audit can be tampered — a compromised database can cover its own tracks. Separate storage with immutability guarantees is required.

IDM example: audit logs record every change — who made it, what entity was affected, and when. This is a first-class feature, not an afterthought.

SOC 2 and ISO 27001 are the compliance frameworks enterprise customers ask about. Know what they require at a conceptual level.

Non-repudiation: the guarantee that a user cannot plausibly deny having performed an action. Requires both the audit log and the authentication mechanism to be trustworthy.
-->

---
layout: center
class: text-center
---

# ☕ 5-Minute Break

### We're halfway through the properties.

### Back in 5 minutes for Groups 4–6 + the framework.

<!--
Hard stop. 5 minutes.

When you return, we'll cover Architecture, Engineering Excellence, and Scale & Operations — then the framework for applying all of this to your specific projects.

The framework section at the end is the most actionable part — it's worth staying fresh for.
-->

---
layout: section
---

# Group 4 — Architecture

> Is it well-designed for change, growth, and integration?

---

# Modularity

> The system is divided into distinct, loosely coupled components with clear boundaries.

<br>

- **Low coupling** — components depend on each other as little as possible
- **High cohesion** — things that change together are grouped together
- **Single Responsibility** — if you describe a component and the description includes "and", it has too many responsibilities

<br>

📍 **SDLC:** Design · Development

🔴 **Red flag:** "You have to understand the whole system to change any part"

<!--
SPEAKER NOTES — QUICK PASS

The modularity smell: when adding a small feature requires understanding and modifying many unrelated modules — that's a coupling failure.

High cohesion means things that belong together (because they change for the same reason) are grouped. Low cohesion shows up when a module contains unrelated functionality — it's doing too many jobs.

DDD concepts worth knowing: Bounded Context (each module has its own model — the same word can mean different things in different contexts), Ubiquitous Language (code reflects domain vocabulary).

Dependency injection: when a class creates its own dependencies internally (new DatabaseConnection()), it's tightly coupled to that implementation. When it receives them from outside (constructor injection), it can use any implementation — including test doubles.

IDM example: built with hexagonal architecture (ports and adapters). The core domain is isolated from infrastructure. Databases, connectors, and external systems connect through ports. The core doesn't depend on them.

Circular dependency count should be zero. SonarQube can measure coupling metrics.
-->

---

# Extensibility

> New capabilities can be added without modifying existing, working code.

<br>

- **Open/Closed Principle** — open for extension, closed for modification of stable code
- **Strategy pattern** — encapsulate algorithms behind an interface; swap at runtime
- **Plugin / SPI** — define a contract; extensions implement it; core discovers them

<br>

📍 **SDLC:** Design · Development

🔴 **Red flag:** "Every time we add a new X, we have to change code in 15 places"

<!--
SPEAKER NOTES — QUICK PASS

Extensibility is different from Modularity: modularity is about structure, extensibility is about growth.

The Open/Closed Principle in practice: you can add new behavior by implementing an interface, without touching the existing, tested code. The skill is identifying which behaviors are likely to vary and designing those as extension points.

IDM example: connectors are developed as completely separate projects implementing a defined interface. Adding a new connector requires ZERO changes to IDM's core codebase. This is extensibility in practice.

Key patterns:
- Strategy: encapsulate algorithms behind an interface, swap at runtime without modifying the caller
- Observer/Event: components react to events without being coupled to the emitter
- Plugin/SPI: define a contract, discover implementations dynamically

Warning: every extension point is an abstraction that adds complexity. Design them for extensions you KNOW are coming, not hypothetical future requirements. Premature extensibility is its own form of technical debt.

API versioning: semantic versioning (major.minor.patch). Breaking change = removing a field, changing a type, removing an endpoint. Additive-only changes (adding new fields) are safe.
-->

---

# Interoperability

> The system communicates effectively with other systems using well-defined interfaces.

<br>

- **API-first design** — write the OpenAPI spec before the implementation
- **Standard protocols** — OAuth 2.0/OIDC (identity) · gRPC/REST (APIs) · AMQP/Kafka (events)
- **Contract testing** — verify producer and consumer agree on the interface

<br>

📍 **SDLC:** Requirements · Design · Development · Testing

🔴 **Red flag:** Breaking changes discovered in production by a consumer

<!--
SPEAKER NOTES — SLIDE A

For IDM, interoperability is a top-3 property. IDM is fundamentally an integration system — connectors, APIs, identity protocols.

API-first design: write the OpenAPI specification BEFORE writing any implementation. The contract defines what the API does. Both consumer and producer can work from it independently. Especially important when multiple teams are involved.

Consumer-driven contract testing: the consumer defines what it expects from the provider (which fields, which formats, which status codes). A test suite verifies the provider meets those expectations. Catches breaking changes before they reach production.

Standard identity protocols at a flow level:
- OAuth 2.0: how an application obtains delegated access on behalf of a user
- OIDC: how an application verifies who a user is (builds on OAuth 2.0)
- SAML 2.0: enterprise federation for SSO — XML-based, still widely used in enterprise

Integration patterns:
- Adapter: translate between two incompatible interfaces without modifying either
- Anti-Corruption Layer: protect your domain model from external system concepts
- API Gateway: single entry point — routing, auth, rate limiting

Event-driven integration: use async (webhooks, queues) when the caller doesn't need an immediate response, when you need to decouple availability, or when multiple consumers need the same event.

Transition: "Let me show you how we made protocol decisions in IDM."
-->

---
layout: two-cols
---

# Interoperability — In Practice

::left::

**What I've seen (IDM)**

gRPC was chosen for connector communication — it supports streaming over a single persistent connection, which fits the continuous sync pattern.

REST is used for the UI-facing API, matching the request-response model of browser clients.

*Protocol choice is driven by the integration pattern — not by familiarity.*

::right::

**Your turn** 💬

- Have you had to integrate with an external system that had a poorly designed or undocumented API?
- Have you been the provider of an API that a consumer found difficult to use?
- Has a breaking change ever surprised a downstream consumer in production?

<!--
SPEAKER NOTES — SLIDE B (Discussion)

This discussion often surfaces real war stories. Let them flow — these are exactly the experiences that motivate investment in interoperability.

Key insight to land: "We'll document the API later" is one of the most expensive sentences in software engineering. The consumer has to guess. The producer has to maintain undocumented behavior. Breaking changes are invisible until production.

If someone has an example of a difficult integration: dig into "Was there an OpenAPI spec? Was there a contract test?" The absence of these is the root cause, not the symptom.

Webhook vs polling: webhooks push events when they happen. Polling consumers check repeatedly. Webhooks are far more efficient at scale and simpler for consumers to implement.
-->

---

# Portability

> The system runs in different environments without significant rework.

<br>

- **Containerization** — Docker packages the system and all dependencies together
- **Config via environment** — everything that differs between environments comes from env vars, not code
- **Dev/prod parity** — development and production use the same database type, same OS, same config mechanism

<br>

📍 **SDLC:** Design · Development · Deployment

🔴 **Red flag:** "It works on my machine but not staging"

<!--
SPEAKER NOTES — QUICK PASS

"It works on my machine" is always a portability failure. The solution is environment parity and reproducible builds, not heroic debugging.

12-Factor App principles — the four most impactful for portability:
- Factor III: Config via environment — never hardcode environment-specific values in code
- Factor VI: Stateless processes — no session state in memory; any instance can serve any request
- Factor X: Dev/prod parity — development uses the same type of database, same OS, same config mechanism
- Factor IV: Backing services as attached resources — treat database/cache/queue as interchangeable

Infrastructure-as-Code: if you cannot recreate your entire environment from a git repository, it is not portable. Every infrastructure change goes through code review, not manual console changes.

All Vertowave projects are Dockerized — consistent behavior across local dev, CI, and production.

New developer onboarding time directly measures portability. If it takes 2 days to set up a development environment, that's a portability failure.
-->

---
layout: section
---

# Group 5 — Engineering Excellence

> Is it easy to build, change, and evolve?

---

# Maintainability

> How easily the system can be understood, modified, and extended by developers over time.

<br>

- **Naming** — `processData()` vs `calculateMonthlyInterestForOverdueAccounts()`
- **Technical debt** — intentional (documented, planned) vs accidental (unacknowledged, compounding)
- **ADRs** — capture *why* decisions were made, not just what

<br>

📍 **SDLC:** Design · Development · Code Review

🔴 **Red flag:** "Nobody touches that code"

<!--
SPEAKER NOTES — SLIDE A

Maintainability is what separates software that ages well from software that becomes a burden.

Technical debt: like financial debt, it accrues interest. The longer it's left, the slower every future change becomes.
- Intentional debt: a known shortcut with a documented plan to address it — sometimes acceptable
- Accidental debt: nobody realized it was a problem — always accumulates silently

Make it visible. Track it. Pay it down in every sprint — not just "debt sprints."

Naming is the primary maintainability skill. The difference between processData() and calculateMonthlyInterestForOverdueAccounts() is the difference between code you fear touching and code you can safely modify. Names should express intent and domain concepts, not implementation details.

ADRs (Architecture Decision Records): short documents capturing why a decision was made — context, options considered, decision, consequences. The "why" is what gets lost over time. An ADR preserves it.

Strangler Fig pattern: don't rewrite large unmaintainable modules all at once. Grow the new implementation around the old, gradually routing behavior through it, until the old code is unused and can be removed safely.

IDM: CI/CD enforces linting, formatting, and automated tests on every merge. The codebase reads as if written by a single developer — easy to navigate regardless of who wrote a given section.
-->

---
layout: two-cols
---

# Maintainability — In Practice

::left::

**What I've seen (IDM)**

CI/CD enforces linting, formatting, and automated tests on every merge.

Combined with code reviews and clear coding standards, the codebase reads as if written by a single developer — easy to navigate regardless of who wrote a given section.

Onboarding a new developer to IDM takes hours, not days — a direct maintainability metric.

::right::

**Your turn** 💬

- Is there a part of the codebase you avoid touching? What makes it hard?
- Have you ever spent significant time understanding code that could have been a 5-minute read with better naming?
- Do you have ADRs? Do you wish you did?

<!--
SPEAKER NOTES — SLIDE B (Discussion)

"Nobody touches that code" is a critical signal. Knowledge is locked in complexity, not in names and structure. When the original author leaves, the knowledge goes with them.

Fear of refactoring is a symptom of insufficient tests. If you can't refactor safely, it's because you can't verify nothing broke. That's a testability problem manifesting as a maintainability problem.

Cyclomatic complexity is measurable — SonarQube reports it. High-complexity functions are candidates for refactoring.

Code duplication: aim for less than 3%. DRY (Don't Repeat Yourself) — but know when duplication is acceptable (two similar things that will diverge) vs when it's not (the same logic repeated for convenience).

Key insight: maintainability is not about perfection — it's about the trend. If features take longer to implement over time for the same complexity, maintainability is declining.
-->

---

# Testability

> How easy it is to write automated tests that verify system behavior with confidence.

<br>

- **Dependency injection** — receive dependencies from outside; replace them with test doubles in tests
- **Test pyramid** — many unit tests, some integration tests, few E2E tests
- **Test doubles** — stub (controls inputs) vs mock (verifies interactions) — use the right one

<br>

📍 **SDLC:** Design · Development · CI/CD

🔴 **Red flag:** "We'll write tests later" / test coverage under 60% for core business logic

<!--
SPEAKER NOTES — SLIDE A

Testability is a DESIGN property. You cannot retrofit it into code that was not designed for it.

The single most important enabler: dependency injection.
- Code that creates its own dependencies internally (new DatabaseConnection()) cannot be tested in isolation
- Code that receives dependencies from outside can have any dependency replaced with a test double
- This is the difference between testable and untestable architecture

Test pyramid:
- Unit tests: fast, test a single unit of logic in isolation, make up the majority
- Integration tests: test how components interact, use real databases/queues, fewer
- E2E tests: test complete user flows, slow and expensive, use sparingly

An inverted pyramid (many E2E, few unit) means a slow, fragile, expensive test suite.

Test doubles vocabulary:
- Stub: returns predetermined values — controls what the code under test receives
- Mock: verifies specific calls were made — tests interactions/side effects
- Fake: working but simplified implementation (in-memory database)
- Spy: records calls for later assertion

Using a mock when you need a stub creates brittle tests that break when implementation details change — even when behavior hasn't changed.

Mutation testing: introduces deliberate small defects (change > to >=) and checks if tests catch them. High coverage with many surviving mutations = tests that run code but don't verify behavior.
-->

---
layout: two-cols
---

# Testability — In Practice

::left::

**What I've seen (IDM)**

Followed the classic test pyramid — unit tests for individual business logic, integration tests for component interactions, E2E tests for full user journeys.

Hexagonal architecture makes IDM highly testable — the domain logic can be tested completely without a database or real connectors.

::right::

**Your turn** 💬

- Have you ever tried to write a test for a piece of code and found it nearly impossible — not because the test was hard, but because the code wasn't designed for testing?
- Do you know the difference between a stub and a mock in your test suite right now?
- What's your current test pyramid shape — balanced, or inverted?

<!--
SPEAKER NOTES — SLIDE B (Discussion)

"We'll write tests later" is one of the most expensive statements in software. Tests written after the code almost always have lower quality — the code wasn't designed for testability, so tests end up tightly coupled to implementation details.

Flaky tests are worse than no tests. A test that passes sometimes and fails sometimes erodes trust in the test suite. The team starts ignoring red builds. CI becomes unreliable. This is a real and common situation.

Key insight: testability is the safety net for everything else — refactoring, deployments, new features. Without tests, every change carries hidden risk. With tests, changes are safe to make.

Coverage as a floor, not a target: 80% coverage doesn't mean 80% correctness. A test can execute code without asserting anything meaningful about it.
-->

---

# Deployability

> How safely, quickly, and reliably new versions can be shipped to production.

<br>

| Metric | Elite | High | Medium | Low |
|--------|:---:|:---:|:---:|:---:|
| Deployment Frequency | Multiple/day | Weekly | Monthly | < Monthly |
| Lead Time | < 1 hour | < 1 day | 1 week–month | > 1 month |
| Change Failure Rate | 0–5% | 5–10% | 10–15% | 15–30% |
| MTTR | < 1 hour | < 1 day | < 1 day | > 1 week |

<br>

📍 **SDLC:** Design · Development · CI/CD · Deployment

🔴 **Red flag:** Fear of deploying on Fridays

<!--
SPEAKER NOTES — QUICK PASS

DORA metrics are the industry standard for measuring delivery health. These four numbers tell you more about a team than almost any other measurement.

The "fear of deploying on Fridays" red flag is real and diagnostic. If deployments are scary, it means:
- They're not automated
- They're not easily reversible
- There's no post-deploy monitoring
- The change failure rate is high

The goal: deployment should be a daily, boring activity.

Deployment strategies:
- Blue-green: two identical environments, instant traffic switch — fast rollback, infrastructure-heavy
- Canary: route small % to new version first — catches problems with limited blast radius
- Rolling: replace instances one at a time — resource-efficient, slower rollback
- Feature flags: deploy code separately from activating it — most flexible, allows dark launching

Zero-downtime database migrations: expand/contract pattern. Add new structure alongside old, migrate data, update code, then remove old structure. Never drop a column in the same deployment that removes the code using it.

Separating "code is in production" from "feature is active for users" is the safest deployment approach available.
-->

---
layout: section
---

# Group 6 — Scale & Operations

> Can it handle growth? Can we understand it in production?

---

# Scalability

> The system handles increased load by adding resources, without fundamental redesign.

<br>

- **Stateless design** — no session state in memory; any instance can serve any request
- **Horizontal vs vertical** — adding instances (scale out) vs bigger instances (scale up, has limits)
- **Async processing** — heavy work goes to a queue; the API returns immediately with a job ID

<br>

📍 **SDLC:** Requirements · Design · Testing

🔴 **Red flag:** Session state stored in application memory (prevents horizontal scaling)

<!--
SPEAKER NOTES — QUICK PASS

The prerequisite for horizontal scaling: stateless services. A stateless service holds no user-specific state in memory between requests. Any instance can handle any request — run as many as needed.

Session state stored in application memory is the most common thing that prevents horizontal scaling. If user A's session is on server 1, every subsequent request from user A must go to server 1. You can't scale out.

Caching strategies:
- Cache-aside: application checks cache first, loads from DB on miss — simple, most common
- Write-through: cache updated on every DB write — consistent, adds write latency
- Write-behind: writes go to cache first, DB updated asynchronously — fast writes, risk of data loss

Async processing pattern: API receives request → enqueues work → returns job ID immediately. Worker processes in background. This decouples user-facing latency from the cost of the operation and allows independent scaling of the processing tier.

Load testing disciplines: load test (expected traffic), stress test (at what point does it break?), soak test (does performance degrade over time under sustained load?).

Database is almost always the scalability bottleneck. Read replicas, connection pooling, CQRS are the primary tools.
-->

---

# Observability

> The ability to understand internal system state by examining its outputs.

<br>

| Pillar | Question it answers |
|--------|---------------------|
| **Logs** | What happened? (event-by-event) |
| **Metrics** | How is it performing over time? |
| **Traces** | How did this request flow across all services? |

<br>

- **Monitoring** = watching for known problems → **Observability** = exploring unknown problems

📍 **SDLC:** Design · Development · Operations

🔴 **Red flag:** "We had no idea this was broken until a customer told us"

<!--
SPEAKER NOTES — SLIDE A

The key distinction: monitoring tells you when something you anticipated goes wrong. Observability lets you ask questions you didn't anticipate and get answers without deploying new code.

The three pillars:
- Logs: what happened? Event-by-event, text-searchable. Should be machine-parseable JSON with consistent fields (timestamp, severity, service, trace ID, contextual fields). Not free text.
- Metrics: how is the system performing over time? Quantified, aggregated, graphable. Counters, gauges, histograms.
- Traces: how did THIS specific request flow through all services? Spans with parent/child relationships across service boundaries.

Distributed tracing: a trace ID is generated at the entry point and propagated through every service. Each service records a span (start, end, outcome, metadata). You see the complete journey — which services, how long each took, where failures occurred.

SLO-based alerting: don't alert when CPU > 80%. Alert when you're burning through your error budget too fast. This aligns alerts with actual user impact and dramatically reduces false positives.

IDM (in progress): collecting traces, metrics, and logs from backend; database metrics; traces, logs, and metrics from frontend — all with correlation IDs so a single request is tracked end-to-end.
-->

---
layout: two-cols
---

# Observability — In Practice

::left::

**What I've seen (IDM)**

Building end-to-end observability: traces, metrics, and logs across the entire stack — backend, database, and frontend — all correlated by trace ID.

A single request can be followed from the browser click through the API, into the database, and back — with timing data at every hop.

::right::

**Your turn** 💬

- When was the last time you discovered a production problem because of an alert vs because a user told you?
- Have you ever spent hours debugging with print statements in production because there was no structured logging?
- Do you know what your p99 API latency is right now?

<!--
SPEAKER NOTES — SLIDE B (Discussion)

"We had no idea" is the most expensive phrase in production operations. Every minute of undetected downtime is user impact.

The alert-to-report ratio is real: what % of production incidents were detected by your monitoring vs reported by users? Elite teams find 90%+ themselves. Most teams are below 50%.

The post-deploy monitoring pattern: deploy, then watch your key metrics for 15 minutes before declaring success. Error rates, latency, 5xx rates should be stable or improving.

On-call runbooks: documented procedures for responding to alerts. Without them, every incident requires the person who built the feature. With them, anyone can respond.

Key takeaway: "Ship observability with the feature. A feature deployed without observability is invisible when it breaks."
-->

---
layout: section
---

# The Framework

> How do you decide which properties matter for your project?

---

# How to Define Priorities

> Which of these 18 properties matter most for your project — right now?

| Group | Theme | Properties |
|-------|-------|------------|
| 1 | Reliability & Correctness | Correctness, Reliability, Availability, Data Integrity |
| 2 | User Experience | Usability, Performance |
| 3 | Security & Trust | Security, Privacy, Auditability |
| 4 | Architecture | Modularity, Extensibility, Interoperability, Portability |
| 5 | Engineering Excellence | Maintainability, Testability, Deployability |
| 6 | Scale & Operations | Scalability, Observability |

<!--
SPEAKER NOTES
-->

---

# Picking Properties for Your Project

> Three questions to ask at the start of every project:

<br>

<div class="grid grid-cols-3 gap-6 mt-4">
  <div class="border rounded-lg p-5">
    <div class="text-3xl mb-3">👤</div>
    <div class="font-bold mb-2">Who are your users?</div>
    <div class="text-sm text-gray-500">Enterprise customers → Auditability, Availability, Security<br><br>Internal tools → Maintainability, Deployability</div>
  </div>
  <div class="border rounded-lg p-5">
    <div class="text-3xl mb-3">💥</div>
    <div class="font-bold mb-2">What are the failure consequences?</div>
    <div class="text-sm text-gray-500">Identity system → Security, Correctness, Reliability (top 3)<br><br>Admin dashboard → Usability, Maintainability</div>
  </div>
  <div class="border rounded-lg p-5">
    <div class="text-3xl mb-3">📍</div>
    <div class="font-bold mb-2">What phase are you in?</div>
    <div class="text-sm text-gray-500">Greenfield → Foundation properties now<br><br>Scaling → Performance, Scalability, Observability</div>
  </div>
</div>

<!--
SPEAKER NOTES

This is the key practical output of today's session. The vocabulary is useful. The framework is actionable.

Walk through the three questions for IDM as an example:

IDM:
- Who are your users? Enterprise IT admins, developers building on the platform, end-users whose identities are managed
- Failure consequences? Security breach, incorrect access, audit failure in compliance review — all severe
- Phase? Maturing product entering enterprise sales — trust and compliance properties move up in priority

The output of answering these questions: a ranked list of properties for THIS project, which then feeds into your Definition of Done.

Example DoD additions from properties:
- "The feature includes structured logging with trace ID" (Observability)
- "Authorization is verified server-side at the endpoint, not only in the UI" (Security/Correctness)
- "A new module does not introduce circular dependencies" (Modularity)
- "The feature has acceptance tests covering the happy path and at least 2 edge cases" (Correctness/Testability)

This is the workshop we'll do as a next step — per product, per team.
-->

---

# Properties in the SDLC — Shift Left

> The earlier you address a property, the cheaper it is.

<br>

| Property | Req | Design | Dev | Testing | Deploy | Ops |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| Correctness | ★★★ | ★★ | ★★★ | ★★★ | | |
| Security | ★★★ | ★★★ | ★★★ | ★★ | | ★★ |
| Modularity | | ★★★ | ★★ | ★ | | |
| Testability | | ★★★ | ★★★ | ★★ | | |
| Observability | ★ | ★★★ | ★★★ | | ★★ | ★★★ |
| Deployability | | ★★ | ★★ | ★★ | ★★★ | ★★ |

<br>

★★★ = Primary phase &nbsp;|&nbsp; ★★ = Important &nbsp;|&nbsp; ★ = Relevant &nbsp;&nbsp; *(Full table in reference doc)*

<!--
SPEAKER NOTES

"Shift left" means moving quality decisions earlier in the process — toward requirements and design, away from testing and operations.

The 30× rule for security: a vulnerability found in design costs 30× less to fix than one found in production. Same applies to modularity decisions.

Reading the table:
- Correctness: owned at requirements (precise acceptance criteria) and development (code review for logic). Testing can only verify — it can't retroactively make a system correct.
- Security: owned at ALL phases from requirements through operations. This is why security is never "done."
- Modularity: almost entirely a design-time decision. By the time you're testing, the architecture is largely set.
- Observability: instrumented during development, operated continuously. Can't retroactively add observability to a feature without modifying it.

Practical implication: start every feature with a brief question — "which properties matter for this feature?" Then make it part of acceptance criteria and code review.

The full table with all 18 properties is in the reference document.
-->

---
layout: center
class: text-center
---

# Two Things to Take Away

<br>

<div class="grid grid-cols-2 gap-8 mt-6 text-left max-w-2xl mx-auto">
  <div class="border-2 border-blue-500 rounded-lg p-6">
    <div class="text-3xl mb-3">🗣️</div>
    <div class="font-bold text-xl mb-3">The Vocabulary</div>
    <div class="text-sm">We now have names for what we've always known intuitively. Use them in code review, in planning, in architecture discussions.</div>
  </div>
  <div class="border-2 border-green-500 rounded-lg p-6">
    <div class="text-3xl mb-3">❓</div>
    <div class="font-bold text-xl mb-3">The Habit</div>
    <div class="text-sm">Before building anything: <em>"Which properties matter most for this project? How do they show up in our Definition of Done?"</em></div>
  </div>
</div>

<br>

**Next step:** Per-project properties workshop — define DoD per product, per team.

<!--
SPEAKER NOTES

Close strong. These two takeaways are what should survive the next week.

The vocabulary: when someone says "this code is hard to change," we now say "it has a modularity problem — specifically high coupling between the service layer and the data layer." That's actionable. "Hard to change" isn't.

When someone says "we had an outage," we now ask: "was it a reliability failure (design), an availability failure (ops), or a deployability failure (bad deploy)?" Each has a different root cause and different fix.

The habit: the most expensive thing in software is discovering late. If you ask "which properties matter?" at requirements, you make different architectural decisions than if you discover it at go-live.

Next step: I'd like to do a follow-up workshop — 90 minutes per product — where we answer those three questions together and produce a ranked property list and updated Definition of Done. That's where this becomes operational.

Thank you. Questions?
-->

---
layout: center
class: text-center
---

# Thank You

### Questions?

<br>

> *"Good software is not an accident — it's a set of properties you planned for."*
