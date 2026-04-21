# Branching Strategy — GitHub Flow

We use GitHub Flow. This guide defines the rules and explains why each one exists.

---

## The Core Rule

**`main` is always deployable.**

Every commit on `main` must be in a state that could be shipped to production. This is not aspirational — it is a hard requirement. Everything else in this guide exists to enforce it.

---

## The Standard

1. **Always branch off `main`.** Pull the latest `main` before creating your branch. Branching off a teammate's unmerged branch creates a dependency chain that's hard to untangle.

2. **One task = one branch.** A branch has a single, clear purpose. When the task is done, the branch is merged and deleted. Long-lived branches accumulate conflicts and become hard to review.

3. **Use the naming convention.** See below. A branch name should tell anyone what the branch is for without having to look it up.

4. **Keep branches short-lived.** A branch that lives for more than a few days is a warning sign. Either the task is too large (split it) or it's blocked (surface it).

5. **Open a draft PR early.** As soon as you have something meaningful, open a draft PR. This creates visibility and enables early feedback before you've gone too far in the wrong direction.

6. **Never commit directly to `main`.** All changes go through a PR. No exceptions.

7. **Delete the branch after merge.** Immediately. Undeleted branches accumulate and cause confusion. Enable auto-delete in GitHub repository settings.

---

## Branch Naming

```
<type>/<short-description>
```

| Type | When to use |
|---|---|
| `feat/` | New feature or functionality |
| `fix/` | Bug fix |
| `chore/` | Dependency updates, config changes, tooling |
| `refactor/` | Code restructuring with no behavior change |
| `docs/` | Documentation only |
| `test/` | Adding or fixing tests only |

### Examples

```
feat/user-avatar-fallback
fix/profile-load-on-first-visit
chore/update-node-to-v20
refactor/auth-middleware-cleanup
```

### What to avoid

```
omar-working-branch     ← who is omar, what is he working on?
temp                    ← temp of what?
fix2                    ← fix of what, and what happened to fix1?
my-feature-final-v3     ← this is a version control problem, not a branch
new-stuff               ← meaningless
```

---

## The GitHub Flow Loop

```
1. Pull latest main
   git checkout main && git pull

2. Create your branch
   git checkout -b feat/short-description

3. Work on your task (commits as needed)

4. Push and open a draft PR
   git push -u origin feat/short-description
   → Open PR on GitHub, mark as Draft

5. When ready: mark PR as "Ready for Review"
   → CI must be green
   → PR description must be complete

6. Get review, address feedback, get approval

7. Squash merge to main
   → Delete branch immediately

8. Watch CI on main
```

---

## Why Not GitFlow?

GitFlow uses multiple long-lived branches (`main`, `develop`, `release/*`, `hotfix/*`). It was designed for teams doing scheduled, versioned releases — like mobile apps or packaged software where you can't push an update to users at any time.

We deploy to the web continuously. GitFlow's extra branches add overhead without adding value. GitHub Flow is simpler, faster, and has fewer things to get wrong.

The rule of thumb: if you can deploy any time you want, use GitHub Flow. If you have strict release windows and need to hotfix a specific version, GitFlow makes sense.

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
