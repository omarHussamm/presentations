# Branching Strategy — GitHub Flow

We use GitHub Flow. This guide defines the rules and explains why each one exists.

---

## The Core Rule

**`main` is always deployable.**

Every commit on `main` must be in a state that could be shipped. This is not aspirational — it is a hard requirement. Everything else in this guide exists to enforce it.

---

## The Standard

1. **Always branch off `main`.** Pull the latest `main` before creating your branch. Branching off a teammate's unmerged branch creates a dependency chain that's hard to untangle.

2. **One task = one branch.** A branch has a single, clear purpose. When the task is done, the branch is merged and deleted. Long-lived branches accumulate conflicts and become hard to review.

3. **Use the naming convention.** See below. A branch name should tell anyone what the branch is for without having to open Jira.

4. **Keep branches short-lived.** A branch that lives for more than a few days is a warning sign. Either the task is too large (split it) or it's blocked (surface it).

5. **Never commit directly to `main`.** All changes go through a PR. No exceptions.

6. **Delete the branch after merge.** Immediately. Undeleted branches accumulate and cause confusion.

---

## Branch Naming

```
<JIRA-ID>/<short-description>
```

The Jira ID provides traceability. The short description provides readability — anyone looking at a branch list or PR title should know what it's for without opening Jira.

### Examples

```
SIDM-55/fix-login-email-comparison
SIDM-61/user-avatar-fallback
SIDM-78/update-node-to-v20
SIDM-90/auth-middleware-cleanup
```

### What to avoid

```
omar-working-branch     ← who is omar, what is he working on?
temp                    ← temp of what?
SIDM-55                 ← traceable but unreadable — open Jira just to know what this is
fix2                    ← fix of what, and what happened to fix1?
my-feature-final-v3     ← this is a version control problem, not a branch
```

---

## The GitHub Flow Loop

```
1. Pull latest main
   git checkout main && git pull

2. Create your branch
   git checkout -b SIDM-55/short-description

3. Work on your task (commit as needed)

4. Push and open PR
   git push -u origin SIDM-55/short-description

5. When ready: mark PR as "Ready for Review"
   → CI must be green
   → PR description must be complete

6. Get review, address feedback, get approval

7. Merge commit to main
   → Delete branch immediately
```

---

## What to Avoid

| Anti-pattern | Why it's a problem |
|---|---|
| Branching off a teammate's branch | You inherit their bugs and create a merge dependency |
| Long-lived branches (>3–4 days) | Accumulate conflicts, hard to review, risky to merge |
| One branch per person (`omar-branch`) | Not tied to a task — can contain anything, reviewed by nobody |
| Committing directly to `main` | Bypasses CI and review — violates the core contract |
| Not deleting branches after merge | Creates noise, occasionally reused by accident |
| Force-pushing to a shared branch | Rewrites history — breaks anyone who has pulled that branch |
