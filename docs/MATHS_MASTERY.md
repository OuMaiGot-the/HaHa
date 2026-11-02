# Maths mastery and personalised revision

Approved in chat on 3 November 2026 after the proposed next milestone: Maths mastery
plus personalised revision. This changes the Maths evidence model, not Physics scoring,
completion eligibility, access gates, Mana transaction rules or curriculum content.

## Scope

The dashboard covers the available Form 4 Functions chapter: Functions, Composite
functions and Inverse functions. It uses the existing 24 practice questions, five
multipart capstones, nine evaluation questions and optional concept checks. No new
learner question, numerical exercise, production dependency or account is introduced.
The imported teaching remains draft material; this does not confer academic approval.

## Evidence and storage

`core/mastery.js` provides pure catalog, scoring, recommendation and focused-selection
functions. IDs are stable per practice question part, per expanded/legacy checkpoint,
and per version-2 evaluation question. The nine evaluation topics are explicitly
mapped in authored order, never inferred from student answers or text similarity.

`core/mastery-storage.js` stores version 1 at `haha:math:v1:amMasteryV1` through the
existing Maths adapter. Events contain an ID, activity ID, correct/incorrect/skip,
assisted flag, visit ID, timestamp and whether the solution was revealed. Answer text,
identity, timing telemetry and transcripts are not added to mastery records. The old
draft/saved-answer storage remains unchanged. Existing completion, first-try aggregates,
practice totals, saved questions, Physics progress and Mana are retained. Aggregates
cannot reconstruct question-level independence, so old activity earns no invented
mastery credit. The dashboard shows those earlier completion labels separately.

The first graded attempt is immutable. A skip is not graded evidence. Submission IDs
are idempotent; unknown activities, malformed rows and duplicate IDs do not inflate
scores. Raw malformed or unsupported mastery documents are preserved without overwrite;
new evidence continues in memory with a visible warning. Blocked/quota-limited storage
does not prevent practice. Storage remains device-local until browser clearing/eviction.
Web Locks serialise supported same-origin tabs; other browsers use an in-tab queue and
cannot guarantee simultaneous cross-tab writes. There is no cloud backup or identity.

## Scoring v1

Each current catalog question part counts once, with equal weight; marks and speed are
not difficulty ratings. A first unassisted success earns 1, later independent recovery
0.7, assisted-only success 0.35, otherwise 0. A latest graded mistake makes the item's
current credit zero until recovery. Skips do not erase prior graded evidence. Retrying
the same answer cannot manufacture coverage or turn an earlier failure into first-try
success. The denominator is all currently available question parts in that skill.

Named levels match the Physics vocabulary: Starting below 30%, Developing at 30–69%,
Proficient at 70–89%, and Mastered at least 90% with every item graded. No evidence is
labelled Not assessed yet. Coverage and independent/assisted counts accompany the
secondary percentage. This is an explainable heuristic, not a psychometric assessment,
grade, retention guarantee or cohort ranking. The latest-mistake adjustment is specific
to this new Maths model; existing Physics scoring is unchanged.

Hints reuse the existing authored topic summaries and reveal no new answer key. Hint
use persists per question through refresh and applies to all parts of that question.
Worked-solution exposure, including skipped parts on a results screen, makes a later
check of the same item in that visit assisted. Fresh visits may provide independent
recovery, but never overwrite the first attempt. Merely rendering a score, opening a
graph, viewing a recommendation or clicking navigation creates no graded event.

## Revision and learner flows

Recommendations prioritise latest mistakes, assisted checks, unassessed items,
independent recovery and maintenance, then weakest skill and stable catalog order.
They explain the reason and offer notes or a five-question focused set. Focused sets
select only existing single-part questions from the chosen skill: recent mistakes,
unseen items, assisted items and other checked items, with stable order for ties.
Repeated regeneration with unchanged evidence is deterministic.

An unfinished practice set is resumed instead of overwritten by a revision action.
Notes remain freely available. Session recovery retains focused topic and per-question
hints. Saved practice and ordinary practice share mastery activity IDs. Evaluation
submission and optional checks feed the same model, without adding a pass gate or
changing Mana amounts/deduplication. Scores and recommendations appear on Progress;
the next revision also appears on Home. Native controls, text levels, meters, visible
focus, dark mode, larger reading size and responsive cards support accessibility.
Maths remains English-language as before; Physics language support is unchanged.

## Verification

`test_math_mastery.js` covers first evidence, recovery, assistance, repeat resistance,
latest mistakes, coverage, malformed events, data minimisation, catalog/topic mapping
and deterministic selection. `test_math_mastery_storage.js` covers locks, duplicate
events, solution exposure, corruption, quota/blocked storage and legacy isolation.
Session tests include the new persisted fields.

The ninth browser suite, `smoke_math_mastery_browser.cjs`, exercises actual UI checks:
legacy completion, focused questions, wrong/hinted/independent/skipped answers, real
evaluation submissions, saved retries, refresh, unfinished work protection, progress
and Mana isolation, dark/large text, phone/desktop and malformed/blocked storage.
Existing browser suites, content validation and the full Python suite remain active.
Repository CI and Sites publication are separate; publish the canonical build to the
existing Sites project only after passing checks.
