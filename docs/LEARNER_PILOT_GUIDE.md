# HaHa learner pilot guide

Status: prepared; no learner sessions have been run or recruitment performed.
Owner: project owner/facilitator. Planned group: 3–5 volunteer undergraduate physics
learners. Session: approximately 20–25 minutes each. This is a usability and
learning-clarity pilot, not a graded assessment or evidence of learning efficacy.

App: https://haha-physics-learning-m4.hazygiant2048.chatgpt.site/
Baseline: GitHub `68eb765a7124a1ec1576be8eea4e36d11970784f`.
Related: [observation template](PILOT_OBSERVATION_TEMPLATE.md),
[learning design](LEARNING_DESIGN.md), [privacy](SECURITY_AND_PRIVACY.md).

## 1. Prepare

- Use the published app. Note the tested release and whether it changes during the
  pilot. Re-run affected tasks after a release; do not combine different releases
  into one result without identifying the difference.
- Include at least one actual phone and one desktop/laptop. Cover the preferred
  interface languages represented in the group; record any untested language as
  not assessed. Include keyboard-only navigation and, where feasible, a volunteer
  who already uses a screen reader. Do not claim screen-reader validation from
  keyboard testing alone.
- Use a fresh private browser window or a separate disposable browser profile per
  session. Never clear an existing learner's personal browser progress. Explain
  that closing the private window removes this pilot's local progress.
- Use the original conceptual lesson “Standards of Length, Mass, and Time”. The
  facilitator should review its questions and answer logic before the session.
  Check the current title in Learn; stop if it is missing or has changed meaning.
- Use voluntary participation and the institution's existing consent/approval
  process where applicable. Participants may skip a task or stop at any time.
  Do not invent a new retention policy or consent instrument in this repository.
- Keep any consent records, participant observations and browser exports outside
  GitHub in the institution's approved location. Repository templates must remain
  blank. Do not record names, matric numbers, schools, contact details, screenshots
  containing identities, raw audio, transcripts or individual learning records here.

## 2. Opening script

> We are testing the app, not you. This session does not affect your course grade.
> Please say what you expect to happen and what feels confusing. You can skip a
> task or stop whenever you want. I will first let you try without instructions.
> Your practice progress is saved only in this browser; it does not sync between
> devices. We are using a fresh browser session today. I will take brief notes
> about the interface, without recording your identity or copying your answers
> into the project repository.

If a participant does not wish to think aloud, observe silently. Do not pressure
or record them. Read each task once; let them try before offering help. A hint
from the app is permitted. A facilitator navigation instruction counts as help.

## 3. Task script

Record one outcome per task: independent, completed with facilitator help,
unable, or not attempted. App hints are recorded separately from facilitator
help. Mark task time approximately for usability only; do not compare learner
ability by speed. After about two minutes without progress, offer help or move on.

| ID | Read to learner | Observe without coaching | Evidence of completion |
| --- | --- | --- | --- |
| T1 | Find the lesson about measurement standards. Open its concept overview, then enter the lesson. | Meaning of the four home choices, search/chapter filters and overview action | Correct lesson and overview reached without facilitator navigation help |
| T2 | Choose an answer. For this feedback check, please use the intentionally incorrect option I identify, check it, then use a hint and try again. | Whether red feedback, retry text and the selected response are understood; whether the hint can be found | Incorrect state visibly red; learner can retry; correct state visibly green; supported success remains distinguishable |
| T3 | Return to the study space. Build an easy practice set for this lesson and work through it. You may skip an activity. | Back link, lesson/difficulty controls, five-activity boundary and end-of-set review | At most five valid easy activities; review appears; a skipped item does not become completed; prior lesson evidence survives |
| T4 | Find something the app suggests reviewing. Tell me why you think it is there, then reopen it. | Recommendation meaning, Review route and independence/support distinction | Learner reaches the relevant activity and describes the recommendation without interpreting completion as mastery |
| T5 | Save this lesson. Find it again using Saved lessons. Change reading size or appearance, then refresh. | Save/unsave meaning, filtering and settings discoverability | Saved lesson and chosen setting persist within this browser; controls and content remain readable |
| T6 | Open Progress and explain what the recent activity and mastery information tell you. | Chart labels, repeated attempts, milestones and certainty of the named levels | Learner recognizes that retries count as attempts and that the display is personal formative evidence, not a grade or cohort ranking |

For T2 use the facilitator's checked answer key; do not guess which option is
wrong. Record that this was an intentional test error. Exclude that error and any
coached answer from interpretation of conceptual understanding.

## 4. Short learning-clarity interview

Before T1, ask: “What makes a measurement reference useful to different
laboratories?” After the lesson, ask: “A reference changes when a different person
uses it. How would that affect agreement between laboratories?” These are original,
qualitative prompts; no arithmetic or numerical answers are needed.

Listen for stability, reproducibility and a shared reference. Note only whether
the explanation became clearer, stayed unclear, or exposed a misconception in the
approved private observation record. Do not calculate a mastery score from this
interview or count the scripted wrong answer as a misconception. With 3–5 learners,
these observations are descriptive and cannot establish effectiveness.

Ask at the end:

1. Which screen or word was hardest to understand?
2. What would you choose to do next, and why?
3. Was anything hard to read or operate on this device?
4. What do you expect to happen to your progress on another device?

An optional short revisit after 2–3 days can explore whether the concept is still
clear. Explain that fresh/private sessions do not retain the earlier app history.
Treat missing follow-up as not assessed, and do not claim delayed retention from
an immediate post-session explanation.

## 5. Acceptance criteria and decision

These are pilot usability criteria, not new mastery thresholds or classroom
release approval. Report raw counts and denominators, not percentages alone.

| Gate | Pass condition | If not met |
| --- | --- | --- |
| G1: technical integrity | No unresolved blocker, data-loss defect, wrong scientific answer, or incorrect result colour on any tested device/theme. Skips, hints and retries preserve their documented evidence meanings. | Pause expansion; reproduce with synthetic data and fix before repeating affected tasks |
| G2: core navigation | For each of T1, T3 and T5, require at least three attempted sessions and at least `ceil(0.8 × attempted sessions)` complete independently: 3/3, 4/4, or 4/5 when all volunteers attempt it. Report skipped/unattempted sessions separately. | Improve the specific route/copy and repeat it; do not hide a failing task inside an overall average |
| G3: feedback and mastery clarity | Every participant who attempts T2/T4/T6 can distinguish incorrect/correct feedback, supported/independent evidence and completion/mastery after one neutral clarification at most. Record both first interpretation and clarified interpretation. | Revise labels or feedback; preserve first-attempt observations |
| G4: accessibility | Core tasks work on tested phone/desktop and with keyboard alone, with visible focus, readable large text, no horizontal page overflow, and feedback text that communicates the result without colour. Screen-reader findings are recorded separately. | Treat a keyboard trap or unusable control as a blocker; record untested assistive technology as an outstanding validation gap |
| G5: educational clarity | No unresolved content defect; every misconception observed is triaged for content, interface or prior-knowledge cause. A physics reviewer resolves uncertain scientific claims. | Correct or temporarily exclude the affected material before further learner exposure |
| G6: data understanding | Participants can explain the device-local limitation after the closing explanation. No individual learner record or consent material is put in the repository. | Improve the explanation; handle any data incident through the existing privacy process |

Use three decision labels:

- **Ready for the next bounded development step:** all applicable gates pass and
  no blocker/high-impact issue remains. List all untested devices/languages and
  assistive technologies explicitly. This is not institutional classroom approval.
- **Revise and repeat:** any gate fails or a high-impact issue remains. Assign the
  issue an owner and repeat the affected tasks after a fix.
- **Insufficient evidence:** too few task attempts or missing observation detail.
  Do not mark the pilot passed from automated tests alone.

## 6. Triage and close

Prioritize blockers first, then repeated confusion, then isolated polish. Public
GitHub issues may contain only synthetic reproduction steps, release/device/browser
categories, expected/actual app behavior and aggregated counts. Never paste
participant sheets or identifiable quotes. Keep the approved private notes in the
institution's existing process; this pack does not change retention rules.

Before accounts, cross-device storage, social features or a live tutor are built,
use the pilot findings to choose the next bounded slice. Those capabilities need
their own data model, access checks and acceptance tests.
