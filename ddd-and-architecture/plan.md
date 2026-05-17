# DDD: A Way of Thinking (and the Architectures It Can Live In)

**Working title** (deliberately chosen over "DDD & Software Architecture" — the talk's whole point is that DDD is *not* an architecture).

**Duration:** ~3 hours (two short breaks). Content-rich — see "What to cut if you're behind" before delivering.
**Format:** Introduction-level. Assumes the audience knows OOP and has shipped real apps, but is new to DDD.
**Code:** All code examples in **.NET 10 / C# 14**. See the ".NET 10 conventions" section so every snippet is consistent.

**Primary sources:**
- *Domain-Driven Design: Tackling Complexity in the Heart of Software* — Eric Evans (the "Blue Book", 2003) — philosophy & vocabulary.
- *Implementing Domain-Driven Design* — Vaughn Vernon (the "Red Book", 2013) — the practical "how".
- *Domain-Driven Design Distilled* — Vaughn Vernon (2016) — short, **strategy-first**; closest to this talk's thesis.
- *Domain Modeling Made Functional* — Scott Wlaschin (2018) — the proof that DDD is **not** tied to one architecture or even to OOP.
- *DDD, Hexagonal, Onion, Clean, CQRS… How I put it all together* — Herberto Graça ("Explicit Architecture", 2017) — the canonical synthesis showing Hexagonal/Onion/Clean are one composable idea, not rivals.
- *Patterns of Enterprise Application Architecture* — Martin Fowler — Transaction Script & Active Record, for proportioning architecture *down* when a subdomain doesn't earn the full treatment.

---

## The thesis (say this out loud, more than once)

> **DDD is a way of thinking about software, not an architecture.**
>
> - Its **strategic** design (ubiquitous language, bounded contexts, context mapping) is *architecture- and paradigm-agnostic*. It works the same whether you ship a monolith, microservices, layered, hexagonal, or functional code.
> - Its **tactical** patterns (entities, value objects, aggregates, repositories) assume a roughly object-shaped model — and even those are *optional* (Wlaschin's functional DDD is the proof).
> - DDD *pairs with* many architectures (layered, hexagonal, onion, clean, CQRS, event sourcing, microservices, modular monolith). It *is* none of them.

Pre-empt the sharp attendee who says "but aggregates and repositories sure look like an architecture" — that's why the strategic/tactical distinction above is stated precisely.

**Corollary — the proportional rule:** strategic + tactical DDD stays *constant*; *how much* architecture you wrap around it scales with the subdomain. A core subdomain earns the full Layered → Hexagonal → Onion → Clean treatment; a supporting or generic one may deserve only a slice of it (or Transaction Script / CRUD). Choosing *less* architecture is **not** "DDD-lite" — DDD-lite means dropping the *strategic* work, which is the failure mode. Full DDD with a deliberately light architecture has no canonical name (the nearest is "Pragmatic DDD"); it's just the thesis working as intended.

**Delivery rule that protects the thesis:** Blocks 2 and 3 (language, bounded contexts, context mapping) are **diagram-only — zero C#**. The strategic message must land *before* the first line of code, or the code wins and the audience leaves thinking "DDD = these C# patterns." All .NET code is fenced into Blocks 4 and 5.

---

## Time budget at a glance

| Block | Topic | Duration |
|---|---|---|
| 0 | Opening & framing (thesis stated up front) | 10 min |
| 1 | Why DDD? The problem it solves (+ the "DDD-lite" trap) | 22 min |
| 2 | Ubiquitous Language & Knowledge Crunching (diagram-only) | 23 min |
| — | **Break 1** | 10 min |
| 3 | Strategic Design: Bounded Contexts & Context Mapping (incl. ~12 min group exercise) | 45 min |
| 4 | Tactical Design: one worked aggregate in .NET 10 | 33 min |
| — | **Break 2** | 10 min |
| 5 | Architecture — the *proof* of the thesis (three orthogonal axes; DDD on none) | 27 min |
| 6 | Zoom out: the whole running domain in one picture | 10 min |
| 7 | Recap, peer study topics & Q&A | 15 min |
| **Total** | | **~3 hr 25 min** (table includes buffer; disciplined delivery lands ~3 hr 10 min) |

**One running domain for the entire talk: e-commerce** (Catalog, Orders, Shipping, Identity, Payments). The worked aggregate is `Order` + `OrderLine`. We never introduce a second domain — every block zooms in or out of this one. This is deliberate: every new domain is a context-reload tax on a first-time audience.

---

## Block 0 — Opening & Framing (10 min)

**Objective:** Set expectations, hook the audience, and plant the thesis on slide one.

- Who this is for and what it is *not* (not a tutorial, not zero-to-hero, not a C# patterns class).
- Short story: a project that drowned in its own complexity; why "more frameworks" didn't help.
- The thesis slide (verbatim from above). Promise: "By the end you'll watch the *same* e-commerce model hold still while we change the dependency structure, the persistence, and the deployment around it — and you'll see DDD never moved."
- The four books and what each contributes (Evans = philosophy, Vernon Red = how, Vernon Distilled = strategy-first, Wlaschin = not-an-architecture proof).
- One sentence to remember: *DDD puts the **business domain** at the center of how software is designed.*

---

## Block 1 — Why DDD? The Problem It Solves (22 min)

**Objective:** Make the pain *visceral and concrete* before any abstraction. A first-time audience needs something from their own codebase to hang the next 90 minutes of theory on.

### 1.1 Two kinds of complexity (4 min)
- **Accidental** (tools, frameworks) vs **essential** (the business itself).
- DDD targets essential complexity. Frameworks don't.

### 1.2 The visceral moment — anemic vs. rich (8 min)
- Show **two .NET snippets of the same e-commerce feature**: an anemic `OrderService.AddItem(order, ...)` mutating a bag-of-properties `Order`, vs. an `Order` that owns `AddLine(...)` and protects its own invariants.
- This is the *only* code in Block 1 and it exists purely to make them feel the pain they already know. (It pays off again in Block 4 — same `Order`.)
- Symptoms named: the anemic application, the translation tax (business says one thing, code says another, DB a third), the big ball of mud and how teams *get* there.

### 1.3 Where DDD fits — and the "DDD-lite" trap (10 min)
- Not every project needs DDD. It pays off when **the domain is the hard part**. When it doesn't: CRUD apps, simple integrations, throwaway tools.
- **DDD ≠ microservices, ≠ a framework, ≠ clean architecture.**
- **The "DDD-lite" failure mode (high-leverage slide):** the most common way DDD fails is teams adopting *only* the tactical patterns — "we have entities and repositories, so we do DDD" — while skipping the strategic work entirely. Naming this explicitly is the most direct possible support for the thesis: DDD is a way of thinking, not a pattern checklist. This slide is the bridge into Blocks 2–3.

---

## Block 2 — Ubiquitous Language & Knowledge Crunching (23 min) — *diagram-only, no C#*

**Objective:** Introduce the single most important practice. If they remember one thing, it's this.

### 2.1 The Ubiquitous Language (8 min)
- One shared language between developers and domain experts; it lives in conversations, documents, **and the code**.
- Example (described, not coded): renaming `OrderProcessor.handle()` → `Order.Submit()` and why it matters. The .NET realization of this is shown later in Block 4 — here it stays a *language* point.

### 2.2 Knowledge crunching (8 min)
- Evans' idea: the model is *discovered*, not invented. The role of the domain expert; why developers must learn the business.
- **Event Storming — a 3-minute taste, not a deep dive:** show a real annotated photo of an event-storming wall (orange = domain events, etc.). It makes "discovered, not invented" concrete. The full method is peer topic #1.

### 2.3 The model is the design (4 min)
- Code, diagrams, conversations must reflect the same model. When language drifts, the model is broken — fix the language first.

### 2.4 Mini exercise (3 min)
- Two descriptions of the same e-commerce feature, one in anemic/technical wording, one in ubiquitous language. Audience spots the difference *in words* (still no code).

---

### ☕ Break 1 (10 min)

---

## Block 3 — Strategic Design: Bounded Contexts & Context Mapping (45 min) — *diagram-only, no C#*

**Objective:** The heart of the talk. Most teams skip straight to tactical patterns and miss the point. We do it the right way: strategy first.

### 3.1 The problem of "one big model" (5 min)
- Why a single unified model across a large system collapses. Same word, different meanings: "Customer" in Sales vs Support vs Billing.

### 3.2 Bounded Context (8 min)
- An explicit boundary inside which a model is consistent and the language is unambiguous. It owns its own model, language, and code.
- Diagram: "Product" modeled three different ways in Catalog, Orders, and Shipping (our running domain).

### 3.3 Subdomains (8 min)
- **Core** (where the business wins — your best people here), **Supporting** (necessary, not differentiating), **Generic** (solved problems — auth, payments, notifications — buy/OSS).
- The strategic question: *what is our core?* For our e-commerce domain, work it through live: which of Catalog/Orders/Shipping/Identity/Payments is core?
- **Proportional modeling (preview of Block 5):** the subdomain decides the architecture budget. Core → full tactical DDD + the Explicit Architecture stack. Supporting/Generic → Transaction Script / Active Record / plain layered / CRUD is *correct*, not lazy.

### 3.4 Context Mapping (12 min)
Relationships between contexts: Partnership, Shared Kernel, Customer–Supplier, Conformist, **Anticorruption Layer (ACL — emphasize; the practical pattern that saves teams)**, Open Host Service, Published Language, Separate Ways.

### 3.5 Group exercise — "spot the bounded context" (12 min)
- Hand out / show a one-paragraph narrative of our e-commerce business with deliberately overloaded terms.
- In pairs: draw the bounded contexts and one context-map relationship. 8 min work, 4 min debrief on 2–3 answers.
- Purpose: the audience *experiences* "DDD is a way of thinking" instead of being told. This is the **last thing to cut**, not the first — it serves the thesis directly.

---

## Block 4 — Tactical Design: One Worked Aggregate in .NET 10 (33 min)

**Objective:** Patterns for *how* to model, introduced through **one** aggregate — not enumerated. We build `Order` + `OrderLine` and let each pattern emerge from it. (Avoids the "list of seven patterns" anti-pattern; this is where .NET 10 earns its place.)

Walkthrough on the single running `Order` aggregate:

1. **Value Object** — `Money`, `Address` as `readonly record struct` / `record`. Teaching contrast: "this was 50 lines of `Equals`/`GetHashCode` in C# 2015; now it's one line." Why teams under-use VOs: most "entities" are actually value objects.
2. **Entity** — `Order` as a class: identity-based equality, private setters, behavior over data.
3. **Strongly-typed ID** — `readonly record struct OrderId(Guid Value)`; directly demonstrates "reference other aggregates by identity, not object reference."
4. **Aggregate & root** — `Order` is the consistency boundary; `OrderLine`s only mutated through `Order`; `IReadOnlyList<OrderLine>` exposure. Vernon's four rules, shown *against this code*: protect true invariants; keep aggregates small; reference others by identity; eventual consistency outside the boundary. Anti-pattern: the "god aggregate."
5. **Domain Event** — `OrderPlaced` as a simple `record`, raised by the aggregate. Distinguish domain vs integration events (one slide; deep dive is peer topic #7).
6. **Repository** — `IOrderRepository` interface in the domain; one per aggregate root, not per table. EF Core 10 implementation lives in infrastructure (shown in Block 5, not here).
7. **Domain Service & Factory** — 60-second callouts only: domain service for logic that belongs to no single entity; factory when construction is non-trivial. Warning: don't let services become the home of all logic — that's the anemic model from Block 1.2 returning.

**Framework caution (say it):** MediatR / EF Core are *not* the story. They're plumbing. If the audience leaves thinking "DDD = MediatR + EF Core," the thesis failed.

---

### ☕ Break 2 (10 min)

---

## Block 5 — Architecture: The *Proof* of the Thesis (27 min)

**Objective:** Not background — the payoff. The same `Order` model from Block 4 holds still while we turn three *independent* axes around it. Make the orthogonality explicit up front: these are **not five competing architectures, they are three separate knobs.** (This is Graça's "Explicit Architecture" model.)

### 5.1 Axis A — internal dependency structure: one idea, four vocabularies (10 min)
- **Layered → Hexagonal → Onion → Clean**, converging on Graça's *Explicit Architecture*. Present it as an **additive progression, not a menu of rivals**: Hexagonal adds ports/adapters around layered; Onion pulls the DDD layers inside the hexagon; Clean names the dependency rule explicitly.
- The single invariant all four share: **the domain is at the center, every dependency points inward, and the dependency graph is acyclic — no circular dependencies between modules.** That acyclic-inward rule *is* the architecture; the names are just vocabulary.
- Our `Order` aggregate sits dead center; `IOrderRepository` is a port; the EF Core 10 class is an adapter on the outside. .NET anchors to explore after: **eShop**, **eShopOnWeb**.
- Say it plainly: this stack is the default and the right call for most non-trivial systems.

### 5.2 How much of Axis A do you actually need? (6 min)
- The progression is additive, so **stopping early is a deliberate, legitimate position — not "DDD-lite."** Plain layered with a rich domain model is fine for a small system; add hexagon/onion/clean ceremony only when complexity pays for it.
- **Proportional rule:** core subdomain earns the full stack; supporting/generic can be Transaction Script / Active Record / CRUD.
- **No canonical name** exists for "full strategic + tactical DDD with a deliberately light architecture"; the nearest community phrase is **"Pragmatic DDD"** (a philosophy, not a pattern). The concrete .NET-native answer is **Vertical Slice Architecture** (Bogard / the MediatR world): keep the domain model, organize by feature slice, add ports/adapters only where a slice needs them. **Caveat:** VSA is *not* a license for anemic models — strategic + tactical DDD still applies; you're trimming Axis A, not the domain.

### 5.3 Axis B — orthogonal model/persistence toggles (5 min) *(compressible)*
- **CQRS** (split read/write) and **Event Sourcing** (store facts, not state) are independent on/off knobs *inside* Axis A, not alternatives to it — Graça shows the same architecture with and without a command bus. Peer topics #3 and #4.

### 5.4 Axis C — deployment topology (6 min)
- Monolith / **modular monolith** / microservices. *Strategic* DDD (bounded contexts) tells you where you *may* cut; it never forces microservices. A microservice without a bounded context is a distributed monolith; bounded contexts inside a modular monolith are perfectly good DDD.
- **Closing line of the block:** "Three axes. We turned every knob. DDD's tactical patterns never left the center of Axis A; its strategic patterns steered Axis C; DDD itself sat on *none* of the three. Same model, every time. *That* is the talk."

---

## Block 6 — Zoom Out: The Whole Domain in One Picture (10 min)

**Objective:** Not a new example — the resolution of everything we built. We've been zoomed into `Order` all afternoon; now pull back.

1. The full e-commerce context map (Catalog, Orders, Shipping, Identity, Payments) with relationships labeled — the same domain from Block 3.
2. Mark which subdomain is core; where the `Order` aggregate from Block 4 lives; where its repository's EF Core adapter sits from Block 5.
3. "We did in one afternoon, on one domain, what takes weeks on a real system — but the *process* is identical, and notice we never had to commit to an architecture to do it."

---

## Block 7 — Recap, Peer Study Topics & Q&A (15 min)

### 7.1 Five takeaways (1 slide)
1. The domain is the point. Everything else serves it.
2. Ubiquitous language is non-negotiable.
3. Strategic design (bounded contexts) **before** tactical design (aggregates).
4. Aggregates are consistency boundaries — keep them small.
5. **DDD is a way of *thinking*, not an architecture and not a checklist.**

### 7.2 Peer presentation topics

Each is a self-contained ~30–60 min session. First to claim owns the deep dive; ties co-present.

| # | Topic | Why it's worth a session | Primary source |
|---|---|---|---|
| 1 | **Event Storming** | The dominant modern discovery technique. Hands-on, visual. | Brandolini; Vernon (discovery) |
| 2 | **Aggregate Design — Deep Dive** | "Effective Aggregate Design"; the most failure-prone tactical area. | Vernon ch. 10 |
| 3 | **CQRS in Practice** | Read/write models, projections, when it's overkill. | Vernon ch. 4, 14 |
| 4 | **Event Sourcing** | Facts not state; replay, snapshots, schema evolution. | Vernon ch. 8 + external |
| 5 | **Anticorruption Layers in real integrations** | Design an ACL against a real legacy/third-party system. | Evans ch. 14; Vernon ch. 3 |
| 6 | **Explicit Architecture in .NET** | Hexagonal+Onion+Clean as one stack; walk a real .NET 10 layout (eShopOnWeb-style). | Graça (Explicit Architecture); Vernon ch. 4; Cockburn |
| 7 | **Domain vs Integration Events** | The difference, why it matters, messaging. | Vernon ch. 8, 13 |
| 8 | **Bounded Contexts vs Microservices** | Relationship, misconceptions, modular monolith middle path. | Vernon ch. 2 + practitioner writing |
| 9 | **Strategic Design Workshop** | Run a live mini-workshop on a fictional domain. | Evans Part IV; Vernon Distilled |
| 10 | **Sagas / Process Managers** | Long-running processes across aggregates. | Vernon ch. 12 |
| 11 | **DDD in Functional .NET / F#** | DDD without classes — the strongest "not an architecture" proof. | Wlaschin |
| 12 | **Testing domain models in .NET** | Unit-testing aggregates, in-memory repos, given/when/then by event. | Various |
| 13 | **Vertical Slice Architecture in .NET** | Full DDD modeling without the onion ceremony; when it beats Clean, and the anemic-model trap. | Bogard (Vertical Slice); Graça |

### 7.3 Reading order for presenters
- Start with **Vernon Distilled** (fastest path to the strategic frame), then the relevant **Vernon Red Book** chapter (the "how"), cross-reference **Evans** for the philosophy, then one post-2020 article/talk to modernize.

### 7.4 Q&A
- Open floor. If silence: "Where in your current project do you think a bounded context is missing — or where are you doing DDD-lite?"

---

## .NET 10 conventions (keep every snippet consistent)

- **Value Objects:** `readonly record struct Money(decimal Amount, string Currency)`, `record Address(...)`. Value equality + immutability for free; lead with the "this used to be 50 lines" contrast.
- **Strongly-typed IDs:** `readonly record struct OrderId(Guid Value)` — concrete realization of "reference aggregates by identity."
- **Entities:** `class Order` with private setters, identity-based equality, behavior methods named in the ubiquitous language (`Submit()`, `AddLine()`).
- **Aggregates:** root exposes intent methods; child collections exposed as `IReadOnlyList<>`; no public child mutation.
- **Domain Events:** `record OrderPlaced(OrderId Id, ...)`; raised inside the aggregate, dispatched in the application layer.
- **Repositories:** interface in the domain project; EF Core 10 implementation in infrastructure; one repository per aggregate root.
- **Reference architectures to point at (don't rebuild live):** eShop, eShopOnWeb, .NET modular-monolith samples.
- **Caution:** MediatR / EF Core are plumbing, never the story. The thesis is explicitly anti-framework-centric.

---

## Speaker notes & delivery tips

- **Pace check:** at the 1-hr mark you should be finishing Block 2 (just before Break 1). At the 2-hr mark you should be finishing Block 4 (just before Break 2).
- **What to cut if you're behind, in order:** (1) Block 5.3 Event Sourcing half, (2) Block 5.3 CQRS half, (3) Block 5.2's Vertical Slice detail, (4) trim Block 4's Domain Service/Factory callouts, (5) shorten Block 6 to the single context-map slide. **Never cut the Block 3.5 group exercise or Block 5's closing line — they carry the thesis.**
- **Diagrams beat code** for a first-time audience — that's *why* Blocks 2–3 are code-free.
- **Show, don't enumerate:** the entire tactical block rides on one `Order` aggregate, not a list of patterns.
- **Repeat the vocabulary:** Bounded Context, Aggregate, Ubiquitous Language, Anticorruption Layer, DDD-lite — say each at least three times in different contexts.
- **Return to the thesis** at the end of Blocks 1, 3, 5, and 7. It's the spine, not a one-time statement.
