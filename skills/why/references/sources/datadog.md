# Datadog Telemetry

## What this source contains

Datadog holds the runtime record: what actually happened in production, as opposed to what was planned or discussed.

- **Metrics.** Counters, gauges, histograms instrumented by the team. A metric's *presence* is itself evidence: someone thought this number worth watching.
- **Monitors & alerts.** Conditions the team decided warranted waking someone up. A monitor firing on `rate_limit_hit > 10/min` is direct evidence the team worried about that threshold.
- **Dashboards.** Curated views. The charts tell you what the team considers important for a subsystem.
- **APM traces & spans.** Request-level runtime data. Useful for "why is this slow" / "why is there a timeout here" questions.
- **Logs.** High-volume event records. Often contain the error conditions that motivated defensive code.
- **Incidents.** Formal incident records with timelines and linked postmortems.
- **Notebooks.** Exploratory investigations; often contain hypotheses and analyses.

Datadog answers "what was the production reality around the time this code was written?", which often explains the code's shape.

## How to search it

Use the `pup` CLI (Datadog API; the us5 region is already configured). `pup --help` lists the domains (`monitors`, `dashboards`, `metrics`, `logs`, `events`, `error-tracking`, `apm`, and more) plus query-syntax and time-format guidance; `pup <domain> --help` lists actions and flags. Start broad, then narrow.

`pup` often loses its login. If a call fails because it is not authenticated, run `pup auth refresh` with the Claude Code sandbox off (it writes tokens to `~/.config/pup/`), then retry the call. If the refresh fails too, `pup auth login` needs a browser: ask the user to run it, and record Datadog as a gap until then.

1. **Dashboards and monitors first. They tell you what the team cares about.** Search `pup dashboards` and `pup monitors` for the feature name, service name, or symbol. When a dashboard or monitor covers the target, note its queries and watched thresholds. The threshold is frequently the answer to "why is this clamped at N?"

2. **Metrics around the target.** Use `pup metrics` to find metric names matching the feature or symbol, then pull the timeseries: was there a spike around the PR date? Correlating a metric's trajectory with the target's add/change date is strong supporting evidence: "the `payment_timeout` metric spiked 2025-11-03, and the retry logic merged 2025-11-06."

3. **Logs. Narrow, don't dump.** Search `pup logs` with symbols, error strings, or feature names. **Strongly prefer time-bounded queries** (e.g., 30 days before/after the change). Log volume is huge; unconstrained searches waste time and may time out. Aggregate counts instead of dumping raw logs.

4. **APM spans and traces.** `pup apm` for failure rates, slow paths, and cross-service behavior. Useful for timeouts and retries.

5. **Incidents and events.** Search `pup events` (and the incident/case domains) by title, team, or date range. If the target looks defensive, search for incidents around the time it was added. An incident whose timeline includes "added defensive check for X" is near-direct evidence.

## What good evidence looks like here

- A monitor whose query and threshold match the constraint the code enforces (code clamps to 100; monitor alerts when requests exceed 100/min)
- A dashboard created by the target's author, with widgets that correspond to what the code measures or guards against
- A metric showing a production spike immediately before the code was merged, and stable values after
- An incident record referencing the target code, the same symbols, or the same error strings
- Logs showing a specific error pattern the defensive code would prevent, timestamped in the window before the change

## Common pitfalls

- **Correlation is not causation.** A spike before a PR and stabilization after is suggestive, not definitive. Other changes may have landed in the same window. Check neighboring PRs.
- **Overfitting to the chart you found.** Datadog visualizations are *made* by humans and reflect that human's framing. A chart named "retry success rate" is evidence the team cared about retry success, not that it's why a specific line of code exists.
- **Vanished telemetry.** Metrics can be renamed, deleted, or have short retention. If you can't find data from the relevant window, that's a gap, not a null result.
- **Noise at scale.** Searching logs for a common string returns thousands of matches. Narrow by service, tag, and time aggressively. Aggregate counts rather than dumping raw logs.
- **Instrumented != caused.** A metric's existence tells you someone cared enough to measure something, not that the code was added *because* of it. Cross-reference with commit/PR dates.

## What to return

For each relevant item:
- Type (dashboard / monitor / metric / log pattern / trace / incident / notebook)
- Title or name
- Link or identifier (dashboard ID, monitor ID, metric name, incident ID)
- Owner/author and created/modified date
- The specific condition, query, or quote that bears on the question (verbatim where possible)
- Relevance: what this suggests about the target code, and how strong the connection is
