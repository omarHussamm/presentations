# SDLC at Vertowave

This page maps the full software development lifecycle at Vertowave. Each phase links to a dedicated guide.

| # | Phase | Description | Guide |
|---|---|---|---|
| 1 | Requirements & User Stories | Gather and define what needs to be built, from stakeholder input to written user stories | Not yet written |
| 2 | Architecture & Technical Planning | Design the technical approach before implementation begins | Not yet written |
| 3 | Writing a Task | Translate requirements into actionable, unambiguous Jira tasks ready for the sprint | [Guide](01-writing-a-task.md) |
| 4 | Branching Strategy | Create and manage branches using GitHub Flow so `main` is always deployable | [Guide](02-branching-strategy.md) |
| 5 | Local CI Checks | Run lint, format, commit message, and test checks locally before pushing | [Guide](03-local-ci-lefthook.md) |
| 6 | Writing a Pull Request | Describe what changed, why, and how to verify it before requesting review | [Guide](04-writing-a-pull-request.md) |
| 7 | Reviewing a Pull Request | Review for correctness, security, performance, and clarity within 24 hours | [Guide](05-reviewing-a-pull-request.md) |
| 8 | Merging and CI/CD | Merge to `main`, let the pipeline run, and verify nothing broke | [Guide](06-merging-and-cicd.md) |
| 9 | Monitoring & Observability | Confirm your change behaved correctly in the real environment after deployment | Not yet written |
