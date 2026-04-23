# Writing a Jira Task

A task is a contract between the person defining the work and the person doing it. A well-written task means the developer builds the right thing, knows when they're done, and can work without interruption.

---

## Task Template

```
Title: [type]: [brief description of what is changing] — [TICKET-ID]

Goal:
[One or two sentences. Why does this task exist? What problem does it solve?]

Context:
[Background the developer needs. Links to designs, related tickets, previous decisions, screenshots. Anything they would need to find on their own without this field.]

Requirements:
- [Specific, testable statement of what the system must do]
- [Another requirement]
- [...]

Acceptance Criteria:
- [ ] [Pass/fail condition — observable, testable]
- [ ] [Pass/fail condition]
- [ ] [...]

Out of Scope: (required when boundaries are ambiguous)
- [What is explicitly NOT included in this task]
- [...]

Implementation Notes: (optional)
- [Technical hints, not prescriptions — e.g. "there's already a utility for this in X", "follow the pattern used in Y", "library Z is already imported and handles this"]
- [...]
```

---

## The Standard

1. **Every non-trivial task must have all required fields.** Goal, Context, Requirements, and Acceptance Criteria. If any of these are blank, the task is not ready to enter the sprint — get the missing information before it moves forward.

2. **Acceptance criteria must be testable.** Each AC is a pass/fail statement — not a description. "The avatar loads correctly" is not an AC. "Avatar is visible on first page load without refreshing" is.

3. **Out of Scope is required when the boundaries aren't obvious.** If a developer could reasonably assume something adjacent is included, write it down. Without it, two developers will make different assumptions — and both will be wrong in some way.

4. **Requirements describe what the system must do — not how.** The implementation is the developer's responsibility. The requirement is yours.

5. **A task that can't be picked up cold is not done.** If a developer needs to ask you to explain it, rewrite it.

---

## Type-Specific Additions

### Feature
- Are designs attached or linked?
- If this is a backend feature, is the API contract defined?
- Are error states covered in the ACs?

### Bug
- Are reproduction steps included? (step-by-step, not a summary)
- Is expected behavior described alongside actual behavior?
- Is the environment noted? (which browser, which env, which user type)

### Refactor
- What is the measurable outcome? (test coverage target, performance metric, complexity reduction)
- Is it confirmed that no user-visible behavior changes?
- Is the test coverage requirement noted before and after?

---

## Examples

### Bad
```
Title: Fix login

Description: The login page is broken sometimes. Please fix it and make it faster.
```

No goal, no scope, no ACs. The developer has to guess what "broken" means, what "faster" means, and what done looks like.

### Good
```
Title: fix: login fails when email contains uppercase characters — AUTH-88

Goal:
Users with uppercase letters in their email address cannot log in. This affects roughly 12% of accounts based on our user data.

Context:
The issue was introduced in the email normalization refactor (AUTH-75). The comparison is now case-sensitive where it wasn't before. Design: N/A (no UI change). Related: AUTH-75.

Requirements:
- Email comparison during login must be case-insensitive
- Email stored in the database is not modified (normalization is display-only)

Acceptance Criteria:
- [ ] User with email "John@example.com" can log in using "john@example.com" and vice versa
- [ ] Login still fails with a correct-case email + wrong password (no regression)
- [ ] No change to stored email format in the database

Out of Scope:
- Email normalization on signup
- Password reset flow

Implementation Notes:
- The normalization logic already lives in `AuthService.NormalizeEmail` — use that rather than re-implementing it
```

---

## What the Developer Will Do With This Task

When a developer picks up your task, they will:

1. Read the **Goal** first to understand the intent — this is the lens they use when edge cases appear that the requirements don't cover.
2. Read the **Acceptance Criteria** as their definition of done — they'll verify against these before opening a PR.
3. Check **Implementation Notes** before touching the codebase.
4. If a required field is missing or too vague to act on, they'll flag it rather than guess — which means the task comes back to you anyway, just later and more expensively.

A well-written task is not extra work.
