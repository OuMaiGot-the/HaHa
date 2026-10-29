# Milestone 4 — device-local mastery

M4.1–M4.5 implement formative evidence, scoring, routing, learner reporting,
and regression gates. These are local learning signals, not validated assessment
or grades. There is no account synchronization, cohort comparison, or backend.

## M4.1: attempts and compatibility

`app/learning.js` reads the existing `haha:progress:v1:<packageId>` key. Version 2
adds an append-only `attempts` array while retaining `completed` and `independent`
arrays for older readers. Each submission stores a unique event ID, activity ID,
correct/incorrect/skip result, hint/assisted flags, timestamp, duration, and locale.
No answer text, identity, or transcript is stored. Submission IDs are idempotent.
Unknown activity IDs and malformed/duplicate attempts cannot inflate evidence.
Legacy completion is shown but never reconstructed as first-attempt success.
A malformed record starts empty; denied/quota-limited storage cannot stop practice.
The first graded attempt remains immutable across retries and revisits. Skips are
not graded attempts. A retry in the same visit is assisted; a fresh visit may
supply independent recovery evidence. Restarting practice preserves history.

## M4.2: deterministic algorithm v1

Pure scoring uses current package activities as its denominator. Easy, moderate,
and challenging weights are 1, 2, and 3. Per activity: first unassisted success
receives 1; later independent recovery .7; assisted success .35; otherwise 0.
The rounded weighted percentage is secondary to Starting (<30), Developing
(30–69), Proficient (70–89), and Mastered (>=90 with every activity attempted).
No time, language, animation, or click speed bonus exists. Unsupported difficulty
falls back to weight 1. Legacy evidence earns no score until fresh submissions.
This transparent heuristic is not psychometrically calibrated. Activity IDs must
change when the assessed concept/answer meaning changes; same-ID content revisions
currently retain history. Scores are recomputed against current metadata.

## M4.3: adaptive recommendations

Prioritize assisted success or unresolved incorrect responses; then unfinished
activities in started topics; then new topics; then independent recovery review.
Within priority, use weakest topic and weakest exact objective score, then stable
catalog/activity order. Objective identity uses the package's exact objective text;
there is no inferred semantic equivalence or invented prerequisite relationship.
Links deep-link to the target activity. Fully demonstrated content yields an
explicit all-reviewed state. Recommendations never lock lessons.

## M4.4: learner dashboard

Catalog cards show named topic mastery, secondary percentage, completion,
independent success, and first independent success counts. Expand objective details
for finer evidence. Controls and mastery labels support English, Malay, Chinese;
source chapter/objective text remains authored package text with English fallback.
Semantic headings, native buttons/select/details, visible focus, responsive layout,
and text labels avoid color-only communication. Export downloads only this
catalog's local history; clear removes only this catalog's progress keys.
Device storage persists until cleared or browser eviction. Shared-device users
share this evidence; there is no identity or cross-device guarantee.

## M4.5: verification and release

Run `node tests/test_learning.js`, all existing JavaScript tests,
`python scripts/validate_content.py`, and `python -m unittest discover -s tests -v`.
Build with `python scripts/build_catalog_release.py preview` into an empty folder.
Serve preview on port 8765 and run the three `scripts/smoke_*_browser.cjs` scripts.
Browser gates cover real submissions, retries/revisits, reload persistence, malformed
and blocked storage, export/reset, all lessons, three languages, desktop and mobile.
Repository validation runs unit checks; browser and preview workflows also run for
pull requests. Publishing and Pages retain their existing external configuration.
A green build or published gh-pages branch does not prove production deployment:
Pages enablement, environment protection, hosting credentials, domains, and public
HTTP verification remain separate. No production dependency was introduced.
