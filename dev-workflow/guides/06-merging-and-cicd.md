# Merging and CI/CD

When code merges to `main`, the pipeline takes over. This guide covers the merge process, what happens automatically, and your responsibilities after a merge.

---

## The Standard

1. **Never merge a red build.** CI must be green on the branch before merging. No exceptions.

2. **Use merge commit.** Preserves the full commit history of the branch on `main`.

3. **Delete the branch immediately after merge.**

4. **If `main` CI breaks after your merge — fix it immediately.** Stop what you're working on. Either push a fix or revert your merge. A broken `main` blocks everyone.

5. **Update the Jira ticket after merge.** Move it to "Done" and close it.

---

## Merge Checklist

Before clicking merge:

- [ ] CI is green on the branch
- [ ] At least one approval received
- [ ] No unresolved "Request Changes" comments
- [ ] Branch is up to date with `main`
- [ ] PR description links to the Jira ticket

After merge:

- [ ] Branch deleted
- [ ] Jira ticket moved to "Done"
- [ ] CI on `main` is green

---

## What Happens After Merge

Every merge to `main` triggers the CI pipeline automatically. The stages run in order — a failure at any stage stops the pipeline.

```
merge to main
    │
    ▼
1. lint + format check      ← same checks as local CI (Lefthook pre-commit)
    │
    ▼
2. test                     ← same checks as local CI (Lefthook pre-push)
    │              │
    ▼              ▼ (parallel)
3. build        security analysis
    │
    ▼
4. update Docker image in registry   ← tagged with commit SHA
    │
    ▼
5. deploy to Azure testing environment
   (trigger mechanism TBD — check with team lead for current state)
```

---

## If CI Breaks After Your Merge

This is rare if the process was followed — but it happens when two branches are both green independently but conflict when combined.

**Your responsibility:**

1. Do not start new work.
2. Identify what your merge broke by reading the CI failure.
3. Push a fix commit, or revert your merge if the fix is not quick.
4. `main` being broken blocks every other developer from merging. Fix it fast.

**How to revert a merge commit:**

```bash
# Find your merge commit SHA
git log --oneline main

# Revert the merge commit (-m 1 targets the main branch parent)
git revert -m 1 <merge-commit-sha>
git push origin main
```

A revert is not a failure — it's the responsible action when something unexpected breaks.

---

## What to Avoid

| Anti-pattern | Why it's a problem |
|---|---|
| Merging a red build | Breaks `main` immediately — blocks the team |
| Not deleting the branch after merge | Branches accumulate, create confusion, occasionally get reused |
| Not watching CI on `main` after merge | Breaks sit undetected until someone else notices |
| Starting new work while `main` is broken | Spreads the breakage — fix first, then resume |
