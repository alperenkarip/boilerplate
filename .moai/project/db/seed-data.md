# Seed Data

Seeding strategy for Cloud Firestore (ADR-020). Local development and tests run against the
**Firebase Emulator Suite**; seeding is done either by importing an emulator export or by a script
using the **Firebase Admin SDK** (which bypasses Security Rules and writes directly — appropriate
for seeding only, never in app code).

> Reminder: in normal app flow, clients never write directly. Seeding is a privileged,
> out-of-band operation (Admin SDK / emulator import), not a client path.

---

## Seed Strategy

**Strategy**: _TBD_ (emulator-import / admin-script / hybrid)

<!--
Options:
- Emulator import: Maintain a checked-in emulator export and load it with
  `firebase emulators:start --import=./.firebase/seed --export-on-exit`
- Admin script: A Node script using firebase-admin to upsert documents into the emulator
  (or a dev project), e.g. functions/scripts/seed.ts
- Hybrid: Emulator import for deterministic test fixtures; Admin script for richer dev data
-->

**Seeding tool**: _TBD_ (e.g. firebase-admin script, emulator import)

**When seeds run**:
- [ ] On local setup (`firebase emulators:start --import=...`)
- [ ] In CI before integration tests (start emulator + import seed)
- [ ] On dev project resets (Admin SDK script)
- [ ] Other: _TBD_

**Seed order** (respecting reference integrity and derived fields):

1. _TBD_
2. _TBD_
3. _TBD_

<!--
Example:
1. Auth users (Auth emulator) — establishes uids
2. users/{uid} profile docs keyed by those uids
3. posts (authorUid referencing seeded users)
-->

---

## Fixture Locations

| Environment | Path | Format | Notes |
|-------------|------|--------|-------|
| Development | _TBD_ | _TBD_ | _TBD_ |
| Test / CI | _TBD_ | _TBD_ | _TBD_ |

<!--
Example:
| Development | .firebase/seed/           | Emulator export | Loaded with --import for local dev |
| Test / CI   | functions/test/fixtures/  | TS + Admin SDK   | Deterministic minimal documents |
-->

---

## Dev vs Prod Data

**Always seed in dev/test** (safe synthetic data):

- _TBD_

<!--
Example:
- Synthetic Auth users (alice@example.com, bob@example.com) in the Auth emulator
- Sample users/{uid} profiles and posts with placeholder content
- Demo workspace with feature flags enabled
-->

**Never seed in production** (must not appear in the live project):

- _TBD_

<!--
Example:
- Any document referencing @example.com identities
- Hardcoded secrets, service-account keys, or test tokens
- Admin SDK seed scripts pointed at the production project
-->

**Production data that IS safe to seed** (reference/static collections):

- _TBD_

<!--
Example:
- Lookup collections (countries, currencies)
- Default email/notification templates
- System-defined role definitions
- Feature-flag definitions (not their per-user values)
-->
