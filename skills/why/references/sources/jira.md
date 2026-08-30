# Jira Tickets (via `acli`)

## What this source contains

- Work items (stories, bugs, tasks) describing features, defects, and their motivation
- Parent/sub-item relationships (broader initiative → specific tickets)
- Comments on work items (clarifications, scope changes, "why we're doing this" rationale)
- Labels and components that signal the type of motivation
- Attachments and linked PRs

Jira is where the product/business context often lives: the "we're doing this because customer X asked" or "this is for the Q3 compliance initiative" layer. The project key is `PWDEV`; commit subjects and branch names carry ticket IDs like `PWDEV-1234`.

## How to search it

Use the `acli jira workitem` commands. Run `acli jira workitem <command> --help` for flags.

1. **Start with linked tickets.** Seed commits, PR titles, and branch names usually carry `PWDEV-NNNN` IDs. Fetch those first: `acli jira workitem view PWDEV-1234`. Read the full item, then its comments via `acli jira workitem comment --help` for the read commands.
2. **Search by keyword.** `acli jira workitem search` with a JQL query. Try multiple phrasings of the feature name, key symbol, or business term, e.g. `--jql "project = PWDEV AND text ~ 'quick story'"`.
3. **Walk the item tree.** If you land on a sub-item, fetch its parent. Sub-items are tactical; parents often carry the "why."
4. **Check labels, components, and sprints.** They hint at the category of motivation (customer request, incident follow-up, perf). Sprint or fix-version dates tie work to deadlines, which often reveal motivation.

## What good evidence looks like here

- A description stating the business problem: "OEM X needs this for their audit"
- A comment recording a decision: "We went with approach B because approach A touches the billing service"
- A parent item titled like an initiative
- An attached spec or PRD
- Labels that categorize the motivation

## Common pitfalls

- **Scope drift.** The ticket the PR references may have been closed and reopened with a different scope. Read the whole history.
- **Mechanical templates.** Boilerplate "Why" sections ("improve user experience") are not real answers.
- **Stale tickets.** Old tickets often reflect a plan that changed. Check dates against the code's ship date.
- **Duplicate chains.** Follow duplicate links back to the canonical ticket.
- **Access gaps.** If an item is not accessible, note that as a gap rather than guessing.

## What to return

For each relevant work item:
- Ticket ID and title
- The problem/motivation quoted from the description or comments (not paraphrased; the synthesizer needs the exact text to cite)
- Labels, parent item, sprint/fix version
- Author, created date, resolved date
- Link to the ticket
