# Reading and Pulling a Task

Picking up a task is not the same as starting to code. Before writing a single line, you must understand what you're building, why it exists, and what done looks like. This guide covers how to do that.

---

## The Standard

1. **Read the Goal before the Requirements.** The goal tells you the intent. The requirements tell you the implementation. If you only read the requirements, you'll follow them literally and miss the point when edge cases appear.

2. **Run the self-check before opening your IDE.** If you can't answer the six questions below, you have a gap. Fill it before starting.

3. **Check what you can resolve yourself before asking.** Is the answer already in the ticket? Is there an existing implementation in the codebase to reference? Is there a related ticket? Exhaust these first.

4. **If you're genuinely blocked, ask immediately — don't sit on it.** An hour of blocked time is an hour wasted. A specific, well-framed question takes two minutes to answer.

5. **If you can't describe the task in two sentences, you don't understand it yet.** Keep reading until you can.

---

## How to Read a Task

### Step 1 — Read the Goal first
Understand what problem the task solves and for whom. This is the lens through which you'll make every implementation decision.

### Step 2 — Read the Acceptance Criteria
These are your definition of done. You will use these to verify your own work before opening a PR. Read them carefully — if any are ambiguous, that's a gap to fill now, not at review time.

### Step 3 — Identify unknowns
Before opening the codebase, list what you don't know:
- Which files or services are involved?
- Are there edge cases not covered in the ACs?
- Does this touch another team's service or API?
- Is there a design or API contract you need?

### Step 4 — Check dependencies
- Is another task blocking this one?
- Does this task need to be done before another?
- Are you waiting on something from another team?

---

## The Self-Check

Before writing code, confirm you can answer all of these. If a box is unchecked, you have a gap.

**Every task:**
- [ ] What does "done" look like? (can you state the ACs in your own words?)
- [ ] Who is affected — user, system, or both?
- [ ] What are the edge cases? Are they covered in the ACs?
- [ ] What is explicitly out of scope?
- [ ] Which parts of the codebase are involved?
- [ ] Are there dependencies on other tasks or teams?

**Before asking — check yourself first:**
- [ ] Is the answer already in the ticket (links, attachments, comments)?
- [ ] Is there an existing implementation in the codebase you can reference?
- [ ] Is there related documentation or a previous ticket?
- [ ] Have you asked a teammate who has context on this area?

---

## When and How to Ask for Clarification

### When to ask
- The acceptance criteria are ambiguous or missing
- The scope is unclear — you don't know what's included
- There's a technical conflict with existing behavior
- A dependency is missing or not yet ready
- The requirement is technically infeasible as written

### When not to ask
- The answer is already in the ticket or a linked resource
- You can resolve it with a quick code search
- It's an implementation preference you can make a reasonable call on yourself

### How to frame the question

**Weak question:**
> "I don't understand the task."

This puts all the work on the other person and signals you haven't engaged with the ticket. It takes longer to resolve.

**Strong question:**
> "The task says to update the profile page, but AC #3 mentions the settings page — should this change apply to both, or only the profile page?"

This shows you read the ticket, identifies the specific ambiguity, and gives the PM or lead a concrete decision to make. They can answer in one sentence.

**Formula:** `[specific reference to the ticket] + [the ambiguity or conflict] + [the decision you need]`

---

## What "Blocked" Looks Like vs What "A Question" Looks Like

| Blocked | Just a question |
|---|---|
| A dependency task is not done and you cannot proceed without it | Something in the ticket is unclear but you could make a reasonable assumption |
| The design hasn't been delivered but the task requires it | You'd like confirmation on a preference or approach |
| An API you depend on is not implemented yet | You want to verify your understanding of the scope |

If you're blocked: update the Jira ticket with the blocker, notify the relevant person, and pull the next task in the sprint. Don't sit idle.

If it's a question: ask it, but continue working on the parts you can while waiting for an answer.
