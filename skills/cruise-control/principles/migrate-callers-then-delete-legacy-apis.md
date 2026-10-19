# Migrate Callers Then Delete Legacy APIs

**When:** Apply when introducing a new internal API while old callers still exist. Migrate callers and delete the old API in the same wave instead of preserving compatibility layers.

- Update tests to assert the new contract, and delete tests that only protect pre-refactor implementation details

**When this applies:**
- No caller outside this repo depends on the old API. The frontend and backend deploy together, so a DRF endpoint and its generated orval client are internal.
- The new API is part of a simplification or refactor.

**In pwrench-server:**
- "Same wave" means the same PR stack, not one PR. Keep each PR inside the team's slice size. Each slice merges on its own, so old and new APIs can live side by side until the last slice deletes the old one.
- A change to a DRF endpoint contract is still a big decision for the user (`decide`).
