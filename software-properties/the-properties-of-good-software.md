# The Properties of Good Software

A personal reference for the quality attributes I believe define well-built software. These are the properties I've identified as worth knowing.

---

## How to Use This Guide

Each property follows the same structure:

- **What is it** — plain definition
- **What it includes** — sub-concepts and related terms
- **Where in the SDLC** — when to apply it, and what shifting left looks like
- **How to measure** — concrete metrics for engineers
- **How to master** — skills, patterns, and knowledge to develop
- **What I've seen** — examples from my work on IDM and Central. I only have examples from these two because they are the products I worked on.
- **Connects to** — relationships with other properties

Properties are grouped by theme. A property can appear in more than one group when it genuinely belongs to both.

---

## Groups at a Glance

| Group | Theme | Properties |
|-------|-------|------------|
| 1 | Reliability & Correctness | Correctness, Reliability/Resilience, Availability, Data Integrity |
| 2 | User Experience | Usability, Performance |
| 3 | Security & Trust | Security, Privacy, Auditability |
| 4 | Architecture | Modularity, Extensibility, Interoperability, Portability |
| 5 | Engineering Excellence | Maintainability, Testability, Deployability |
| 6 | Scale & Operations | Scalability, Observability, Performance |

---

## Group 1 — Reliability & Correctness

> Does the system do what it's supposed to, consistently?

---

### Correctness

**What is it**
The system produces the right output for every valid input. It does exactly what it is specified to do — no silent failures, no wrong answers, no unexpected behavior. This is the most fundamental property. Everything else is meaningless if the system is incorrect.

**What it includes**

- **Input validation** — reject or handle invalid inputs gracefully
- **Business logic accuracy** — the core rules are implemented exactly as specified
- **Edge case handling** — boundary values, empty inputs, concurrent operations behave correctly
- **API contract adherence** — the system fulfills the promises it makes to callers
- **Specification conformance** — behavior matches requirements documents, user stories, and acceptance criteria
- **Idempotency** — operations that should be repeatable produce the same result every time

**Where in the SDLC**

- **Requirements/Planning** — write precise, unambiguous acceptance criteria. Vague specs produce incorrect systems.
- **Design** — define contracts (what goes in, what comes out, what errors are possible) before implementing
- **Development** — correctness is a design and review activity. Code review focuses on logic correctness, not just style.
- **Testing** — unit tests verify individual logic, acceptance tests verify user-facing correctness
- **Shift left:** Most correctness bugs come from unclear requirements or untested logic, not production. Catch them at spec and code review stage.

**How to measure**

- *Engineer level:*
  - **Test coverage %** — what percentage of the codebase is executed during automated tests (line coverage, branch coverage). Important: coverage is a floor, not a target. 80% coverage does not mean 80% correctness — a test can run a line without asserting anything meaningful about it. Low coverage is a red flag; high coverage does not guarantee correctness.
  - **Defect density** — bugs found per KLOC (thousand lines of code). If a codebase has 50,000 lines and 25 known bugs, defect density is 0.5 per KLOC. Useful as a trend per component, not as an absolute number.
  - **Failed acceptance tests per sprint** — acceptance tests are written from the user's perspective ("given this input, the feature must do X"). If these are failing at the end of a sprint, the team is shipping things that don't meet their own stated specifications.
- *At a glance:* Bug escape rate (how many bugs reach production vs found in testing), defect trend over time
- *Red flag:* Bugs repeatedly found in production for the same component = correctness debt in that area

**How to master**

- Write precise, unambiguous acceptance criteria before coding — treat them as the specification the system must satisfy. "The system should handle errors" is not a spec. "The API returns HTTP 422 with a structured error body when the input fails validation" is.
- Understand contract design — for every function, module, or API: define explicitly what valid inputs are, what the output will be for each case, and what errors are possible. This is the contract; the implementation must honor it.
- Practice boundary analysis — the most common correctness bugs live at boundaries: the empty list, the zero value, the maximum integer, the concurrent write. Identify these as part of design, not discovery during testing.
- Learn property-based testing — instead of hand-writing specific test cases, define invariants (properties that must always hold) and let the framework generate hundreds of cases automatically. Finds edge cases you didn't think of.
- Know the difference between specification testing (does the system match the stated spec?) and exploratory testing (what happens in unusual or adversarial conditions?). Both find different classes of bugs.

**What I've seen**

- *IDM:* Authorization logic correctness has security consequences, not just functional ones — an incorrect access check is a direct breach

**Connects to**

- **Reliability** — correctness over time, under all conditions
- **Testability** — you need tests to verify and maintain correctness
- **Data Integrity** — data correctness is a subset of overall correctness
- **Security** — many security vulnerabilities are logic correctness failures

---

### Reliability / Resilience

**What is it**
The system works consistently under expected conditions and degrades gracefully when unexpected things happen. A reliable system doesn't just work when everything is perfect — it handles failures, recovers from them, and limits the blast radius when things go wrong.

**What it includes**

- **Fault tolerance** — the system continues operating when some components fail
- **Graceful degradation** — when a dependency is unavailable, the system returns partial results rather than completely failing
- **Error handling** — every failure path is handled explicitly, never silently swallowed
- **Retry logic** — transient failures (temporary, self-resolving failures like a brief network hiccup, a momentarily overloaded service, or a brief database lock timeout) are retried with appropriate backoff; permanent failures are not
- **Circuit breaker pattern** — stops cascading failures by "opening" a circuit when a dependency is consistently failing
- **Bulkhead pattern** — isolates failures so one bad component doesn't drain resources from everything else
- **Self-healing** — system can recover automatically without manual intervention
- **MTBF (Mean Time Between Failures)** — how long the system runs before failing
- **MTTR (Mean Time to Recovery)** — how fast the system recovers after failing

**Where in the SDLC**

- **Requirements** — define failure scenarios, SLOs, and acceptable degradation behavior
- **Design** — identify single points of failure (any component whose failure causes the entire system to fail — a single server with no redundancy, a shared database with no replica, a critical service with no fallback), design redundancy, define failure modes for every external dependency
- **Development** — implement circuit breakers, retry logic, error handling as first-class concerns (not afterthoughts)
- **Testing** — chaos testing (deliberately inject failures), fault injection, load testing under failure conditions
- **Operations** — runbooks for incident response, post-mortems to improve reliability
- **Shift left:** Most reliability failures are design failures — a system that was never designed for failure cannot be made reliable by testing alone.

**How to measure**

- *Engineer level:* MTBF, MTTR, error rate (% of requests that result in 5xx), success rate, circuit breaker open rate
- *At a glance:* Number of incidents per month (trend), MTTR trend, SLO breach count
- *Red flag:* Incidents caused by dependency failures (could have been circuit-broken), unhandled exceptions reaching users

**How to master**

- Understand the **Circuit Breaker pattern** — when a dependency is consistently failing, stop calling it rather than letting every request fail and time out. The circuit "opens" (stops calls), allows occasional "half-open" probes, and "closes" again when the dependency recovers. This prevents cascading failures across services.
- Know **retry strategies and their limits** — retry transient failures with exponential backoff (wait longer between each attempt) and jitter (randomize the wait to avoid thundering herd). Know when NOT to retry: on permanent failures (4xx errors, record not found), on non-idempotent operations without safety checks, after a circuit has opened.
- Learn the **Bulkhead pattern** — isolate subsystems so a failure in one doesn't drain shared resources (thread pools, connection pools) from others. Like a ship's bulkheads: one flooded compartment doesn't sink the ship.
- Understand **fail-fast vs fail-safe** — fail-fast detects problems immediately and surfaces them loudly (better for development, better for permanent failures). Fail-safe continues with degraded behavior (better for production non-critical paths). Know which to apply and when.
- Practice **designing for failure** — for every external dependency your system calls, ask: what happens if it's slow? What happens if it returns an error? What happens if it's completely unreachable? These answers should be in the code, not improvised during an incident.

**What I've seen**

- *IDM:* When a connector target system fails, the failure is isolated — other connectors and the rest of the system keep running. Error boundaries contain the blast radius.
- *IDM and Central:* Transient failures trigger retries before surfacing as errors. Modules operate within error boundaries so one failing part doesn't bring down others.

**Connects to**

- **Correctness** — correct systems fail less often
- **Availability** — reliable systems achieve higher availability
- **Observability** — you can only improve reliability if you can observe failures
- **Testability** — reliability must be tested, including failure paths
- **Deployability** — bad deployments are a major source of reliability incidents

---

### Availability

**What is it**
The system is operational and accessible to users when they need it. Expressed as uptime percentage over a time period. Availability is the outcome — Reliability and Resilience are how you achieve it.

**What it includes**

- **Uptime SLA (Service Level Agreement)** — the contractual promise to customers
- **SLO (Service Level Objective)** — internal engineering target, usually stricter than the SLA
- **SLI (Service Level Indicator)** — the actual measurement (e.g. % of successful requests)
- **Planned vs unplanned downtime** — maintenance windows, deployments, vs incidents
- **Disaster Recovery (DR)** — RPO (Recovery Point Objective: how much data loss is acceptable?), RTO (Recovery Time Objective: how fast must you recover?)
- **Redundancy** — no single point of failure
- **Geographic distribution** — if a region goes down, another serves traffic

**Availability by the numbers:**

| SLA | Downtime per year | Downtime per month |
|-----|-------------------|--------------------|
| 99% | 87.6 hours | 7.3 hours |
| 99.9% | 8.76 hours | 43.8 minutes |
| 99.99% | 52.6 minutes | 4.4 minutes |
| 99.999% | 5.26 minutes | 26 seconds |

**Where in the SDLC**

- **Requirements** — define availability SLO per product. What is acceptable? Check customer contracts.
- **Design** — eliminate single points of failure, design for zero-downtime deployments, plan disaster recovery
- **Operations** — 24/7 monitoring, alerting, on-call rotations, DR drills
- **Shift left:** Availability requirements must drive architecture. Retrofitting high availability into a system designed for single-server is very expensive.

**How to measure**

- *Engineer level:* Uptime % (calculated from SLI data), MTTR, deployment success rate
- *At a glance:* Monthly availability report per product vs SLO target, number of SLA breaches
- *Red flag:* Deployments causing downtime, no DR plan for any product

**How to master**

- Understand the **SLA/SLO/SLI framework** — SLI is the measurement (e.g. % of successful requests), SLO is the internal engineering target (e.g. 99.9% success rate), SLA is the contractual commitment to customers (usually looser than the SLO). Know which products have SLAs and what the engineering SLOs must be to meet them.
- Know **deployment strategies that eliminate downtime:** blue-green (run two identical environments, switch traffic instantly — fast but infrastructure-heavy), canary (route a small % to the new version first — catches problems early with limited blast radius), rolling (replace instances one by one — resource-efficient).
- Understand **zero-downtime database migrations** using the expand/contract pattern — add new structure alongside the old (expand), migrate data in the background, update code to use new structure, then remove the old (contract). Schema changes are the most common source of deployment-related downtime.
- Know **database replication and failover** — how primary/replica setups work, how automatic failover is triggered, and what replication lag means for consistency during failover.
- Understand **RPO and RTO for disaster recovery** — RPO (how much data loss is acceptable?) and RTO (how fast must we recover?) must be defined before a disaster, not during one.

**Connects to**

- **Reliability** — the means to achieve availability
- **Deployability** — deployments are a major source of unplanned downtime
- **Scalability** — unavailability under load is an availability failure
- **Observability** — you cannot report availability without measuring it

---

### Data Integrity

**What is it**
Data remains accurate, consistent, and trustworthy throughout its entire lifecycle — from creation to storage, processing, and eventual deletion. Correctness is about system behavior; data integrity is about the data itself.

**What it includes**

- **ACID transactions** — Atomicity, Consistency, Isolation, Durability (the guarantees relational databases provide)
- **Referential integrity** — foreign key relationships are valid, no orphaned records
- **Idempotency** — processing the same event/request twice produces the same result (critical for retries and event streams)
- **Data validation at every boundary** — never trust external data
- **Checksums and hashing** — detect data corruption in transit or storage
- **Audit trails for data changes** — who changed what and when (overlaps with Auditability)
- **Eventual consistency handling** — in distributed systems, data is temporarily inconsistent; this must be acknowledged and managed

**Where in the SDLC**

- **Design** — define transaction boundaries, choose consistency models (strong vs eventual), design for idempotency
- **Development** — use database constraints (not just application-level checks), handle duplicate events, validate inputs
- **Testing** — test data corruption scenarios, replay events to verify idempotency, test concurrent writes
- **Operations** — regular backup/restore drills (verify you can actually restore), data reconciliation jobs
- **Shift left:** Most data integrity issues are design decisions. Application-level enforcement of constraints that the database does not enforce will eventually break.

**How to measure**

- *Engineer level:* Failed transaction rate, orphaned record count (run periodic checks), data reconciliation discrepancy count
- *At a glance:* Data quality incidents, backup/restore test success rate
- *Red flag:* Duplicate records in production, data reconciliation jobs that regularly find discrepancies, "we can't trust the data in this table"

**How to master**

- Deeply understand **ACID properties** and when they apply — Atomicity (all-or-nothing), Consistency (valid state before and after), Isolation (concurrent transactions don't interfere), Durability (committed data survives failures)
- Learn the **Saga pattern** for distributed transactions — when a transaction spans multiple services, a Saga coordinates a sequence of local transactions with compensating actions (rollbacks) if any step fails
- Study **event sourcing and CQRS** — instead of storing only current state, event sourcing stores every change as an immutable event. This naturally handles audit, replay, and consistency. CQRS separates the read and write models for efficiency.
- Practice **idempotent design** — every write operation should be safe to repeat. If a retry sends the same request twice, the result should be the same as if it was sent once. Design for this from the start.
- Understand **optimistic vs pessimistic locking** for concurrent writes — optimistic locking assumes conflicts are rare and detects them at commit time (cheaper, higher throughput). Pessimistic locking acquires a lock before any work (safer, lower throughput). Know when each applies.

**What I've seen**

- *IDM:* Some operations span multiple entities — changing an MV Attribute affects several records and must succeed or fail atomically. A partial update would leave the system in an inconsistent state.

**Connects to**

- **Correctness** — wrong data causes incorrect behavior
- **Reliability** — data corruption causes reliability failures
- **Security** — data tampering is an integrity violation
- **Auditability** — change tracking is part of data integrity

---

## Group 2 — User Experience

> Is the system good to use?

---

### Usability

**What is it**
How easy, efficient, and satisfying it is for users to achieve their goals using the system. Usability includes Accessibility (usability for people with disabilities) and Discoverability (users and developers can find and understand how to use features/APIs).

**What it includes**

- **Learnability** — can a new user figure it out without training or documentation?
- **Efficiency** — how quickly can an experienced user accomplish tasks?
- **Memorability** — after not using the system for a while, can users remember how to use it?
- **Error prevention and recovery** — does the interface stop users from making mistakes, and help them recover when they do?
- **User feedback** — does the system always tell the user what is happening? (loading states, confirmations, error messages)
- **Consistency** — does the system behave predictably? Similar actions produce similar results.
- **Satisfaction** — does using the system feel good? (subjective but measurable)
- **Accessibility (a11y)** — WCAG compliance, screen reader support, keyboard navigation, color contrast ratios, focus management
- **Discoverability** — for UIs: can users find features? For APIs: can developers find and understand endpoints? (OpenAPI, documentation)

**Where in the SDLC**

- **Requirements** — define user personas, write user stories from the user's goal perspective, not the technical implementation
- **Design** — UX/UI design, wireframes, prototypes, design system (this is where designers own usability)
- **Development** — implement according to design, add ARIA attributes for accessibility, use the UI library for consistency
- **Testing** — usability testing with real users, a11y audits (Axe, Lighthouse), keyboard navigation testing
- **Shift left:** Usability problems found in user testing are 100x cheaper to fix than usability problems found post-launch. Prototype and test before building.

**How to measure**

- *Engineer level:* WCAG compliance level (A, AA, AAA), a11y audit findings count, number of UI inconsistencies vs design system
- *At a glance:* SUS score (System Usability Scale, 0–100), task completion rate in user testing, support tickets about confusion/usability, NPS (Net Promoter Score)
- *Red flag:* Support tickets saying "I don't understand how to do X", users requesting training for basic tasks

**How to master**

- Know and apply **Nielsen's 10 Usability Heuristics** as a practical review tool — not theoretical principles but a checklist you use in design reviews. The 10 include: visibility of system status, user control and freedom, error prevention, consistency, and help for error recovery. Know them well enough to cite them in feedback.
- Understand **WCAG 2.1 Level AA** requirements in practice — know the key requirements: contrast ratio minimum (4.5:1 for normal text), keyboard navigability for all interactive elements, ARIA labels, focus indicators. Level AA is the standard enterprise products are held to.
- Master **user story writing** — "As a [specific persona], I want [specific goal] so that [specific benefit]." The persona should not be "a user" but a real role (e.g. "network administrator"). The goal should not be a feature but an outcome.
- Understand the **usability testing process** — five users, real tasks, observe without intervening or explaining, note where they hesitate or fail. You don't need a lab. You need a task list, a silent observer, and a note-taker.
- Know the **design handoff contract** — engineers implement what designers specify; designers approve before shipping. Understanding design tokens, component specs, and design system governance is how engineers contribute to usability rather than accidentally degrading it.

**Connects to**

- **Performance** — slow is unusable. Speed is a usability requirement.
- **Correctness** — if the system produces wrong output, users are confused and the UX fails
- **Maintainability** — a well-organized design system (UI library) is also easier to maintain
- **Interoperability** — API discoverability is a usability concern for developers

---

### Performance

**What is it**
How fast and efficient the system is. Performance has two perspectives that are both important:

- **User-facing performance** — how fast does it feel to use? (Group 2)
- **System-level performance** — how efficiently does it use resources at scale? (Group 6)

This property covers both.

**What it includes**

- **Latency** — time for a single request to complete. Always measure in percentiles, not averages: p50 (median), p95, p99. The average hides the tail — p99 is what your worst 1% of users experience.
- **Throughput** — number of requests the system can handle per second
- **Core Web Vitals** — Google's standard for frontend performance:
  - **LCP (Largest Contentful Paint)** — loading performance. Under 2.5 seconds is good.
  - **INP (Interaction to Next Paint)** — interactivity. Under 200ms is good.
  - **CLS (Cumulative Layout Shift)** — visual stability. Under 0.1 is good.
- **Database query performance** — query execution time, index usage, N+1 query detection
- **Caching effectiveness** — cache hit rate (how often data is served from cache vs database)
- **Resource utilization** — CPU, memory, network, and storage usage efficiency
- **Cost per request** — how much infrastructure cost does serving one request incur?

**Where in the SDLC**

- **Requirements/Design** — define performance SLOs (e.g. "API p99 response time under 500ms at 1000 req/s"), choose architecture with performance in mind (caching strategy, CDN, async vs sync)
- **Development** — profile before optimizing, avoid N+1 queries, use pagination, lazy load where appropriate
- **Testing** — load testing (simulate real traffic), performance benchmarks in CI (catch regressions automatically)
- **Operations** — monitor percentiles continuously, capacity planning, cost monitoring
- **Shift left:** Performance SLOs must be defined at requirements stage. "Make it fast" is not a requirement. "p95 API response time under 200ms at 500 concurrent users" is.

**How to measure**

- *Engineer level:* API latency percentiles (p50/p95/p99), database query execution times, cache hit rate, Core Web Vitals scores
- *At a glance:* Average page load time trend, % of requests meeting SLO, infrastructure cost trend vs traffic growth, Apdex score
- *Red flag:* p99 latency is 10x p50 (indicates a class of requests is very slow), cache hit rate under 70%, database queries without indexes

**How to master**

- Understand **profiling before optimizing** — find where time is actually being spent before writing a single line of optimization. "The database query" is not specific enough. "The query on line 47 that does a full table scan because it lacks an index on user_id" is. Profiling gives you the latter.
- Master **database indexing** — the single highest-ROI performance skill for backend engineers. Understand how B-tree indexes work, when composite indexes help, when indexes hurt write performance, and how to read an execution plan to verify an index is being used.
- Know **caching strategies** — cache-aside (application checks cache first, loads from DB on miss), write-through (cache is updated every time the DB is written), TTL (time-to-live, when cached data expires). The hardest part: cache invalidation — knowing when cached data is stale and must be refreshed.
- Understand **percentile-based measurement** — p50 is the median, p95 means 95% of requests are faster, p99 means 99% are faster. The 1% at p99 is your worst-case user experience. A system with p50=50ms and p99=5000ms has a fine average but a broken tail. Averages always lie.
- Know the **latency-throughput-resource tradeoff** — making individual requests faster can reduce how many you handle in parallel; reducing resource usage can increase latency. These don't all move in the same direction. Understand what you are trading before optimizing.

**What I've seen**

- *IDM:* Inbound sync was identified as too slow through benchmarking. Profiling pinpointed the specific bottlenecks, and targeted refactoring brought the performance to an acceptable level.

**Connects to**

- **Usability** — slow performance is a usability failure
- **Scalability** — performance under load is a scalability concern
- **Observability** — you cannot measure or improve performance without observability
- **Reliability** — performance degradation under load can cause outages

---

## Group 3 — Security & Trust

> Is the system safe and accountable?

---

### Security

**What is it**
Protection of the system, its data, and its users against unauthorized access, misuse, and malicious attacks. Security is not a feature you add at the end — it is a property you design for from the beginning.

**What it includes**

- **Authentication** — verifying who the user/system is (passwords, tokens, certificates)
- **Authorization** — verifying what the authenticated entity is allowed to do (RBAC, ABAC, permissions)
- **Data protection in transit** — TLS/HTTPS everywhere
- **Data protection at rest** — encryption of sensitive data in databases and file storage
- **Vulnerability management** — OWASP Top 10 prevention (injection, XSS, CSRF, broken access control, etc.)
- **Input validation** — never trust external data; validate and sanitize everything
- **Secrets management** — credentials, API keys, and certificates managed securely (never in code or git)
- **Dependency security** — third-party libraries introduce vulnerabilities (CVEs); they must be tracked and patched
- **SAST** — Static Application Security Testing (scan source code for vulnerabilities)
- **DAST** — Dynamic Application Security Testing (attack the running application)
- **Penetration testing** — deliberate adversarial testing of the system

**Where in the SDLC**

- **Requirements** — threat modeling (what could go wrong? who would attack this? what do they gain?)
- **Design** — security architecture, principle of least privilege, zero trust design
- **Development** — secure coding practices, SAST tools in CI pipeline, secrets scanning, no hardcoded credentials
- **Testing** — DAST scanning, dependency vulnerability scanning, penetration testing
- **Operations** — runtime monitoring for attacks, patch management, incident response plan
- **Shift left:** A security vulnerability found in design costs 30x less to fix than one found in production. Threat model at design stage.

**How to measure**

- *Engineer level:* SAST findings per sprint (and trend), CVE count by severity (critical/high/medium), % of services with TLS, secrets properly managed vs hardcoded
- *At a glance:* Critical/high CVE mean time to patch, number of security incidents, penetration test findings trend, security training completion rate
- *Red flag:* Secrets in git history, no SAST in CI, critical CVEs older than 30 days

**How to master**

- Know the **OWASP Top 10** vulnerabilities — not just the names but how each attack works and its defense. The most critical: Injection (SQL, command) — use parameterized queries, never string concatenation; Broken Access Control — verify authorization at every endpoint server-side, not just in the UI; XSS — escape all output, use Content Security Policy headers.
- Practice **threat modeling using STRIDE** — for any system or feature, ask: who could **S**poof identity? what could be **T**ampered with? what actions could be **R**epudiated? what **I**nformation could be Disclosed? how could **D**enial of Service occur? how could **E**levation of Privilege happen? This structured approach finds security problems at design time.
- Understand **OAuth 2.0 and OIDC flows** deeply — how access tokens and refresh tokens work, what JWTs contain and how they are verified, and the common JWT vulnerabilities (the alg:none attack, weak signing secrets, missing expiry validation). For IDM, this is non-negotiable knowledge.
- Know **secrets hygiene** — secrets must never appear in source code, git history, or logs. Understand how to use environment variables and secret vaults correctly, and how to detect secrets that have leaked (git-secrets, trufflehog).
- Understand the **principle of least privilege** — every component, service account, and user should have exactly the permissions needed for their job and nothing more. Over-privileged systems turn small breaches into large ones.

**What I've seen**

- *IDM:* SAST checks run in the CI/CD pipeline on every build, catching security issues before they reach production.

**Connects to**

- **Privacy** — security is a prerequisite for privacy
- **Auditability** — security events need audit trails for investigation
- **Correctness** — security vulnerabilities are often logic correctness failures (incorrect authorization checks)
- **Reliability** — attacks (DDoS, injection attacks) affect reliability
- **Interoperability** — inter-system communication must be secured (mTLS, service accounts)

---

### Privacy

**What is it**
Personal and sensitive data is collected, stored, processed, and shared in ways that respect user rights and regulatory obligations. Security keeps data safe from unauthorized access; Privacy ensures data is used appropriately even by authorized parties.

**What it includes**

- **Data minimization** — collect only the data you actually need
- **Purpose limitation** — data collected for one purpose is not reused for another without consent
- **Consent management** — users understand and agree to how their data is used
- **Right to erasure** — users can request deletion of their data (GDPR "right to be forgotten")
- **Right to access** — users can request a copy of their data
- **Data residency** — where is data stored? (relevant for GDPR, some countries require data to stay in-country)
- **PII (Personally Identifiable Information) handling** — special care for names, emails, IDs, locations, etc.
- **Anonymization and pseudonymization** — protect identity in data used for analytics

**Where in the SDLC**

- **Requirements** — "Privacy by Design": identify what personal data is collected and why, before building
- **Design** — data flow diagrams showing PII, anonymization strategy for analytics/logs, data retention periods
- **Development** — never log PII in plain text, mask PII in development environments, implement deletion flows
- **Operations** — data retention enforcement, respond to data subject requests (access, deletion)
- **Shift left:** Retrofitting privacy is extremely expensive. "We'll add privacy later" almost never works cleanly.

**How to measure**

- *Engineer level:* PII found in logs (should be zero), data subject requests fulfilled within SLA, data retention policies enforced
- *At a glance:* GDPR compliance audit findings, PII breach incidents, data subject request fulfillment time (GDPR requires 30 days)
- *Red flag:* PII visible in log files, no process for handling "delete my data" requests, unclear what personal data is stored where

**How to master**

- Know the **GDPR's core principles** in plain terms: collect only what you need (minimization), use it only for what you said (purpose limitation), delete it when you no longer need it (storage limitation), and honor requests to access or delete it (data subject rights). Know which of these apply to each Vertowave product.
- Understand **"Privacy by Design"** as an architectural commitment — privacy is built into the system from the start, not verified at the end. The practical question to ask in every design: "what personal data does this feature touch, and does it actually need to?"
- Know the difference between **anonymization and pseudonymization** — anonymized data has had all identifying information permanently removed (no longer personal data under GDPR). Pseudonymized data has identifying fields replaced with tokens but the mapping still exists (still personal data). This distinction determines what GDPR obligations apply.
- Know **PII handling patterns** — how to prevent PII from appearing in logs (mask or omit it), how to handle it in non-production environments (use synthetic or anonymized data, never real user data in dev/staging), and what a deletion workflow looks like technically across all systems that store it.
- Understand the **data subject request process** end-to-end — when a user asks "what data do you have on me?" or "delete my account", what systems are involved, what data needs to be found or deleted, and what the 30-day GDPR response window means operationally.

**Connects to**

- **Security** — privacy requires security (data breaches are privacy failures)
- **Auditability** — GDPR requires records of processing activities
- **Data Integrity** — privacy violations often involve unauthorized data modification

---

### Auditability / Compliance

**What is it**
The system records a verifiable, immutable history of who did what, when, for regulatory, legal, and accountability purposes. Auditability is distinct from Observability: Observability helps engineers understand system behavior; Auditability provides evidence for compliance, legal proceedings, and business accountability.

**What it includes**

- **Audit logs** — immutable, structured records of sensitive operations (who, what, when, from where, outcome)
- **Access logs** — records of who accessed what data
- **Change tracking** — every change to critical data has a record of who made it
- **Non-repudiation** — a user cannot deny having performed an action
- **Regulatory compliance** — GDPR, SOC 2, ISO 27001, PCI-DSS depending on industry
- **Data lineage** — for analytics systems, where did this data come from and how was it transformed?
- **Log integrity** — audit logs must be tamper-evident (cannot be deleted or modified to hide actions)

**Key distinction from Observability:**

| | Observability | Auditability |
|-|---------------|--------------|
| **Audience** | Engineers, SREs | Legal, compliance, managers |
| **Purpose** | Debug, understand system | Prove what happened |
| **Retention** | Days to weeks | Months to years |
| **Format** | Debug-friendly | Legally valid, structured |
| **Access control** | Engineering team | Restricted, with access log |

**Where in the SDLC**

- **Requirements** — identify regulatory obligations before building. What must be audited?
- **Design** — audit log architecture (separate storage, immutability guarantees), define what constitutes an auditable event
- **Development** — instrument every sensitive operation (auth events, admin actions, data changes, payment events)
- **Operations** — log retention management, compliance reporting, access to audit logs must itself be audited

**How to measure**

- *Engineer level:* % of sensitive operations with audit logs, audit log completeness test (can you reconstruct what happened in an incident from logs alone?)
- *At a glance:* Compliance certification status (SOC 2, ISO 27001), audit findings count, time to respond to a compliance audit request
- *Red flag:* "We don't know who made this change", audit logs stored in the same database they audit (can be tampered)

**How to master**

- Know what fields **every audit log event must contain** — actor (who performed the action), action (what was done), resource (what it was done to), timestamp (when, in UTC), outcome (success or failure and why), and source (IP address or system identifier). An audit log missing any of these may be legally insufficient.
- Understand **immutability in log storage** — audit logs must be tamper-evident: once written, they cannot be modified or deleted. Append-only storage and WORM (Write Once Read Many) storage are the mechanisms. Storing audit logs in the same database they audit defeats this — a compromised database can cover its own tracks.
- Know the **three types of logs** and their different requirements: application logs (for debugging, short retention, engineering access), security logs (for threat detection, medium retention, security team access), audit logs (for compliance and accountability, long retention, restricted access with its own access log).
- Understand **non-repudiation** — the guarantee that a user cannot plausibly deny having performed an action. This requires both the audit log and the authentication mechanism to be trustworthy. A weak auth system undermines audit integrity.
- Know the **compliance frameworks** that drive auditability requirements — SOC 2 (security, availability, processing integrity, confidentiality, privacy controls) and ISO 27001 (information security management). Enterprise customers will ask about these. Know what they require at a conceptual level.

**What I've seen**

- *IDM:* Audit logs record every change in the system — who made it, what entity was affected, and when. This is treated as a first-class feature of IDM.

**Connects to**

- **Security** — audit trails support incident investigation and forensics
- **Privacy** — GDPR requires records of data processing activities
- **Observability** — different purpose, sometimes shares infrastructure (log storage, ELK stack)
- **Data Integrity** — audit logs are themselves data that must be integrity-protected

---

## Group 4 — Architecture

> Is the system well-designed for change, growth, and integration?

---

### Modularity

**What is it**
The system is divided into distinct, loosely coupled components with clear boundaries and well-defined interfaces. Changes to one component do not ripple unexpectedly through others. The whole is understandable as a set of parts.

**What it includes**

- **Separation of concerns** — each component has one clear job
- **Single responsibility** — at every level: function, class, module, service
- **Low coupling** — components depend on each other as little as possible
- **High cohesion** — things that change together are grouped together
- **Bounded contexts (Domain-Driven Design)** — each domain area has its own model and language
- **Dependency management** — explicit, controlled dependencies between modules
- **Package/module structure** — how the codebase is organized reflects the domain

**Where in the SDLC**

- **Design** — domain modeling, architecture diagrams, defining component boundaries before coding
- **Development** — dependency injection, interface-based programming, organizing code by domain not by layer
- **Code Review** — enforcing that new code respects existing boundaries, catching coupling creep
- **Shift left:** Modularity decisions are irreversible at low cost only at design time. Refactoring a monolith into modules is expensive.

**How to measure**

- *Engineer level:* Circular dependency count (should be zero), coupling metrics (SonarQube can measure this), number of components affected when changing one component
- *At a glance:* Time to understand a new area of the codebase (ask new team members), time to deliver a feature that should be isolated
- *Red flag:* Changing one thing breaks something unrelated, "you have to understand the whole system to change any part"

**How to master**

- Master the **Single Responsibility Principle** in practice — a class, module, or service should have one reason to change. The test: if you can describe what a component does and the description includes the word "and", it probably has too many responsibilities.
- Understand **high cohesion and low coupling** as diagnosable design qualities — cohesion means things that belong together (because they change for the same reason) are grouped together. Coupling means dependencies between components are minimal and explicit. High coupling shows up when a change in one module forces changes in many others. Low cohesion shows up when a module contains unrelated functionality.
- Know **Domain-Driven Design** concepts: Bounded Context (each module has its own model; the same word can mean different things in different contexts), Ubiquitous Language (the code reflects the domain vocabulary), and Context Mapping (how bounded contexts communicate — directly, through an anti-corruption layer, or as separate domains).
- Practice **dependency injection** — when a class creates its own dependencies internally (`new DatabaseConnection()`), it is tightly coupled to that implementation. When it receives them from outside (constructor injection), it can be used with any implementation, including test doubles.
- Know the **modularity smell:** when adding a small feature requires understanding and modifying many unrelated modules, that is a coupling failure. When a single module contains unrelated functionality, that is a cohesion failure. Learn to diagnose which problem you have before attempting to fix it.

**What I've seen**

- *IDM:* Built with hexagonal architecture (ports and adapters), a smart repository pattern, and DDD thinking. The core domain is isolated from infrastructure — databases, connectors, and external systems connect through ports. The core doesn't depend on them.

**Connects to**

- **Maintainability** — modular code is easier to understand and change
- **Testability** — isolated modules are much easier to test
- **Extensibility** — you can only extend a module without affecting others if modules are properly bounded
- **Interoperability** — clean interfaces between modules become integration points
- **Scalability** — independent modules can be scaled independently

---

### Extensibility

**What is it**
New capabilities can be added to the system without modifying existing, working code. The system is open to extension and closed to modification of stable parts (the Open/Closed Principle). Extensibility is different from Modularity: modularity is about structure, extensibility is about growth.

**What it includes**

- **Plugin/extension architectures** — new behavior can be added by implementing a defined interface
- **Hooks and events** — the system emits events that others can react to without coupling
- **Strategy pattern** — algorithms and behaviors can be swapped without modifying callers
- **Feature flags** — new features can be enabled/disabled without code changes
- **Versioned APIs** — adding new API versions without breaking existing consumers
- **Backward compatibility** — new versions do not break existing integrations
- **Open/Closed Principle** — code is written to be extended, not modified

**Where in the SDLC**

- **Design** — identify likely extension points before building. Don't over-engineer, but design for the extensions you know are coming.
- **Development** — program to interfaces not implementations, use events/hooks where appropriate, version APIs from day one
- **Testing** — test extension points explicitly, test that existing behavior is unaffected when extensions are added

**How to measure**

- *Engineer level:* Number of files changed when adding a new "type" of something (new device type, new auth provider), number of breaking API changes per release
- *At a glance:* Time to integrate a new partner/client, time to add a new product feature type
- *Red flag:* "Every time we add a new X, we have to change code in 15 places"

**How to master**

- Understand the **Open/Closed Principle** in practice — a component is open for extension (you can add new behavior) but closed for modification (you don't have to change existing, tested code to do so). The skill is identifying which behaviors are likely to vary and designing those as extension points.
- Know the key **design patterns for extensibility:**
  - **Strategy** — encapsulate a family of algorithms behind a common interface; swap them at runtime without modifying the caller
  - **Observer / Event** — components react to events emitted by another without being coupled to the emitter; the emitter doesn't know who is listening
  - **Template Method** — define the skeleton of an algorithm in a base class, defer specific steps to subclasses
  - **Plugin / SPI (Service Provider Interface)** — define a contract that extensions must implement; the core system discovers and loads them dynamically
- Know **API versioning** — semantic versioning (major.minor.patch), what constitutes a breaking change (removing a field, changing a type, removing an endpoint), and how to evolve APIs without breaking consumers (additive-only changes, deprecation windows before removal).
- Understand the **cost of extension points** — every extension point is an abstraction that adds complexity. Design them for extensions you know are coming, not for hypothetical future requirements. Premature extensibility is its own form of technical debt.

**What I've seen**

- *IDM:* Connectors are developed as completely separate projects implementing a defined interface. Adding a new connector requires zero changes to IDM's core codebase.

**Connects to**

- **Modularity** — extensibility requires modules with clear boundaries
- **Maintainability** — extensible systems accumulate less technical debt when requirements change
- **Interoperability** — extension points are often integration points

---

### Interoperability

**What is it**
The system can communicate and work effectively with other systems — internal or external — using well-defined, standards-based interfaces. For identity systems, network systems, and platform products, this is often a top-3 property.

**What it includes**

- **API design** — REST, GraphQL, gRPC, WebSockets: the right protocol for the use case
- **Standard protocols** — using established standards:
  - Identity: OAuth 2.0, OIDC, SAML 2.0
  - Network management: SNMP, NETCONF, RESTCONF
  - Messaging: AMQP, MQTT, Kafka protocols
- **Data format contracts** — OpenAPI/Swagger for REST, AsyncAPI for events, protobuf for gRPC
- **Webhooks and event-driven integration** — systems can notify others without polling
- **Versioning and backward compatibility** — integrations survive API evolution
- **Integration patterns** — Adapter, Anti-Corruption Layer, API Gateway
- **API discoverability** — consumers can find and understand the API (documentation, developer portal)
- **Contract testing** — verify that producer and consumer agree on the interface

**Where in the SDLC**

- **Requirements** — map all integrations (who calls whom? what data flows where?), define integration contracts early
- **Design** — API-first design: define the API contract before implementing it. Consumers and producers agree on the contract.
- **Development** — generate SDKs/clients from OpenAPI specs, implement contract tests
- **Testing** — integration tests, contract tests, end-to-end tests across service boundaries
- **Shift left:** API contracts should be defined and agreed upon before any implementation starts. Changing an API contract after clients are built is expensive.

**How to measure**

- *Engineer level:* API contract coverage % (all APIs have OpenAPI specs), contract test pass rate, number of breaking change incidents
- *At a glance:* Time to integrate a new system, partner integration success rate, API adoption rate
- *Red flag:* "We'll document the API later", no contract tests, integration breaking changes discovered in production

**How to master**

- Know **API-first design** — write the OpenAPI specification before writing any implementation. The contract defines what the API does; both consumer and producer can work from it independently. Especially important when multiple teams are involved.
- Understand **consumer-driven contract testing** — the consumer of an API defines exactly what it expects from the provider (which fields, which formats, which status codes), and a test suite verifies the provider meets those expectations. This catches breaking changes before they reach production.
- Know the **standard identity protocols** at a flow level — OAuth 2.0 (how an application obtains delegated access), OIDC (how an application verifies who a user is), SAML 2.0 (enterprise federation for SSO). For IDM, know these deeply. For other products, know them well enough to integrate with IDM correctly.
- Understand the **core integration patterns:** Adapter (translate between two incompatible interfaces without modifying either), Anti-Corruption Layer (protect your domain model from the concepts of an external system you don't control), API Gateway (single entry point that handles routing, authentication, and rate limiting).
- Know **event-driven integration** — webhooks, message queues, and event streams as alternatives to synchronous API calls. Understand when async integration is better: when the caller doesn't need an immediate response, when you need to decouple availability, or when multiple consumers need the same event.

**What I've seen**

- *IDM:* gRPC was chosen for connector communication — it supports streaming over a single persistent connection, which fits the continuous sync pattern. REST is used for the UI-facing API, matching the request-response model of browser clients.

**Connects to**

- **Security** — inter-system communication must be secured (API keys, mTLS, OAuth tokens)
- **Modularity** — clean module boundaries become clean integration interfaces
- **Extensibility** — integration points are extension points
- **Availability** — if IDM is unavailable, everything that depends on it is unavailable (dependency availability)

---

### Portability

**What is it**
The system can run in different environments — different machines, operating systems, cloud providers, or infrastructure configurations — without significant rework. "Works on my machine" is the classic portability failure.

**What it includes**

- **Containerization** — Docker: the system and all its dependencies are packaged together
- **Container orchestration** — Kubernetes: containers are managed and scheduled consistently
- **Environment parity** — development, staging, and production environments are as similar as possible
- **Infrastructure-as-code (IaC)** — infrastructure is defined in code (Terraform, Ansible, Pulumi) and can be reproduced
- **Configuration externalization** — all environment-specific config comes from environment variables or config services, never hardcoded
- **12-Factor App principles** — 12 design principles for building portable, cloud-native applications. The most impactful ones for portability:
  - **Config via environment (Factor III)** — everything that differs between environments comes from environment variables, not code
  - **Stateless processes (Factor VI)** — no session state in application memory; any instance can serve any request
  - **Dev/prod parity (Factor X)** — development and production use the same type of database, same OS, same configuration mechanism
  - **Backing services as attached resources (Factor IV)** — treat your database, cache, and queue as interchangeable resources identified by config, not hardcoded connections
- **Cloud-agnostic design** — avoid heavy vendor-specific lock-in where it matters

**Where in the SDLC**

- **Design** — define the target environments, choose containerization strategy, design config externalization
- **Development** — follow 12-Factor principles, no hardcoded environment-specific values, provide a local development environment setup
- **Deployment** — IaC for all infrastructure, container builds in CI, consistent artifact promotion across environments
- **Shift left:** Portability problems show up at deployment time. Design for them early.

**How to measure**

- *Engineer level:* Time to set up a new development environment (from zero to running), number of environment-specific code paths, CI/CD pipeline success rate across environments
- *At a glance:* New developer onboarding time (directly measures portability), deployment success rate across environments
- *Red flag:* "It works on my machine but not staging", manual infrastructure setup steps, environment-specific code scattered through the codebase

**How to master**

- Understand **containerization deeply** — not just how to write a Dockerfile, but what a container actually provides (isolated process namespace, isolated filesystem, reproducible environment). Know what makes a good container image: minimal base image, no secrets baked in, single process per container, stateless.
- Know the **12-Factor App principles** — especially the four listed above. Understanding them means you can evaluate any codebase and say "this violates Factor VI because it stores session data in memory."
- Understand **Infrastructure-as-Code** as the portability standard for infrastructure — if you cannot recreate your entire environment from a git repository, it is not portable. Every infrastructure change goes through code review, not manual console changes.
- Know **environment variable-based configuration management** — how to structure config per environment, how dotenv files work for local development, and what must never be in a config file committed to git (secrets, credentials, environment-specific URLs).
- Know the smell: **"it works on my machine"** is always a portability failure. The solution is environment parity and reproducible builds, not heroic debugging.

**What I've seen**

- *All projects:* All projects are Dockerized — each project and its dependencies are containerized, so they run consistently across local development, CI, and production environments.

**Connects to**

- **Deployability** — portable apps are dramatically easier to deploy
- **Maintainability** — consistent environments make debugging reliable
- **Modularity** — well-bounded modules are more portable
- **Reliability** — environment inconsistency is a reliability risk

---

## Group 5 — Engineering Excellence

> Is it easy to build, change, and evolve?

---

### Maintainability

**What is it**
How easily the system can be understood, modified, fixed, and extended by developers over time — including developers who didn't write it originally. Maintainability is what separates software that ages well from software that becomes a burden.

**What it includes**

- **Code readability** — code reads like prose, not a puzzle. Variable and function names communicate intent.
- **Code complexity** — low cyclomatic complexity, short functions, clear control flow
- **Documentation** — inline comments for non-obvious logic, architecture decision records (ADRs), API docs
- **Technical debt management** — technical debt is code, design, or infrastructure that works today but slows everything down tomorrow. Like financial debt, it accrues interest: the longer it is left unpaid, the slower every future change becomes. The key distinction: intentional debt (a known shortcut with a documented plan to address it — sometimes acceptable) vs accidental debt (nobody realized it was a problem — always accumulates silently).
- **Naming conventions and coding standards** — the team writes code that looks consistent regardless of who wrote it
- **Refactoring safety** — the codebase can be safely improved over time (requires testability)
- **Onboarding time** — how long does a new developer take to make their first contribution?
- **Dependency hygiene** — dependencies are kept up to date, outdated/unmaintained libraries are replaced

**Where in the SDLC**

- **Design** — architecture that enables change (not just current requirements)
- **Development** — coding standards, code review, addressing debt in every sprint (not just sprints dedicated to tech debt)
- **Ongoing** — regular refactoring, dependency updates, architecture reviews
- **Shift left:** Unmaintainable code compounds. A little attention every sprint prevents large, expensive rewrites later.

**How to measure**

- *Engineer level:* Cyclomatic complexity (SonarQube), code duplication % (aim for < 3%), average PR review time, onboarding time for a new dev
- *At a glance:* Time to implement a new feature of similar complexity over time (should stay flat, not grow), technical debt ratio (SonarQube), onboarding time trend
- *Red flag:* "Nobody touches that code", fear of refactoring, new features require modifying many unrelated files

**How to master**

- Understand and **manage technical debt deliberately** — know the difference between intentional debt (acceptable, documented, with a plan) and accidental debt (never acknowledged, no plan). The former is a tool; the latter is a slow disaster. Make technical debt visible: track it, prioritize it, and pay it down in every sprint.
- Master **naming as the primary maintainability skill** — the difference between `processData()` and `calculateMonthlyInterestForOverdueAccounts()` is the difference between code you fear touching and code you can safely modify. Names should express intent and domain concepts, not implementation details.
- Know **Architecture Decision Records (ADRs)** — short documents that capture why an architectural decision was made: the context, the options considered, the decision, and the consequences. The "why" is what gets lost over time and makes old code unmaintainable. An ADR preserves it.
- Practice **incremental refactoring** — improve code in small, safe steps. A function is too long: extract one helper. A class has too many responsibilities: extract one new class. Never a big bang rewrite. The safety net for refactoring is a good test suite.
- Know the **Strangler Fig pattern** for replacing legacy code — don't rewrite a large unmaintainable module all at once. Instead, grow the new implementation around the old one, gradually routing behavior through the new code until the old code is no longer called and can be safely removed.

**What I've seen**

- *IDM:* CI/CD enforces linting, formatting, and automated tests on every merge. Combined with code reviews and clear coding standards, the codebase reads as if written by a single developer — easy to navigate and trust regardless of who wrote a given section.

**Connects to**

- **Testability** — tests make refactoring safe, which makes maintenance practical
- **Modularity** — modular code is dramatically more maintainable
- **Observability** — you need to observe production behavior to know what to maintain/fix
- **Extensibility** — extensible code is maintainable code

---

### Testability

**What is it**
How easy it is to write automated tests for the system and verify its behavior with confidence. Testability is a design property — you cannot retrofit it into code that was not designed for it.

**What it includes**

- **Unit testability** — individual functions/classes can be tested in isolation
- **Dependency injection** — dependencies are injected (not created internally), allowing test doubles
- **Pure functions** — functions that have no side effects are trivially testable
- **Seams** — points in the code where behavior can be controlled during tests without modifying production code
- **Test pyramid** — the right balance of unit, integration, and end-to-end tests
- **Test isolation** — tests do not depend on each other, can run in any order, and do not share state
- **Mocking and stubbing** — external dependencies (databases, APIs, queues) can be replaced with test doubles
- **Test data management** — creating, managing, and cleaning up test data
- **CI test gates** — tests run automatically on every change and block merging if they fail

**The Test Pyramid:**

```
        /\
       /E2E\      (few, slow, expensive — test user journeys)
      /______\
     /Integr. \   (some — test component interactions)
    /___________\
   /  Unit Tests  \ (many, fast, cheap — test individual logic)
  /_________________\
```

**Where in the SDLC**

- **Design** — design for testability from day one. Ask: "how would I test this?" before writing code.
- **Development** — write tests alongside code, maintain test quality with the same care as production code
- **CI/CD** — automated test execution on every push, test coverage gates, flaky test monitoring
- **Shift left:** Testing is not a phase at the end. Every line of code should be written with its test in mind.

**How to measure**

- *Engineer level:* Test coverage % (line, branch, mutation), flaky test rate (should be < 1%), test execution time, defect escape rate
- *At a glance:* Defect escape rate trend, hotfix frequency (hotfixes indicate insufficient testing), regression incident count
- *Red flag:* "We'll write tests later", test coverage under 60% for core business logic, frequent production bugs that should have been caught by tests

**How to master**

- Know the **test doubles vocabulary** and use the right type — stub (returns predetermined values, controls indirect inputs), mock (verifies that specific calls were made, tests interactions), spy (records calls for later assertion), fake (a working but simplified implementation, e.g. an in-memory database), dummy (a placeholder never actually used). Using a mock when you need a stub creates brittle tests that break when implementation details change.
- Understand **dependency injection as the foundational testability technique** — code that creates its own dependencies internally cannot be tested in isolation because you cannot replace them. Code that receives dependencies from outside can have any dependency replaced with a test double, enabling true unit testing.
- Know the **test pyramid and apply it deliberately** — unit tests (fast, test a single unit of logic in isolation, make up the majority), integration tests (test how components interact, use real databases/queues, fewer), end-to-end tests (test complete user flows, slow and expensive, use sparingly). An inverted pyramid — many slow E2E tests, few unit tests — means a slow and fragile test suite.
- Understand **what makes tests flaky** — tests that pass sometimes and fail sometimes due to timing, shared state, network calls, or test ordering. Flaky tests are worse than no tests because they erode trust in the test suite and make CI unreliable.
- Learn **mutation testing** as a test quality check — mutation testing introduces deliberate small defects (e.g. change `>` to `>=`) and checks whether your tests catch them. High line coverage with many surviving mutations means your tests run the code but don't verify its behavior.

**What I've seen**

- *IDM:* Followed the classic test pyramid — unit tests for individual business logic, integration tests for component interactions, and end-to-end tests for full user journeys.

**Connects to**

- **Correctness** — tests are how correctness is verified and maintained over time
- **Maintainability** — tests make refactoring safe
- **Reliability** — tested systems have fewer production failures
- **Modularity** — modular code (with dependency injection) is testable code

---

### Deployability

**What is it**
How safely, quickly, and reliably new versions of the system can be shipped to production. Deployability is the operational counterpart to maintainability — a well-maintained codebase that cannot be deployed reliably provides little value.

**What it includes**

- **CI/CD pipelines** — automated build, test, and deployment on every change
- **Deployment strategies:**
  - **Blue-green deployment** — two identical environments, switch traffic instantly
  - **Canary deployment** — roll out to a small % of users first
  - **Rolling deployment** — replace instances one by one
  - **Feature flags** — deploy code but control when features are activated
- **Zero-downtime deployments** — users never experience downtime during a release
- **Rollback capability** — if a deployment goes wrong, you can revert quickly and safely
- **Artifact management** — every deployed version is a versioned, immutable artifact
- **DORA Metrics** — the industry standard for measuring deployability:
  - Deployment Frequency
  - Lead Time for Changes
  - Change Failure Rate
  - Mean Time to Restore (MTTR)

**The DORA Metric Benchmarks (2023):**

| Metric | Elite | High | Medium | Low |
|--------|-------|------|--------|-----|
| Deployment Frequency | Multiple/day | Weekly | Monthly | < Monthly |
| Lead Time | < 1 hour | < 1 day | 1 week–month | > 1 month |
| Change Failure Rate | 0–5% | 5–10% | 10–15% | 15–30% |
| MTTR | < 1 hour | < 1 day | < 1 day | > 1 week |

**Where in the SDLC**

- **Design** — design for deployment: stateless services, database migration strategy, feature flag architecture
- **Development** — CI pipeline configuration, deployment scripts, database migration scripts alongside code changes
- **Operations** — deployment runbooks, post-deploy monitoring, on-call rotations
- **Shift left:** Deployment should be a daily, boring activity — not a stressful, quarterly event.

**How to measure**

- *Engineer level:* DORA metrics (deployment frequency, lead time, change failure rate, MTTR), pipeline execution time, rollback success rate
- *At a glance:* DORA metrics benchmarked against industry (Elite/High/Medium/Low), deployment-related incident count
- *Red flag:* Deployments that require downtime, fear of deploying on Fridays, deployments that take hours and many manual steps

**How to master**

- Know the **DORA metrics and what they reveal** — Deployment Frequency (how often value reaches users), Lead Time for Changes (how long from commit to production — measures feedback loop size), Change Failure Rate (% of deployments that cause an incident — measures stability), Mean Time to Restore (how fast you recover). These four numbers tell you more about an engineering team's delivery health than almost anything else.
- Understand **deployment strategies and their tradeoffs:** blue-green (two identical environments, instant traffic switch — fast rollback, infrastructure-heavy), canary (route a small % to the new version first — catches problems early with limited blast radius), rolling (replace instances one at a time — resource-efficient, slower rollback), feature flags (deploy code separately from activating it — the most flexible and safest approach when applicable).
- Know the **expand/contract pattern** for zero-downtime database migrations — to change a column or table: add the new structure alongside the old (expand), migrate data in the background, update code to use the new structure, verify, then remove the old structure (contract). Never drop a column in the same deployment that removes the code using it.
- Understand **feature flags as a deployment risk management tool** — separating "code is in production" from "feature is active for users" means you can merge incomplete features to main (avoiding long-lived branches), dark-launch to test in production with real data, and roll back a feature instantly without a redeployment.
- Know **what makes a deployment safe** — it is automated (no manual steps), fast (feedback in minutes), reversible (rollback plan exists and has been tested), and observed (post-deploy monitoring runs automatically and alerts on anomalies).

**Connects to**

- **Availability** — deployments are a leading cause of availability incidents
- **Reliability** — high change failure rate = unreliable deployments = production incidents
- **Observability** — post-deploy monitoring is essential for safe deployments
- **Testability** — CI test gates are the safety net for deployments

---

## Group 6 — Scale & Operations

> Can it handle growth and can we understand it in production?

---

### Scalability

**What is it**
The system can handle increased load — more users, more data, more requests — by adding resources, without requiring fundamental redesign. Scalability is the ability to grow on demand.

**What it includes**

- **Horizontal scaling** — adding more instances of the same service (scale out)
- **Vertical scaling** — adding more resources to existing instances (scale up) — has limits
- **Stateless design** — services do not store user session state in memory, so any instance can serve any request
- **Database scaling** — read replicas, sharding, partitioning, caching to reduce database load
- **Caching layers** — CDN for static assets, Redis/Memcached for computed data, application-level caching
- **Asynchronous processing** — heavy operations are queued and processed asynchronously, not in the request path
- **Load balancing** — requests are distributed evenly across instances
- **Auto-scaling** — infrastructure automatically adds/removes instances based on current load

**Where in the SDLC**

- **Requirements** — define load expectations: how many users? peak concurrent? data growth rate? (many teams never define this)
- **Design** — stateless services, database access patterns designed for scale, async architecture where needed
- **Development** — no in-memory session state, connection pooling, efficient queries
- **Operations** — auto-scaling configuration, load testing before major events, capacity planning
- **Shift left:** Scalability constraints (particularly stateful session design and database architecture) are expensive to change post-launch.

**How to measure**

- *Engineer level:* Response time and error rate at 2x/5x/10x normal load, database query times under load, cache hit rate, saturation point (where does it start degrading?)
- *At a glance:* Cost per unit of load (does infrastructure cost grow linearly or faster than user growth?), incidents caused by load spikes
- *Red flag:* State stored in application memory (prevents horizontal scaling), database CPU at 80%+ at normal load

**How to master**

- Understand **stateless design as the prerequisite for horizontal scaling** — a stateless service holds no user-specific state in memory between requests. This means any instance can handle any request, so you can run as many instances as needed. Session state stored in application memory is the most common thing that prevents horizontal scaling.
- Know **caching strategies and their tradeoffs:** cache-aside (application checks cache, loads from source on miss — simple but miss storms can occur on cold start), write-through (cache updated on every write — consistent but adds write latency), write-behind (writes go to cache first, source updated asynchronously — fast writes but risk of data loss). Know TTL management and cache invalidation.
- Understand **asynchronous processing** — moving work out of the synchronous request path into a queue. The pattern: the API receives the request, enqueues the work, returns immediately with a job ID. A background worker processes the job. This decouples user-facing latency from the cost of the operation and allows independent scaling of the processing tier.
- Know **database scaling patterns:** read replicas (direct read traffic away from the write primary — good when reads dominate), CQRS (separate read and write models — good for complex query requirements), connection pooling (databases have a finite number of connections; pool them at the application layer to avoid exhaustion under load).
- Understand **load testing as a scaling discipline** — load testing finds the saturation point before production does. Know the difference: load test (normal throughput under expected load), stress test (at what load does the system break?), soak test (does performance degrade over time under sustained load?).

**Connects to**

- **Performance** — scalability maintains performance under load
- **Availability** — systems that can't scale become unavailable under load
- **Deployability** — auto-scaling requires deployment automation
- **Reliability** — overloaded systems become unreliable

---

### Observability

**What is it**
The ability to understand the internal state of a system by examining its external outputs. A highly observable system lets you ask questions you didn't anticipate and get answers without deploying new code. It is your eyes and ears in production.

**The Three Pillars:**

| Pillar | What it answers | Examples |
|--------|-----------------|----------|
| **Logs** | What happened? | Structured logs, error logs, audit logs, request logs |
| **Metrics** | How is the system performing over time? | Request rate, error rate, latency, CPU, memory, queue depth |
| **Traces** | How did this specific request flow through all the services? | Distributed traces with spans across microservices |

**Monitoring vs Observability:**

- **Monitoring** = watching dashboards for known problems. "Is this metric above this threshold?"
- **Observability** = the ability to explore unknown problems. "Why is p99 latency high for users in this region on Tuesdays?"

**What it includes**

- **Structured logging** — JSON logs with consistent fields (timestamp, level, service, trace ID, user ID) that are searchable and filterable
- **Metrics collection** — counters (total requests), gauges (current connections), histograms (latency distribution)
- **Distributed tracing** — a trace ID follows a request across all services; you can see where time was spent
- **Dashboards** — visual representation of metrics for at-a-glance system health
- **Alerting** — automated notification when metrics breach defined thresholds (SLO-based alerting is best practice)
- **SLO monitoring** — alerting when your Service Level Objectives are at risk
- **On-call runbooks** — documented procedures for responding to alerts

**Where in the SDLC**

- **Design** — instrument from day one. Define what you need to observe to know the system is healthy. Design your SLIs/SLOs.
- **Development** — emit structured logs, metrics, and traces as part of feature development (not as an afterthought)
- **Operations** — dashboards, alert configuration, on-call rotation, incident response using observability data
- **Shift left:** A feature deployed without observability is a feature that will be invisible when it breaks. Ship observability with the feature.

**How to measure**

- *Engineer level:* % of services with dashboards, % of services with SLO-based alerts, MTTR (lower MTTR = better observability), % of incidents detected by alerting vs. user reports
- *At a glance:* MTTR trend, % of production incidents with clear root cause (observable systems have clearer root causes), alert signal-to-noise ratio
- *Red flag:* "We had no idea this was broken until a customer told us", debugging in production requires reading raw server logs

**How to master**

- Understand the **three pillars and what questions each answers** — logs (what happened? event-by-event, text-searchable), metrics (how is the system performing over time? quantified, aggregated, graphable), traces (how did this specific request flow through all services? spans with parent/child relationships across service boundaries). Each answers different questions; you need all three.
- Know **structured logging in practice** — logs should be machine-parseable JSON with consistent fields, not free-text strings. Every log event should have: timestamp, severity level, service name, trace ID (to correlate with traces), and contextual fields relevant to the operation. This transforms logs from text you search manually into data you query.
- Understand **distributed tracing** — a trace ID is generated at the entry point of a request and propagated through every service it touches. Each service records a span (start time, end time, outcome, metadata). The result is a complete picture of the request's journey: which services it went through, how long each took, and where failures occurred.
- Know **SLO-based alerting** — instead of alerting when a metric crosses a threshold (CPU > 80%), alert when you are burning through your error budget too fast ("at this error rate, we will breach our SLO within hours"). This aligns alerts with actual user impact, reduces false positives, and gives an actionable signal.
- Understand the difference between **reactive and proactive observability** — reactive: investigating a known problem after it is reported. Proactive: exploring the system to find problems before they impact users. A truly observable system lets engineers ask new questions without deploying new instrumentation.

**What I've seen**

- *IDM (in progress):* Collecting traces, metrics, and logs from the backend; database metrics; and traces, logs, and metrics from the frontend — all with correlation IDs so a single request can be tracked end-to-end across all layers.

**Connects to**

- **Reliability** — observability enables faster MTTR and therefore better reliability
- **Performance** — metrics reveal performance problems
- **Security** — security monitoring (detecting attacks) is a form of observability
- **Deployability** — post-deploy monitoring is observability applied to the deployment process
- **Maintainability** — logs help developers understand and debug the system

---

## Reference Sections

### Property Relationship Map

```
FOUNDATIONAL LAYER
┌─────────────────────────────────────────────────────┐
│ Correctness → everything depends on this            │
│ Modularity  → enables most other properties         │
└─────────────────────────────────────────────────────┘

KEY ENABLING CHAINS
Modularity ──────────► Testability ──────────► Maintainability
     │                                               │
     └──────────────── Extensibility ◄──────────────┘

Observability ──────► Reliability ──────────► Availability

Security ───────────► Privacy
Security ───────────► Auditability

TENSIONS (optimizing one can hurt the other)
Performance  ◄──VS──► Maintainability  (optimized code is often complex)
Performance  ◄──VS──► Security         (encryption adds latency)
Scalability  ◄──VS──► Data Integrity   (distributed systems trade consistency for scale)
Extensibility ◄─VS──► Simplicity       (extension points add abstraction)

CROSS-CUTTING (affects all others)
Observability: you cannot improve what you cannot see
Testability:   you cannot safely change what you cannot test
```

---

### SDLC Placement Summary

| Property | Requirements | Design | Development | Testing | Deployment | Operations |
|----------|-------------|--------|-------------|---------|------------|------------|
| Correctness | ★★★ | ★★ | ★★★ | ★★★ | | |
| Reliability | ★★ | ★★★ | ★★ | ★★ | | ★★★ |
| Availability | ★★★ | ★★★ | | | ★★ | ★★★ |
| Data Integrity | ★ | ★★★ | ★★ | ★★ | | ★ |
| Usability | ★★★ | ★★★ | ★★ | ★★ | | |
| Performance | ★★ | ★★★ | ★★ | ★★★ | | ★★ |
| Security | ★★★ | ★★★ | ★★★ | ★★ | | ★★ |
| Privacy | ★★★ | ★★★ | ★★ | ★ | | ★★ |
| Auditability | ★★★ | ★★★ | ★★ | | | ★ |
| Modularity | | ★★★ | ★★ | ★ | | |
| Extensibility | | ★★★ | ★★ | ★★ | | |
| Interoperability | ★★★ | ★★★ | ★★ | ★★★ | | |
| Portability | | ★★★ | ★★ | | ★★★ | |
| Maintainability | | ★★ | ★★★ | ★ | | ★ |
| Testability | | ★★★ | ★★★ | ★★ | | |
| Deployability | | ★★ | ★★ | ★★ | ★★★ | ★★ |
| Scalability | ★★ | ★★★ | ★★ | ★★ | | ★★ |
| Observability | ★ | ★★★ | ★★★ | | ★★ | ★★★ |

★★★ = Primary phase | ★★ = Important | ★ = Relevant

---

### Where to Start — Priority Guide

Not all 18 properties can be addressed at once. Here is a suggested priority order:

**Priority 1 — Foundation** (do these now, or pay a much higher price later)

1. **Correctness** — if it's not right, nothing else matters
2. **Security** — especially for IDM. Cannot be retrofitted cheaply.
3. **Modularity** — architectural decisions now save massive refactoring cost later
4. **Testability** — without this, you cannot safely change anything

**Priority 2 — Operational Readiness** (as products go to more customers)

5. **Observability** — your safety net in production, especially without a testing team
6. **Reliability** — customers notice outages; this affects trust and revenue
7. **Deployability** — shipping safely and frequently is a competitive advantage
8. **Maintainability** — the team's velocity depends on this; it compounds over time

**Priority 3 — Growth Properties** (as scale and team size increase)

9. **Performance** — define SLOs, measure, and address bottlenecks
10. **Scalability** — design for it before you need it, but not before you need it
11. **Interoperability** — as integration requirements grow
12. **Extensibility** — as product feature complexity grows

**Priority 4 — Trust and Compliance** (as the customer base matures)

13. **Auditability** — before enterprise customers require it
14. **Availability** — formally define and commit to SLAs
15. **Privacy** — before regulatory obligations become urgent
16. **Data Integrity** — as data volume and criticality grow

**Priority 5 — Polish and Reach**

17. **Usability** — continuously, but formally invest as UX becomes a differentiator
18. **Portability** — invest early in containerization, reaps benefits long-term
