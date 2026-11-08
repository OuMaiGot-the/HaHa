# Protected tutor pilot

## Release boundary

The public learning hub remains on its existing origin with its existing audience, lessons, browser-local progress and Mana. The new tutor runs on a separate **owner-private** Site listed in `server/pilot.json`. It is an owner test environment, not a student-wide AI rollout. Do not change either audience to get an API test working.

The small Worker embeds only tutor assets, original note data and the trusted visual renderer. The build is bounded to 1 MB and currently needs no production library. It does not migrate the 20 MB public app or proxy assets from another host. Returning to the study hub uses an explicit absolute link; progress is not copied or synchronized across origins. Each origin has its own microphone mute preference.

## Protection and budget

Sites owns sign-in and private access. The Worker additionally requires both trusted authenticated identity headers on every page and API request. It redirects an unsigned page request through the documented sign-in route and returns 401 for unsigned API calls. Service bypass access does not provide a learner identity and cannot select a teaching move. Never deploy this handler behind a proxy that accepts caller-supplied identity headers.

The POST endpoint pins the HTTPS Site origin, verifies Origin and browser fetch-site metadata, accepts bounded UTF-8 JSON only, and validates exactly the content version, current authored move and a question of at most 500 characters. Uploads, prior questions, learner records, microphone audio and names/emails are not forwarded to OpenAI. The provider can return only one approved move ID; extra prose, markup, unknown choices, refusals and incomplete responses fail closed. The immutable authored text and deterministic figure are rehydrated by the browser.

A D1 schema migration creates a **single shared budget row** with slot, UTC day and used count. There is no identity, transcript or request-history table. An atomic transactional update admits at most 30 calls per UTC day across Worker instances and concurrent requests. Both failed and successful admitted calls consume budget; malformed requests are rejected before admission. Moving the clock backward cannot reopen an older day's budget. The next UTC day replaces the existing row rather than accumulating history. A quota service failure blocks provider access. This is a shared owner-pilot cap, not per-student quotas for a general release.

Each call has an 18-second deadline, a 512-output-token provider cap and bounded response validation. No retries or lower-cost model are chosen without configuration. Authored teaching remains available without an AI connection or after a failure. Provider costs also include input tokens; the request cap is not a precise currency spending cap. Configure the provider account's budget separately before enabling AI.

## Build and publication

```powershell
python scripts/build_tutor_pilot.py <fresh-output-directory> https://haha-protected-tutor-pilot.low556902.chatgpt.site
```

The output has `dist/server/index.js` and immutable `drizzle` SQL/journal. In the dedicated Site source checkout, keep `.openai/hosting.json` with the exact pilot project ID, `d1: "DB"`, and `r2: null`, with no `static` field. Copy the generated `dist` and `drizzle` directories there, then use the Sites source helper to commit/push/package and publish privately. The platform applies the schema migration before uploading the Worker. Subsequent schema changes must append a migration rather than edit an applied migration.

Required runtime names: `OPENAI_API_KEY`, `OPENAI_TUTOR_MODEL`. The key must be provisioned through the OpenAI Developers secure setup flow, never copied into chat, committed, embedded in the Worker or written into an archive. Use an owner-approved model supporting Responses strict structured outputs; no default model or paid access is assumed. Missing configuration disables the browser AI checkbox. Sign-in alone does not prove provider availability.

## Verification

`tests/test_tutor_worker.mjs` covers identity, host/origin restrictions, request bounds, quota denial/outage, missing setup, provider-output rejection and private static routes. `tests/test_tutor_pilot.py` runs the actual quota SQL through concurrent SQLite connections, confirms persistence/rollover/no identity columns, and validates the complete generated module and asset routes. CI also exercises the existing source-reader/teaching browser suites and the new sign-in and device-check controls. No real API calls occur in these tests.

## Real-device voice check

The tutor includes a page-memory-only checklist with capability status and a short procedure: hear tutor audio, speak a known topic, then interrupt and resume. It makes no microphone permission request by itself. Results are explicitly user-reported; checking boxes is not independent acoustic or recognition verification. Clearing/ending/reloading removes them. Do not collect recordings or transcripts to prove completion.

A real person with working audio input/output must perform this check. Automated speech/recognition fixtures verify callback handling and cancellation, not microphone hardware, browser-provider access, acoustic echo or experienced latency. Keep those checks marked unverified until observed with that person. Headphones reduce echo but do not establish echo cancellation.

## Status semantics

Publishing this private Worker proves backend hosting and access protection only. A missing key/model leaves AI off, even when the page and authored teaching work. A fully live AI milestone additionally requires a successfully configured provider call in the protected deployment; real-device voice remains a separate observed check. Production release to students additionally needs per-user quotas and an appropriate access policy, neither of which this owner pilot claims to provide.
