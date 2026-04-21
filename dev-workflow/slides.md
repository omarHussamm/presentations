---
theme: seriph
colorSchema: light
title: How We Ship — A Developer Workflow Standard
info: |
  The full developer workflow loop: from task to production.
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
---

# How We Ship

### A Developer Workflow Standard

<!--
Sabah el kheer 

Enharda hanetkalem 3ala el SDLC from start to finish, not from start awy hanebtedy mn writing jira tickets han-skip hetet collecting requirements w user stories w keda w finish lehad merging el task code into main

feeh shwya mena mashyeen 3ala flow w feeh shwya la fa enharda hantklem 3ala flow ezay ne2dar nemshy 3aleeh haykhely el dev cycle beta3etna monazma aktar productive aktar efficeint and have less bugs etc.
-->

---
layout: center
class: text-center
---

# What goes wrong without a process?

<br>

<div class="grid grid-cols-2 gap-8 mt-4 max-w-3xl mx-auto text-left">
  <div class="border rounded-lg p-5">
    <div class="text-red-500 font-bold mb-3">No clear task</div>
    <div class="text-sm">Developer builds the wrong thing. Work is thrown away. Sprint goal missed.</div>
  </div>
  <div class="border rounded-lg p-5">
    <div class="text-red-500 font-bold mb-3">No branch strategy</div>
    <div class="text-sm">Merge conflicts every day. Nobody knows what's in main. Releases are unpredictable.</div>
  </div>
  <div class="border rounded-lg p-5">
    <div class="text-red-500 font-bold mb-3">No PR review</div>
    <div class="text-sm">Bugs reach production. Security issues slip through. Knowledge stays in one person's head.</div>
  </div>
  <div class="border rounded-lg p-5">
    <div class="text-red-500 font-bold mb-3">No CI/CD</div>
    <div class="text-sm">Broken builds discovered in production. Deployments are manual, risky, and feared.</div>
  </div>
</div>

<!--
This is not hypothetical. Every one of these has happened on real teams.

Process exists to prevent the same mistakes from happening over and over. It's not bureaucracy — it's the thing that lets a team of juniors ship with the confidence of seniors.

The goal of today: walk through every step so you understand not just what to do, but why it matters.
-->

---
layout: center
---

# The Loop

<div class="flex items-center justify-center gap-2 mt-8 flex-wrap text-sm">
  <div class="border-2 border-blue-500 rounded-lg px-4 py-3 text-center font-bold">
    1<br><span class="font-normal">Write Task</span>
  </div>
  <div class="text-gray-400 text-xl">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-4 py-3 text-center font-bold">
    2<br><span class="font-normal">Read & Pull Task</span>
  </div>
  <div class="text-gray-400 text-xl">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-4 py-3 text-center font-bold">
    3<br><span class="font-normal">Branch</span>
  </div>
  <div class="text-gray-400 text-xl">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-4 py-3 text-center font-bold">
    4<br><span class="font-normal">Local CI</span>
  </div>
  <div class="text-gray-400 text-xl">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-4 py-3 text-center font-bold">
    5<br><span class="font-normal">Write PR</span>
  </div>
  <div class="text-gray-400 text-xl">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-4 py-3 text-center font-bold">
    6<br><span class="font-normal">Review PR</span>
  </div>
  <div class="text-gray-400 text-xl">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-4 py-3 text-center font-bold">
    7<br><span class="font-normal">Merge & Deploy</span>
  </div>
</div>

<br>

> Every step feeds the next. A weak step anywhere costs time at every step after it.

<!--
This is the full loop. We're going to go through each step in order.

Notice: a bad task at step 1 causes problems at step 5 (PR has no context), step 6 (reviewer doesn't know what to verify), and step 7 (we don't know if it actually worked).

The loop only works if every step is done properly. Shortcuts early in the loop create expensive problems late.
-->

---
layout: section
---

# Step 1 — Writing a Task

> A task is a contract. It tells the developer exactly what to build and how to know when they're done.

---

# What a Good Task Contains

<div class="grid grid-cols-2 gap-6 mt-4">
  <div>

| Field | Purpose |
|-------|---------|
| **Title** | One sentence. What is being done. |
| **Goal** | Why this task exists. What problem it solves. |
| **Context** | Background the developer needs. Links, screenshots, related tickets. |
| **Requirements** | What the system must do. Specific and testable. |
| **Acceptance Criteria** | The checklist for "done". Pass/fail conditions. |
| **Out of Scope** | What is explicitly NOT included. |
| **Technical Notes** *(optional)* | Suggested approach, library, or constraint. Not a mandate — a starting point. |

  </div>
  <div class="border rounded-lg p-5 bg-gray-50">
    <div class="font-bold text-sm mb-3 text-gray-500">Why "Out of Scope" matters</div>
    <div class="text-sm">Without it, developers make assumptions about what's included. Two developers will make different assumptions. Both will be wrong in some way.</div>
    <br>
    <div class="font-bold text-sm mb-3 text-gray-500">Why "Goal" matters</div>
    <div class="text-sm">If a developer only knows the requirements but not the goal, they can't make good decisions when they hit edge cases. They'll either block or guess wrong.</div>
  </div>
</div>

<!--
Every field has a job. None are optional for non-trivial tasks — except Technical Notes.

The most commonly skipped: Out of Scope and Goal. These are also the two that cause the most rework.

Out of Scope prevents scope creep. Goal enables good judgment. Acceptance Criteria is what the reviewer uses to verify the work.

Technical Notes is the one optional field. Use it when there's a known constraint, a preferred library, or an architectural decision already made that the developer should know about. It's a nudge, not a specification — the developer can still push back.
-->

---
layout: two-cols
---

# Task Checklist — Universal

::left::

**Every task must answer these:**

<br>

- [ ] What is the expected outcome? (what does "done" look like?)
- [ ] Who is affected — user, system, or both?
- [ ] Are acceptance criteria defined and testable?
- [ ] Is the scope bounded? (what is NOT included?)
- [ ] Are dependencies on other tasks or teams identified?
- [ ] Are there links to designs, specs, or related tickets?

::right::

**Type-specific extras:**

<br>

**Feature**
- [ ] Designs attached?
- [ ] API contract defined (if backend)?
- [ ] Error states covered in ACs?

**Bug**
- [ ] Steps to reproduce included?
- [ ] Expected vs actual behavior described?
- [ ] Environment where it occurs noted?

**Refactor**
- [ ] What's the measurable improvement?
- [ ] Confirmed: no behavior change for users?
- [ ] Test coverage requirement noted?

<!--
This checklist is not something a developer fills in — it's what a task writer uses to verify completeness before the task goes into the sprint.

A developer picking up a task should be able to check every box on the left column mentally. If they can't, the task isn't ready.

For bugs especially: reproduction steps are non-negotiable. A bug report without repro steps is a guess, not a task.
-->

---
---

# Bad Task vs Good Task

<div class="grid grid-cols-2 gap-4 mt-2 text-sm">
<div class="border-2 border-red-400 rounded-lg p-4">
  <div class="text-red-500 font-bold mb-2">Bad</div>

**Title:** Add notifications

**Description:** Users want to get notified about things. Add a notifications system to the app.

<br>

**What's missing:**
- What events trigger a notification?
- Email, push, in-app — or all three?
- No acceptance criteria
- No out of scope defined
- No designs or API contract
</div>
<div class="border-2 border-green-500 rounded-lg p-4">
  <div class="text-green-600 font-bold mb-2">Good</div>

**Title:** In-app notification bell for task assignments — PROD-88

**Goal:** Users miss tasks assigned to them because there is no in-app alert.

**Requirements:**
- Bell icon in navbar shows unread count
- Clicking opens a dropdown of the last 10 notifications
- Notifications marked read on open

**Acceptance Criteria:**
- [ ] Badge count updates without page refresh
- [ ] Empty state shown when no notifications
- [ ] No email or push notifications in this scope
</div>
</div>

<!--
The bad task is frustratingly common. "Notifications" could mean email, push, SMS, in-app — the developer has to guess, and any guess can be wrong.

The good task leaves nothing to guess. The developer knows exactly what to build, what done looks like, and what is explicitly out of scope.

The time spent writing a good task is always less than the time spent on rework caused by a bad one.
-->

---
layout: section
---

# Step 2 — Reading & Pulling a Task

> Before writing a single line of code, understand what you're building and why.

---

# The Self-Check Before You Start

> Run through this before writing any code. If a box is unchecked, you have a gap to fill — either by finding the answer yourself or by asking.

<br>

<div class="grid grid-cols-2 gap-6">
  <div class="border rounded-lg p-5">
    <div class="font-bold mb-3">Can you answer these?</div>
    <div class="text-sm space-y-2">
      <div>✅ What does "done" look like for this task?</div>
      <div>✅ Who is the user affected — internal, external, system?</div>
      <div>✅ What are the edge cases? Are they covered in the ACs?</div>
      <div>✅ What is explicitly out of scope?</div>
      <div>✅ Which parts of the codebase are involved?</div>
      <div>✅ Are there dependencies on other tasks or teams?</div>
    </div>
  </div>
  <div class="border rounded-lg p-5">
    <div class="font-bold mb-3">Before asking — check these first:</div>
    <div class="text-sm space-y-2">
      <div>🔍 Is the answer already in the ticket (links, attachments, comments)?</div>
      <div>🔍 Is there an existing implementation in the codebase you can reference?</div>
      <div>🔍 Is there related documentation or a previous ticket for context?</div>
      <div>🔍 Have you asked a teammate who has context on this area?</div>
    </div>
  </div>
</div>

<!--
The left column is the minimum bar for starting a task. If any of these are unchecked, the developer is making assumptions — which means they might build the wrong thing.

The right column is important: check what you can resolve yourself before escalating. This is about being a professional. Don't immediately ask the PM for something that's already in the ticket or that a 5-minute code search would answer.

But also: don't sit blocked for hours rather than asking. If you've genuinely checked and can't find the answer, asking is the right move.
-->

---
layout: section
---

# Step 3 — Branching Strategy

> One rule: `main` is always deployable.

---

# Why Not GitFlow?

<div class="grid grid-cols-2 gap-8 mt-6">
  <div class="border rounded-lg p-5 opacity-70">
    <div class="font-bold mb-3">GitFlow</div>
    <div class="text-sm space-y-2 text-gray-600">
      <div>• <code>main</code> + <code>develop</code> + <code>release/*</code> + <code>hotfix/*</code></div>
      <div>• Designed for scheduled, versioned releases</div>
      <div>• Overhead: merges travel through multiple branches</div>
      <div>• Long-lived <code>develop</code> branch diverges from main</div>
      <div>• Works well for: mobile apps, packaged software with strict release cycles</div>
    </div>
  </div>
  <div class="border-2 border-blue-500 rounded-lg p-5">
    <div class="font-bold mb-3 text-blue-600">GitHub Flow (what we use)</div>
    <div class="text-sm space-y-2">
      <div>• Only one permanent branch: <code>main</code></div>
      <div>• Short-lived feature branches off <code>main</code></div>
      <div>• PR → review → merge to <code>main</code> → deploy</div>
      <div>• <code>main</code> is always in a deployable state</div>
      <div>• Works well for: web apps, APIs, continuous delivery</div>
    </div>
  </div>
</div>

<br>

> GitFlow is not wrong — it's wrong for us. We ship continuously. A simpler flow is faster and safer.

<!--
GitFlow is a well-known and respected strategy. It's the right choice for teams doing scheduled versioned releases — think mobile apps where you can't push an update to a user's phone the moment a bug is fixed.

We ship to the web. We can deploy any time. GitFlow's extra branches add overhead without adding value for our workflow.

GitHub Flow removes that overhead: one permanent branch, short-lived feature branches, and the contract that main is always deployable. Simpler = less to get wrong.
-->

---

# GitHub Flow — The Rules

<div class="grid grid-cols-2 gap-6 mt-6">
  <div class="space-y-4">
    <div class="border-l-4 border-blue-500 pl-4">
      <div class="font-bold">1. Branch off main</div>
      <div class="text-sm text-gray-600 mt-1">Every task starts from the latest <code>main</code>. Always pull before branching.</div>
    </div>
    <div class="border-l-4 border-blue-500 pl-4">
      <div class="font-bold">2. One task = one branch</div>
      <div class="text-sm text-gray-600 mt-1">A branch has a single, clear purpose. When the task is done, the branch is merged and deleted.</div>
    </div>
    <div class="border-l-4 border-blue-500 pl-4">
      <div class="font-bold">3. Open a PR early</div>
      <div class="text-sm text-gray-600 mt-1">Open a draft PR as soon as you have something to show. Don't work in isolation for days.</div>
    </div>
    <div class="border-l-4 border-blue-500 pl-4">
      <div class="font-bold">4. Merge only when CI is green</div>
      <div class="text-sm text-gray-600 mt-1">A failing CI pipeline is a blocker. You do not merge red builds.</div>
    </div>
    <div class="border-l-4 border-blue-500 pl-4">
      <div class="font-bold">5. main is always deployable</div>
      <div class="text-sm text-gray-600 mt-1">If you merge and main breaks, fixing it is your immediate priority — above any new work.</div>
    </div>
  </div>
  <div class="border rounded-lg p-5 bg-gray-50">
    <div class="font-bold text-sm mb-3">Branch naming</div>
    <div class="text-sm font-mono space-y-2">
      <div><span class="text-blue-600">feat/</span>PROD-88</div>
      <div><span class="text-red-500">fix/</span>PROD-412</div>
      <div><span class="text-yellow-600">chore/</span>PROD-201</div>
      <div><span class="text-purple-600">refactor/</span>PROD-334</div>
    </div>
    <br>
    <div class="font-bold text-sm mb-3 text-red-500">Never do this</div>
    <div class="text-sm font-mono space-y-1 text-gray-500 line-through">
      <div>omar-working-branch</div>
      <div>temp</div>
      <div>fix2</div>
      <div>my-feature-final-v3</div>
    </div>
  </div>
</div>

<!--
Each rule has a reason:

1. Branch off main: if you branch off a teammate's unmerged branch, you inherit their bugs and create a dependency that's hard to untangle.

2. One task = one branch: reviewers can't verify a PR that does three different things. Small PRs are reviewed faster and merged safer.

3. Open a draft PR early: this creates visibility. Teammates can give early feedback before you've invested too much in the wrong direction.

4. Merge only when CI is green: a red build means something is broken. Merging anyway spreads the breakage to main and blocks every other developer.

5. main is always deployable: this is the core contract of GitHub Flow. The moment it's broken, it becomes a fire that everyone has to deal with.

Branch naming: prefix with the type, suffix with the Jira ticket ID. This links the branch to the task automatically in most tools, and makes CI logs and PR lists readable at a glance.
-->

---
layout: section
---

# Step 4 — Local CI with Lefthook

> Catch problems on your machine, not in the pipeline.

---

# What is Local CI?

<div class="grid grid-cols-2 gap-6 mt-6">
  <div>
    <div class="font-bold mb-4">The contract</div>
    <div class="text-sm space-y-3">
      <div class="border-l-4 border-green-500 pl-3">If it passes locally, it should pass in CI.</div>
      <div class="border-l-4 border-red-400 pl-3">If it fails locally, fix it before pushing. Not after.</div>
    </div>
    <br>
    <div class="font-bold mb-4">Why it matters</div>
    <div class="text-sm text-gray-600">A CI pipeline run takes minutes. A fix-push-wait cycle repeated 5 times is 20+ minutes of waiting. Lefthook catches the same issues in seconds, before the push.</div>
    <br>
    <div class="font-bold mb-4">What Lefthook runs</div>
    <div class="text-sm space-y-1 font-mono">
      <div><span class="text-gray-400">pre-commit:</span> lint · format check</div>
      <div><span class="text-gray-400">pre-push:</span> tests · build check</div>
    </div>
  </div>
  <div class="border rounded-lg p-5 bg-gray-50">
    <div class="font-bold text-sm mb-3">Without local CI</div>
    <div class="text-xs space-y-1 text-gray-600 mb-4">
      <div>1. Push code</div>
      <div>2. Wait 3 minutes for CI</div>
      <div>3. CI fails — lint error</div>
      <div>4. Fix, push again</div>
      <div>5. Wait 3 minutes</div>
      <div>6. CI fails — test error</div>
      <div>7. Fix, push again</div>
      <div>8. Wait 3 minutes</div>
      <div>9. Green ✅</div>
    </div>
    <div class="font-bold text-sm mb-3 text-green-600">With local CI (Lefthook)</div>
    <div class="text-xs space-y-1 text-gray-600">
      <div>1. <code>git commit</code> → lint runs instantly</div>
      <div>2. Fix lint issue</div>
      <div>3. <code>git push</code> → tests run locally</div>
      <div>4. Fix test</div>
      <div>5. Push → CI green on first run ✅</div>
    </div>
  </div>
</div>

<!--
Local CI isn't about distrust — it's about speed. The faster you get feedback, the faster you move.

The fix-push-wait loop is one of the most common productivity killers on development teams. Every push that fails CI for a lint error is time that could have been caught in 2 seconds locally.

Lefthook hooks into git events. On commit, it runs lint and format checks. On push, it runs tests. If any hook fails, the commit or push is blocked until the issue is fixed.
-->

---

# Handling Hook Failures

<div class="grid grid-cols-2 gap-6 mt-6">
  <div>
    <div class="font-bold mb-4">The rule: fix it, don't bypass it</div>
    <div class="text-sm text-gray-600 mb-4">
      <code>git commit --no-verify</code> and <code>git push --no-verify</code> bypass all hooks.
      <br><br>
      This is banned. A bypass means you're knowingly pushing code that fails our own checks. The CI pipeline will catch it anyway — you've just moved the failure downstream and wasted everyone's time.
    </div>
    <div class="font-bold mb-3">The only exception</div>
    <div class="text-sm text-gray-600">A hook is broken or incorrectly configured. In that case: fix the hook, don't bypass it. Raise it immediately so the whole team doesn't hit the same issue.</div>
  </div>
  <div class="space-y-4">
    <div class="border-2 border-red-400 rounded-lg p-4">
      <div class="text-red-500 font-bold text-sm mb-2">Never do this</div>
      <div class="font-mono text-sm">git commit --no-verify -m "fix"</div>
      <div class="text-xs text-gray-500 mt-2">You've skipped lint, format, and any other pre-commit checks. You know the code has issues. You've pushed them anyway.</div>
    </div>
    <div class="border-2 border-green-500 rounded-lg p-4">
      <div class="text-green-600 font-bold text-sm mb-2">Do this instead</div>
      <div class="font-mono text-sm">npm run lint -- --fix</div>
      <div class="font-mono text-sm mt-1">git commit -m "fix: resolve lint errors"</div>
      <div class="text-xs text-gray-500 mt-2">Fix the actual issue. Commit clean code. The hook passes and CI will too.</div>
    </div>
  </div>
</div>

<!--
--no-verify is the developer equivalent of covering your eyes and hoping nobody notices. The CI pipeline will catch the issue. All you've done is moved the failure from local (fast, private) to remote (slow, public, blocks the PR).

The only legitimate use of --no-verify is when the hook itself is misconfigured. And in that case, the correct response is to fix the hook and notify the team — not to bypass it silently.

This is a team contract. Everyone following it means CI failures in the pipeline are genuine surprises, not "oh I knew about that but pushed anyway."
-->

---
layout: section
---

# Step 5 — Writing a Pull Request

> A PR is a proposal to change the codebase. Treat it like one.

---

# What a PR Must Include

<div class="grid grid-cols-2 gap-6 mt-4">
  <div>

| Field | What it should say |
|-------|-------------------|
| **Title** | What changed. `fix: avatar not loading on first visit` |
| **Summary** | What you did and why. Link to the Jira ticket. |
| **How to test** | Exact steps a reviewer can follow to verify the change. |
| **Screenshots** | Required for any UI change. Before & after. |
| **Checklist** | Tests added? Docs updated if needed? No debug logs left? |

  </div>
  <div class="border rounded-lg p-5 bg-gray-50 text-sm">
    <div class="font-bold mb-3">A PR description that works</div>
    <div class="font-mono text-xs space-y-1 text-gray-700">
      <div class="font-bold">fix: avatar not loading on first visit</div>
      <br>
      <div>## What</div>
      <div>Avatar image was not resolving on initial page load</div>
      <div>due to a race condition in the image loader.</div>
      <br>
      <div>## Why</div>
      <div>Users were seeing broken images and reporting it</div>
      <div>as a bug. Jira: USER-412</div>
      <br>
      <div>## How to test</div>
      <div>1. Log in as any user with an avatar set</div>
      <div>2. Navigate directly to /profile</div>
      <div>3. Avatar should load without refreshing</div>
      <br>
      <div>## Checklist</div>
      <div>- [x] Tests added</div>
      <div>- [x] No console logs left</div>
      <div>- [x] Tested in Chrome and Firefox</div>
    </div>
  </div>
</div>

<!--
A PR with a good description gets reviewed faster and merged with more confidence. A PR with a one-line description ("fixed the thing") forces the reviewer to read every line of code to understand what changed and why — which takes longer and produces worse reviews.

The "How to test" section is the most commonly skipped and the most valuable. It tells the reviewer exactly what to verify. Without it, reviewers make guesses.

Screenshots for UI changes are non-negotiable. A reviewer reading code changes to a component cannot visualize what it looks like in the browser. Show them.
-->

---

# PR Size and Discipline

<div class="grid grid-cols-3 gap-6 mt-6">
  <div class="border-2 border-green-500 rounded-lg p-5">
    <div class="text-green-600 font-bold mb-3">Small PRs</div>
    <ul class="text-sm space-y-2">
      <li>One task, one PR</li>
      <li>Reviewed in 15–30 minutes</li>
      <li>Easy to reason about</li>
      <li>Safe to merge and revert</li>
      <li>Less likely to have conflicts</li>
    </ul>
  </div>
  <div class="border-2 border-red-400 rounded-lg p-5">
    <div class="text-red-500 font-bold mb-3">Large PRs</div>
    <ul class="text-sm space-y-2">
      <li>Multiple concerns in one PR</li>
      <li>Reviews deferred or rushed</li>
      <li>Hard to reason about</li>
      <li>Risky to merge and painful to revert</li>
      <li>High conflict probability</li>
    </ul>
  </div>
  <div class="border rounded-lg p-5">
    <div class="font-bold mb-3">Draft PRs</div>
    <div class="text-sm text-gray-600 space-y-2">
      <div>Open a draft PR to:</div>
      <ul class="space-y-1 mt-2">
        <li>Get early design feedback</li>
        <li>Make your work visible to the team</li>
        <li>Trigger CI checks before it's ready</li>
      </ul>
      <br>
      <div>Convert to "Ready for Review" when all ACs are met and CI is green.</div>
    </div>
  </div>
</div>

<br>

> If your PR touches more than one Jira ticket, it should probably be two PRs.

<!--
PR size is one of the highest-leverage habits a team can build. Small PRs are reviewed faster, merged safer, and cause fewer conflicts.

Large PRs get deferred. Reviewers look at 800 lines of changes and decide to "come back to it." By the time they do, the branch has diverged and the context is gone.

The rule of thumb: if your PR description has to say "this PR also does X", that X should probably be its own PR.

Draft PRs are underused. They're not for finished work — they're for "here's what I'm thinking, am I going in the right direction?" Opening early prevents building 3 days of work in the wrong direction.
-->

---
layout: section
---

# Step 6 — Reviewing a Pull Request

> Code review is the team's primary quality gate. It's a responsibility, not a formality.

---

# What You're Looking For

<div class="grid grid-cols-2 gap-6 mt-4">
  <div>
    <div class="font-bold mb-3 text-green-600">Review for these</div>
    <div class="space-y-3 text-sm">
      <div class="border-l-4 border-green-500 pl-3">
        <div class="font-bold">Correctness</div>
        <div class="text-gray-600">Does the code do what the task says? Does it handle edge cases from the ACs?</div>
      </div>
      <div class="border-l-4 border-green-500 pl-3">
        <div class="font-bold">Security</div>
        <div class="text-gray-600">Is input validated? Are authorization checks server-side? Any secrets in the code?</div>
      </div>
      <div class="border-l-4 border-green-500 pl-3">
        <div class="font-bold">Tests</div>
        <div class="text-gray-600">Are the acceptance criteria covered by tests? Are edge cases tested?</div>
      </div>
      <div class="border-l-4 border-green-500 pl-3">
        <div class="font-bold">Clarity</div>
        <div class="text-gray-600">Can you understand what the code does without the author explaining it?</div>
      </div>
      <div class="border-l-4 border-green-500 pl-3">
        <div class="font-bold">Impact</div>
        <div class="text-gray-600">Trace every changed function or variable to where it's used. Verify nothing outside the task scope is broken.</div>
      </div>
      <div class="border-l-4 border-green-500 pl-3">
        <div class="font-bold">PR quality</div>
        <div class="text-gray-600">Does the description explain what and why? Is it testable with the "How to test" steps?</div>
      </div>
    </div>
  </div>
  <div>
    <div class="font-bold mb-3 text-red-500">Not your job to review</div>
    <div class="space-y-3 text-sm">
      <div class="border-l-4 border-red-400 pl-3">
        <div class="font-bold">Code style and formatting</div>
        <div class="text-gray-600">The linter and formatter handle this. Don't leave comments about spacing, quotes, or semicolons — the hook enforces it.</div>
      </div>
      <div class="border-l-4 border-red-400 pl-3">
        <div class="font-bold">Personal preference</div>
        <div class="text-gray-600">"I would have done it differently" is not a review comment. It's noise. If the approach is correct and clear, it passes.</div>
      </div>
      <div class="border-l-4 border-red-400 pl-3">
        <div class="font-bold">Unrelated scope</div>
        <div class="text-gray-600">Don't request changes outside the PR's task. Open a new ticket for it instead.</div>
      </div>
    </div>
  </div>
</div>

<!--
Code review is a quality gate, not a performance review. The goal is to ship correct, secure, readable code — not to prove the reviewer is smarter than the author.

Security checks in review are especially important: verify authorization happens server-side (not just in the UI), check for any hardcoded credentials or tokens, look for SQL injection risk or unvalidated inputs.

Impact is easy to miss: a helper function or shared variable changed inside the PR scope may be used in five other places. Follow the call sites — don't assume the diff is the full picture.

The "not your job" side is just as important as the "review for" side. Teams that spend review time on style bikeshedding are teams that don't have time for the security and correctness checks that actually matter. Style is automated. Judgment isn't.
-->

---

# How to Give and Receive Feedback

<div class="grid grid-cols-2 gap-6 mt-4">
  <div>
    <div class="font-bold mb-4">Giving feedback</div>
    <div class="space-y-4 text-sm">
      <div class="border-2 border-red-300 rounded-lg p-3">
        <div class="text-red-500 font-bold text-xs mb-1">Vague & unhelpful</div>
        <div class="italic">"This is wrong."</div>
        <div class="italic">"Why did you do it this way?"</div>
        <div class="italic">"This needs to be refactored."</div>
      </div>
      <div class="border-2 border-green-400 rounded-lg p-3">
        <div class="text-green-600 font-bold text-xs mb-1">Specific & actionable</div>
        <div class="italic">"This could throw a null reference if `user` is undefined — can we add a guard here?"</div>
        <div class="italic">"I think extracting this into a helper would make it easier to test. What do you think?"</div>
      </div>
    </div>
  </div>
  <div>
    <div class="font-bold mb-4">Receiving feedback</div>
    <div class="text-sm space-y-3">
      <div class="border-l-4 border-blue-400 pl-3">Review comments are about the code, not about you. Separate the two.</div>
      <div class="border-l-4 border-blue-400 pl-3">If a comment is unclear, ask for clarification before dismissing or silently ignoring it.</div>
      <div class="border-l-4 border-blue-400 pl-3">Respond to every comment — even if just "done" or "agreed, fixed in latest commit."</div>
      <div class="border-l-4 border-blue-400 pl-3">Disagreement is fine. Make your case clearly, then defer to the reviewer or a third opinion.</div>
    </div>
    <br>
    <div class="font-bold mb-3">Review status — when to use each</div>
    <div class="text-sm space-y-1">
      <div><span class="font-bold">Approve</span> — code is correct, safe, and mergeable</div>
      <div><span class="font-bold">Request Changes</span> — there's a blocking issue that must be fixed</div>
      <div><span class="font-bold">Comment</span> — non-blocking observations or questions</div>
    </div>
  </div>
</div>

<!--
The formula for a good review comment: explain what the issue is, explain why it's a problem, and suggest a fix or alternative. All three. If you can't explain why it's a problem, reconsider whether it's actually a problem.

"What do you think?" at the end of a comment transforms it from a demand into a conversation. It opens dialogue rather than creating defensiveness.

On the receiving side: the hardest part of code review culture to build is psychological safety. Developers need to trust that comments are about improving the code, not judging them. The senior developers on the team set this tone — every public comment is an example of how review culture works here.

The three review statuses are commonly misused. "Request Changes" should be used when there is an actual blocker — a security issue, a correctness bug, a missing test for a critical path. Not for style preferences. Comments should be used for everything non-blocking.
-->

---

# Review Turnaround

<div class="grid grid-cols-3 gap-6 mt-8">
  <div class="border-2 border-blue-500 rounded-lg p-5 text-center">
    <div class="text-4xl font-bold text-blue-500 mb-2">24h</div>
    <div class="font-bold mb-2">First review</div>
    <div class="text-sm text-gray-600">Every PR gets a first review within one business day of being marked "Ready for Review."</div>
  </div>
  <div class="border rounded-lg p-5 text-center">
    <div class="text-4xl font-bold text-gray-400 mb-2">→</div>
    <div class="font-bold mb-2">Author responds</div>
    <div class="text-sm text-gray-600">Address comments, push fixes, re-request review. Don't leave comments hanging for days.</div>
  </div>
  <div class="border-2 border-green-500 rounded-lg p-5 text-center">
    <div class="text-4xl font-bold text-green-500 mb-2">✓</div>
    <div class="font-bold mb-2">Merge</div>
    <div class="text-sm text-gray-600">At least one approval. CI green. No unresolved blocking comments.</div>
  </div>
</div>

<br>

> A PR that sits unreviewed for days is a bottleneck for the whole team. Reviewing is part of your job, not optional work between your own tasks.

<!--
Turnaround time is a team metric, not an individual one. When PRs sit unreviewed, developers either wait (slow) or start more tasks (context switching, incomplete work piling up).

The 24-hour expectation is a minimum, not a target. If you see a PR ready for review and have 20 minutes, review it now rather than queuing it.

This is especially important for junior developers: they're often waiting on review to understand if they're on the right track. Fast reviews are how juniors learn fast.

The merge criteria should be a team agreement: how many approvals? Are there auto-merge rules? The important principle: CI green + at least one approval + no blocking comments unresolved.
-->

---
layout: section
---

# Step 7 — Merging & CI/CD

> When code merges to main, the machine takes over.

---

# Merging to Main

<div class="grid grid-cols-2 gap-6 mt-6">
  <div class="space-y-4">
    <div class="border-l-4 border-gray-400 pl-4">
      <div class="font-bold text-gray-500">Squash merge</div>
      <div class="text-sm text-gray-500 mt-1">All commits on the branch are squashed into one commit on main. Clean history, but individual commit context is lost.</div>
    </div>
    <div class="border-l-4 border-blue-500 pl-4">
      <div class="font-bold">Merge commit — what we use</div>
      <div class="text-sm text-gray-600 mt-1">Preserves all individual commits from the branch. Full history is traceable — every commit, message, and author is visible on main.</div>
    </div>
    <div class="border-l-4 border-gray-400 pl-4">
      <div class="font-bold text-gray-500">Rebase merge</div>
      <div class="text-sm text-gray-500 mt-1">Replays commits onto main. Preserves commits without a merge commit. Good if commits are clean; awkward if they aren't.</div>
    </div>
  </div>
  <div class="border rounded-lg p-5 bg-gray-50 text-sm">
    <div class="font-bold mb-3">Merge checklist</div>
    <div class="space-y-2">
      <div>✅ CI is green on the branch</div>
      <div>✅ At least one approval</div>
      <div>✅ No unresolved blocking comments</div>
      <div>✅ Branch is up to date with main</div>
      <div>✅ PR description links to the Jira ticket</div>
    </div>
    <br>
    <div class="font-bold mb-3 text-red-500">After merge</div>
    <div class="space-y-2 text-gray-600">
      <div>🗑️ Delete the branch immediately</div>
      <div>📌 Move the Jira ticket to "Done"</div>
      <div>👀 Watch CI on main for the next few minutes</div>
    </div>
  </div>
</div>

<!--
Merge commit preserves the full branch history on main. Every commit is traceable — useful for debugging, blame, and understanding how a feature evolved.

The merge checklist is not optional. Every item exists because skipping it has caused problems. CI green: merging red builds breaks main. Branch up to date: merging a stale branch can break things that were green on the branch.

Delete the branch after merge. Undeleted branches accumulate, become confusing, and occasionally get accidentally reused. GitHub can auto-delete branches after merge — enable it.

Watch CI on main: the branch CI passed, but merging can still cause failures if another merged branch introduced something incompatible. A quick glance at CI after merge catches this early.
-->

---

# What Happens After Merge

<div class="mt-6">
  <div class="flex items-start gap-4 mb-4">
    <div class="border-2 border-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
    <div>
      <div class="font-bold">CI pipeline triggers on main</div>
      <div class="text-sm text-gray-600">Every merge to main triggers the full pipeline automatically via GitHub Actions. No manual steps.</div>
    </div>
  </div>
  <div class="flex items-start gap-4 mb-4">
    <div class="border-2 border-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
    <div>
      <div class="font-bold">Pipeline stages run in order</div>
      <div class="text-sm text-gray-600 font-mono">lint → test → build → docker image → push to registry → deploy to staging</div>
    </div>
  </div>
  <div class="flex items-start gap-4 mb-4">
    <div class="border-2 border-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
    <div>
      <div class="font-bold">Any stage can fail and stop the pipeline</div>
      <div class="text-sm text-gray-600">A test failure stops before build. A build failure stops before deploy. Nothing broken reaches an environment.</div>
    </div>
  </div>
  <div class="flex items-start gap-4 mb-4">
    <div class="border-2 border-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
    <div>
      <div class="font-bold">Staging deploys automatically — production requires approval</div>
      <div class="text-sm text-gray-600">Staging gets every merge. Production deployment is a manual gate — an explicit action to confirm readiness.</div>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="border-2 border-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">!</div>
    <div>
      <div class="font-bold text-red-500">If main CI breaks after your merge — you fix it first</div>
      <div class="text-sm text-gray-600">Your merge, your responsibility. Stop what you're working on and fix or revert immediately. A broken main blocks everyone.</div>
    </div>
  </div>
</div>

<!--
This is the payoff of everything we've covered. When the process works, merging is not scary. You write a good PR, CI is green, you merge, and the machine does the rest.

The pipeline is sequential and fail-fast: if lint fails, we don't waste time building. If tests fail, we don't build a broken Docker image. Nothing broken should propagate further downstream than it needs to.

The staging/production split is important: staging is automatic because it should always reflect main. Production is a gate because it requires a human to confirm the feature is ready to ship to users. This is not about distrust of the pipeline — it's about making production deploys a deliberate choice, not an accidental side effect of a merge.

The "your merge, your fix" rule: this is how you maintain the contract that main is always deployable. If merging your PR breaks main, the rest of the team is blocked. Fixing it is more urgent than any new work.
-->

---

# GitHub Actions — What It Looks Like

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test

  build-and-push:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
      - name: Push to registry
        run: docker push registry.example.com/myapp:${{ github.sha }}

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: ./scripts/deploy.sh staging ${{ github.sha }}
```

<!--
This is a simplified but realistic example of a GitHub Actions pipeline. You don't need to memorize the syntax — I'm showing you the structure so you understand what's happening when CI runs.

Key points:
- `on: push: branches: [main]` — this is what triggers on merge to main
- `on: pull_request` — this triggers CI on the branch before merge (the CI check you need to be green before merging)
- `needs: lint-and-test` — build-and-push only runs if lint-and-test passes. Sequential, fail-fast.
- `if: github.ref == 'refs/heads/main'` — build and deploy only happen on main, not on every PR branch

The `github.sha` is the commit hash — used to tag the Docker image so you know exactly which commit is deployed in each environment. Makes rollbacks precise.

You won't be writing these pipelines yourself initially. But you should understand what they do when you see them, and what it means when a stage fails.
-->

---
layout: center
---

# The Full Loop

<div class="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs">
  <div class="border-2 border-blue-500 rounded-lg px-3 py-2 text-center">
    <div class="font-bold">Write Task</div>
    <div class="text-gray-500">Goal · ACs · Scope</div>
  </div>
  <div class="text-gray-400">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-3 py-2 text-center">
    <div class="font-bold">Read Task</div>
    <div class="text-gray-500">Understand · Self-check · Ask</div>
  </div>
  <div class="text-gray-400">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-3 py-2 text-center">
    <div class="font-bold">Branch</div>
    <div class="text-gray-500">feat/ fix/ off main</div>
  </div>
  <div class="text-gray-400">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-3 py-2 text-center">
    <div class="font-bold">Code + Local CI</div>
    <div class="text-gray-500">Lefthook · no bypasses</div>
  </div>
  <div class="text-gray-400">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-3 py-2 text-center">
    <div class="font-bold">Write PR</div>
    <div class="text-gray-500">What · Why · How to test</div>
  </div>
  <div class="text-gray-400">→</div>
  <div class="border-2 border-blue-500 rounded-lg px-3 py-2 text-center">
    <div class="font-bold">Review PR</div>
    <div class="text-gray-500">Correct · Secure · Tested</div>
  </div>
  <div class="text-gray-400">→</div>
  <div class="border-2 border-green-500 rounded-lg px-3 py-2 text-center">
    <div class="font-bold text-green-600">Merge → Deploy</div>
    <div class="text-gray-500">CI/CD · Staging → Prod</div>
  </div>
</div>

<br>

<div class="grid grid-cols-3 gap-6 mt-4 text-sm max-w-3xl mx-auto">
  <div class="text-center">
    <div class="font-bold text-blue-500 text-lg">Less rework</div>
    <div class="text-gray-500">Clear tasks mean you build the right thing the first time</div>
  </div>
  <div class="text-center">
    <div class="font-bold text-blue-500 text-lg">Faster shipping</div>
    <div class="text-gray-500">Small PRs + fast reviews + automated CI = no bottlenecks</div>
  </div>
  <div class="text-center">
    <div class="font-bold text-blue-500 text-lg">Safer production</div>
    <div class="text-gray-500">Every gate exists to stop a class of problems from reaching users</div>
  </div>
</div>

<!--
The loop works as a system. Every step feeds the next, and every gate protects the next stage from receiving something broken.

A weak task at step 1 costs time at every step after it. A strong task at step 1 makes every subsequent step faster.

This is not process for its own sake. Each step exists because without it, a specific class of problem reaches production or costs the team time. We've seen all of them.

The goal is to make this loop fast, not to slow it down. When the loop is healthy, shipping is boring — and boring deployments are a sign of a mature team.
-->

---
layout: center
class: text-center
---

# Thank You

### Questions?

<br>

> *"A process that slows you down is a bad process. A process that stops you from breaking each other's work — that's how a team ships fast."*
