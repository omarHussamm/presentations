# Local CI with Lefthook

Local CI runs the same checks as the remote pipeline — on your machine, before you push. Catch problems in seconds, not minutes.

---

## The Standard

1. **Fix hook failures — never bypass them.** `--no-verify` is banned. If a hook fails, the code has a problem. Fix the problem, don't silence the check.

2. **If it passes locally, it passes in CI.** This is the contract. If your local hooks pass and CI still fails, the environment is misconfigured — raise it immediately.

3. **Never push code you know is broken.** A bypass (`--no-verify`) means you're knowingly pushing bad code. The CI pipeline will catch it anyway — you've just moved the failure downstream and wasted everyone's time.

4. **If a hook is misconfigured, fix it and tell the team.** The only valid reason to bypass a hook is if the hook itself is broken. In that case, fix the hook configuration and notify the team so nobody else hits the same issue.

---

## What Lefthook Runs

| Git event | Checks |
|---|---|
| `pre-commit` | Lint, format check |
| `pre-push` | Tests, build check |

These match the first stages of the CI pipeline. The goal is to make CI failures on push a rare event, not a routine one.

---

## The Fix-Push-Wait Problem

Without local CI, a typical cycle looks like this:

```
push → wait 3 min → CI fails (lint) → fix → push → wait 3 min
    → CI fails (test) → fix → push → wait 3 min → green ✅
```

Total time: ~10 minutes of waiting, multiple push-fix cycles.

With Lefthook:

```
git commit → lint fails instantly → fix → commit
git push → tests run locally → fix → push → CI green ✅
```

The failure is caught in seconds. The feedback loop is tight. CI on push is the confirmation, not the discovery.

---

## What to Do When a Hook Fails

### Lint failure on commit

```bash
# See exactly what the linter flagged
npm run lint

# Auto-fix what can be fixed
npm run lint -- --fix

# Stage the fixes and commit
git add .
git commit -m "fix: resolve lint errors"
```

### Test failure on push

```bash
# Run tests locally to see the failure
npm test

# Fix the failing test or the code it tests
# Then push again
```

### Hook is taking too long

If the pre-push hook is slow, investigate whether the test scope can be narrowed for local runs. Do not bypass — optimize the hook instead.

---

## What to Avoid

| Anti-pattern | Why it's a problem |
|---|---|
| `git commit --no-verify` | Skips lint and format — code with known issues reaches the PR |
| `git push --no-verify` | Skips tests — broken code reaches CI and blocks the team |
| Bypassing "just this once" | It becomes a habit. Every bypass normalizes the next one. |
| Silently fixing a misconfigured hook without telling the team | Everyone else hits the same issue until you speak up |

---

## Lefthook Configuration Reference

Lefthook is configured in `lefthook.yml` at the root of the repository. Example:

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      run: npm run lint
    format:
      run: npm run format:check

pre-push:
  commands:
    test:
      run: npm test
    build-check:
      run: npm run build
```

If you add a new check to the pipeline (e.g., a new linter), add it to `lefthook.yml` at the same time so local and CI stay in sync.
