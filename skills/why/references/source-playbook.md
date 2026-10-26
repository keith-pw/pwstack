# Source playbooks

The why skill spawns one investigator per available evidence category, each reading the single playbook below that matches its category. The playbooks are written for Pencilwrench's tools.

| Category | Playbook | Tool it documents |
|---|---|---|
| Source control history | [`code-archaeology.md`](./sources/code-archaeology.md) | git, `gh` |
| Issue / ticket tracker | [`jira.md`](./sources/jira.md) | Jira via `acli jira` (project PWDEV) |
| Long-form documents | [`docs.md`](./sources/docs.md) | in-repo docs; Confluence is a recorded gap |
| Infrastructure observability | [`datadog.md`](./sources/datadog.md) | Datadog via `pup` (us5) |
| Error / exception tracking | [`sentry.md`](./sources/sentry.md) | Sentry via the `sentry` CLI |
| Product analytics | [`posthog.md`](./sources/posthog.md) | PostHog via `posthog-cli api` |
| Application data | [`pencilwrench-data.md`](./sources/pencilwrench-data.md) | the Pencilwrench MCP (read-only) |

Cross-cutting:

- [`incident-postmortem.md`](./sources/incident-postmortem.md). Add this if the target code looks defensive (null checks, retry, timeout, rate limit, feature flag, egress guard, OOM handler).
