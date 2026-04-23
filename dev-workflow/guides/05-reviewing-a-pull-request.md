# Reviewing a Pull Request

Code review is the team's primary quality gate. It exists to ship correct, secure, readable code — not to demonstrate expertise or find fault. This guide defines what to review for, how to give useful feedback, and how to receive it.

---

## The Standard

1. **Review within 24 hours of a PR being marked "Ready for Review."** A PR sitting unreviewed is a bottleneck for the whole team — especially for junior developers waiting to know if they're on the right track.

2. **Focus on correctness, security, performance, and clarity.** These are your jobs. Style and formatting are the linter's job.

3. **Every comment must be specific and actionable.** "This is wrong" is not a review comment. "This could throw a null reference if `user` is undefined — add a guard here" is.

4. **Respond to every comment.** Author: acknowledge every comment with either "done" or a response. Don't silently ignore feedback.

5. **Use the right review status.** Approve, Request Changes, and Comment mean different things. Use them correctly.

---

## What to Review For

### Correctness
- Does the code do what the Jira task requires?
- Does it handle the edge cases defined in the acceptance criteria?
- Are boundary values handled correctly?

### Security
- Is user input validated before use?
- Are authorization checks happening server-side — not just in the UI?
- Are there any hardcoded secrets, tokens, or credentials?
- Are there SQL injection or other injection risks?

### Performance
- Are there N+1 queries or unbounded data loads?
- Is pagination applied where the result set could be large?
- Is anything blocking the main thread unnecessarily?

### Clarity
- Can you understand what the code does without the author explaining it?
- Are variable and function names descriptive of what they do?
- Is there logic that needs a comment to explain a non-obvious decision?

### PR quality
- Does the description explain what changed and why?
- Is the "How to verify" section clear enough to follow?
- Is the Jira ticket linked?

---

## What is NOT Your Job to Review

| Not your concern | Why |
|---|---|
| Code style and formatting | The linter and formatter enforce this automatically. Don't leave comments about indentation, quotes, or semicolons. |
| Personal preference | "I would have done it differently" is noise — not a review comment. If the approach is correct and clear, it passes. |
| Out-of-scope issues | If you notice something unrelated that needs fixing, open a new ticket. Don't block this PR on unrelated work. |

---

## How to Give Feedback

### The formula
> [What the issue is] + [Why it's a problem] + [Suggested fix or alternative]

All three. If you can't explain why it's a problem, reconsider whether it's actually a problem.

### Examples

**Weak:**
> "This is wrong."
> "Why did you do it this way?"
> "This needs to be refactored."

**Strong:**
> "This could throw a null reference if `user` is undefined — can we add a guard before line 42?"
> "This function is doing two things (fetching and transforming). Splitting it would make it easier to test. What do you think?"
> "Hardcoded string here — if this changes we'd need to find every occurrence. Consider extracting to a constant."

### Tone
- Comments are about the code, not the person.
- "What do you think?" invites dialogue instead of creating defensiveness.
- If you're unsure whether something is an issue, ask a question rather than making an assertion.

---

## How to Receive Feedback

1. **Separate code from identity.** A comment on your PR is about the code, not you.
2. **Respond to every comment.** "Done", "Fixed in latest commit", "I disagree — here's why" are all valid. No response is not.
3. **Re-request review after addressing comments.** Don't assume the reviewer will notice you pushed new commits.

---

## Review Status — When to Use Each

| Status | When to use |
|---|---|
| **Approve** | The code is correct, safe, and mergeable. You've verified the changes against the ACs. |
| **Request Changes** | There is a blocking issue: a correctness bug, a security risk, a missing critical test. The PR must not be merged as-is. |
| **Comment** | Non-blocking observations, questions, or suggestions. The author can address or respond, but merging is not blocked. |

### The most common misuse
Using "Request Changes" for style preferences or personal preference. If it's not a genuine blocker, use "Comment."

---

## Review Turnaround

- **First review:** within 24 hours of "Ready for Review"
- **Re-review after changes:** within 24 hours of author re-requesting
- **Merge criteria:** at least one approval + CI green + no unresolved blocking comments

Reviewing is part of your job — not optional work between your own tasks. When PRs queue up unreviewed, the team slows down even if individuals are busy.

---

## What to Avoid

| Anti-pattern | Why it's a problem |
|---|---|
| Reviewing for style (spacing, naming preferences) | Wastes review time on things the linter handles; misses real issues |
| "This is wrong" with no explanation | The author can't fix what they don't understand |
| Approving without reading the diff | Rubber-stamp reviews erode the value of the quality gate |
| Blocking a PR on out-of-scope issues | Creates work inflation and blocks unrelated work |
| Leaving comments unresolved for days | The PR is stuck; the developer is blocked; the ticket is stalled |
| Not re-requesting review after pushing changes | The reviewer doesn't know you've addressed their comments |
