# Writing a Pull Request

A PR is a proposal to change the codebase. It needs to explain what changed, why it changed, and how to verify it works. A reviewer should never have to ask the author to explain it.

---

## The Standard

1. **Every PR must have a complete description.** Title, summary, how to test, and a linked Jira ticket. A PR description that says "fixes the thing" will sit unreviewed.

2. **One task = one PR.** If your PR touches more than one Jira ticket, it should be two PRs.

3. **CI must be green before requesting review.** Do not request review on a red build. Fix it first.

4. **Screenshots are required for UI changes.** Before and after. Reviewers cannot visualize what CSS changes look like by reading diffs.

5. **Open as a draft early.** You don't have to wait until a task is 100% complete. Opening a draft creates visibility and enables early feedback.

6. **Keep PRs small and focused.** A PR that can be reviewed in 15–30 minutes gets reviewed today. A PR that takes an hour gets deferred until tomorrow.

---

## PR Title Format

```
<type>: <short description of what changed>
```

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance, dependencies, config |
| `refactor` | Code change with no behavior change |
| `docs` | Documentation only |
| `test` | Tests only |

### Examples

```
feat: add fallback initials when user avatar is missing
fix: avatar not loading on first page visit
chore: upgrade eslint to v9
refactor: extract auth token validation into shared utility
```

---

## PR Description Template

```markdown
## What
[One or two sentences describing what changed. Not how — what.]

## Why
[Why this change was needed. Link to the Jira ticket.]
Jira: [TICKET-ID](link)

## How to test
1. [Step-by-step instructions a reviewer can follow]
2. [Be specific — which user, which URL, which action]
3. [What should happen at each step]

## Screenshots
[Before and after — required for any UI change. Delete this section if no UI change.]

## Checklist
- [ ] Tests added or updated
- [ ] No console.log or debug code left
- [ ] No unrelated changes included
- [ ] CI is green
```

---

## What to Include vs Exclude

### Include
- Everything required to implement the Jira task
- Tests covering the acceptance criteria
- Updated documentation if behavior changed (API docs, README if relevant)

### Exclude
- Unrelated changes — even small ones ("while I was in there I also fixed...")
- Commented-out code
- Console logs, debug statements, TODO comments that aren't tracked
- Changes outside the task scope (open a new ticket instead)

---

## Draft PRs

Open a draft PR when:
- You want early feedback on your approach before finishing
- You want CI to run on your branch without requesting review
- You want your work to be visible to the team while in progress

A draft PR signals: "I'm working on this, not ready for review yet." Convert it to "Ready for Review" when:
- All acceptance criteria are met
- CI is green
- Description is complete

---

## PR Size

| PR size | Review time | Merge confidence |
|---|---|---|
| < 200 lines | 15–30 min | High |
| 200–500 lines | 30–60 min | Medium |
| > 500 lines | Deferred, rushed, or missed | Low |

If a task produces a large PR, consider:
- Can it be split into a foundation PR (data model, types) and a feature PR (UI, logic)?
- Is the scope too large for a single task? Split the ticket.

---

## What to Avoid

| Anti-pattern | Why it's a problem |
|---|---|
| PR description: "fixes the bug" | Reviewer has to read every line to understand what changed and why |
| No "How to test" section | Reviewer guesses how to verify — or doesn't verify at all |
| No Jira link | No traceability between code and product decisions |
| Requesting review on red CI | Forces reviewer to wait, or they review code that's about to change |
| 800-line PR | Reviewed superficially or deferred — high-risk merge |
| Including unrelated fixes | Mixes concerns — harder to review, harder to revert if something breaks |
