# PostHog Product Analytics (via `posthog-cli`)

## What this source contains

PostHog is the product/data view. It complements Datadog (the infra/runtime view): what users did, which experiments and feature flags were live, and how feature usage evolved around a ship date.

- **Events.** Feature invocations, clicks, submissions, client-reported errors
- **Insights and trends.** Saved analyses the team already considered important
- **Feature flags and experiments.** Flag definitions, rollout state, exposure data
- **Persons/cohorts.** Who was affected (use sparingly; counts beat identities for this skill)

Best at surfacing: usage trajectories (a step function from zero right after a PR suggests that PR launched the feature), where a threshold constant came from (a distribution whose p99 matches the constant), and flag-gated ship decisions.

## How to search it

Use `posthog-cli api`, the agent-first interface over PostHog's tool catalog. Discover before calling; do not guess tool names:

```bash
posthog-cli api tools                      # list every available tool
posthog-cli api search '<regex>'           # find tools by name or description
posthog-cli api info <tool>                # description + input schema
posthog-cli api call <tool> '<json>'       # execute
```

1. **Orient.** `posthog-cli api search 'insight|query|event'` to find the query tools, then `info` on the best match. HogQL-style query tools answer "daily counts of event X in a window" directly.
2. **Event trajectory.** Query daily counts of the relevant event for ±30 days around the PR merge date. Time-bound every query.
3. **Flags and experiments.** `posthog-cli api search 'flag|experiment'`, then look up the target's flag key: definition, rollout percentage history, exposure counts near the ship date.
4. **Threshold origins.** For a constant in the code, query the distribution of the matching event property in the window before the PR. A p99 that matches the constant suggests the number was chosen from data.
5. **Mutations are out of scope.** This is an investigation; call read tools only. Destructive tools require `--confirm`; never pass it here.

## What good evidence looks like here

- An event's daily count stepping from zero to steady volume within a day or two of the merge
- An error-classified event dropping to near zero after a defensive-code PR
- A feature flag whose rollout timeline brackets the ship date
- A property distribution whose p99 matches the code's threshold constant

## Common pitfalls

- **Instrumented ≠ caused.** An event's existence means someone logged it, not that the code exists because of it. Pair with a PR/commit citation before claiming causation.
- **Silent instrumentation changes.** A volume step function may mean logging started, not that behavior changed. Check for instrumentation PRs in the same window.
- **Schema drift.** Event properties evolve; older data may not carry the property.
- **Retention cliff.** If the relevant window predates event retention, that is a gap, not a null result. Name it so the synthesizer does not read "no results" as "no activity."

## What to return

For each relevant finding:
- Type (event trend / flag / experiment / property distribution)
- The tool called and the exact query input
- Time window queried
- Compact numeric summary (counts, percentiles, first/last-seen). Do not dump raw rows.
- Temporal correlation with the target's ship date
- Relevance + strength: direct / circumstantial / weak
