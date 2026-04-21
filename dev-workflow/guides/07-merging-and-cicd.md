# Merging and CI/CD

When code merges to `main`, the pipeline takes over. This guide covers the merge process, what happens automatically, and your responsibilities after a merge.

---

## The Standard

1. **Never merge a red build.** CI must be green on the branch before merging. No exceptions.

2. **Use squash merge.** All commits on the branch are squashed into one commit on `main`. Clean history, easy to read, easy to revert.

3. **Delete the branch immediately after merge.** GitHub can do this automatically — enable "Automatically delete head branches" in repository settings.

4. **Watch CI on `main` for a few minutes after your merge.** A branch can be green but still break `main` when combined with another recently merged branch. Catch it early.

5. **If `main` CI breaks after your merge — fix it immediately.** Stop what you're working on. Either push a fix or revert your merge. A broken `main` blocks everyone.

6. **Update the Jira ticket after merge.** Move it to "Done" and close it.

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

## Merge Strategy — Why Squash

| Strategy | What it does | When to use |
|---|---|---|
| **Squash merge** ✅ | All branch commits → one commit on `main` | Our standard — clean history |
| Merge commit | Preserves all commits + adds a merge commit | Teams that want full commit history |
| Rebase merge | Replays commits onto `main`, no merge commit | Good if commits are clean and meaningful |

Squash merge keeps `main`'s log readable. Six months from now, "fix: avatar not loading on first visit" is useful. "wip", "actually fix it", "final", "for real this time" are noise.

---

## What Happens After Merge

Every merge to `main` triggers the CI/CD pipeline automatically via GitHub Actions. No manual steps required.

### Pipeline stages

```
push to main
    │
    ▼
1. lint + test          ← same checks as local CI (Lefthook)
    │
    ▼
2. build                ← compile, bundle, or build the artifact
    │
    ▼
3. docker image         ← build and tag with the commit SHA
    │
    ▼
4. push to registry     ← image pushed to the container registry
    │
    ▼
5. deploy to staging    ← automatic, every merge to main
    │
    ▼
6. [manual gate]        ← explicit approval required
    │
    ▼
7. deploy to production
```

Each stage must pass before the next one starts. A failure at any stage stops the pipeline — nothing broken propagates further downstream.

---

## Staging vs Production

| Environment | How it's triggered | Who approves |
|---|---|---|
| **Staging** | Automatically on every merge to `main` | Nobody — fully automatic |
| **Production** | Manual gate after staging deploy | Team lead or designated approver |

Staging always reflects `main`. If you merged and staging is broken, it's your responsibility to fix it.

Production is a deliberate choice. The manual gate exists to make production deployments intentional — not an accidental side effect of a merge.

---

## GitHub Actions — Example Pipeline

This is what the automation looks like. You won't be writing this, but you should understand it when you see it.

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
    needs: lint-and-test           # only runs if lint-and-test passes
    if: github.ref == 'refs/heads/main'   # only runs on main, not on PRs
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

Key things to understand:
- `on: pull_request` — CI runs on your branch before you merge. This is the green check you need.
- `needs:` — stages are sequential. Failure stops the pipeline.
- `github.sha` — the commit hash. Every deployed image is tagged with the exact commit that built it. This is how you know what's running where.
- `if: github.ref == 'refs/heads/main'` — build and deploy only happen after merging to `main`, not on every PR.

---

## If CI Breaks After Your Merge

This is rare if the process was followed — but it happens when two branches are both green independently but conflict when combined.

**Your responsibility:**

1. Do not start new work.
2. Identify what your merge broke by reading the CI failure.
3. Push a fix commit, or revert your merge if the fix is not quick.
4. `main` being broken blocks every other developer from merging. Fix it fast.

**How to revert a squash merge:**

```bash
# Find the commit SHA of your merge on main
git log --oneline main

# Revert it
git revert <commit-sha>
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
| Manually deploying without going through the pipeline | Bypasses all gates — untested code goes to production |
