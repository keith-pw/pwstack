# Broken plan

This fixture is wrong on purpose. It drops the You see sub-block, adds an unnumbered live box, uses a review gate with no wait for approval, and uses a mid-sentence colon here: like this. The checker must reject it.

## How to read this

One box is one unit of work. Every box names the evidence that checks it, a file, a log line, a screenshot, a test run, or a SHA. Check a box only when its evidence exists. The body is a how-to.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Add the feed reader (bx-1)

**Depends on.** None.

**Files.**

- [ ] Create `src/feed/reader.ts`.

**Build.**

- [ ] Add `readFeed` in `src/feed/reader.ts`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `src/feed/reader.test.ts` gains a case. Run `npm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Lane 1. Open the home screen. Save `bx-1-home.png`. Pass when the list renders.
- [ ] Open the settings screen. Save `bx-1-settings.png`. Pass when it renders.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. First render time.
- [ ] Probe. Load ten times at trunk and head.
- [ ] Baseline. Record the trunk median first.
- [ ] Rule. Head fails if over 10 percent above trunk.

**Review gate.** A human reviews before merge.

- [ ] Copy the lane screenshots into `docs/media/bx-1-review.png`.

**Merge.**

- [ ] Every box above is checked with its evidence.

## Close

- [ ] Every PR above is merged with its evidence recorded.

## Appendix A. Prototype evidence

No prototype was needed for this fixture.
