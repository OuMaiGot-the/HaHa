# Integrated physics study hub

## Comparison and selection

Compared HaHa at `0bec18fb5528489d0ca340b380b9afd4432c198d` with
`jjyeo95/addmath-lab` at `4296ada59af904666da8489c4aae92b0993c2dcc`.
The AddMath README, progress notes, handover and HTML were read as references.
The user selected physics-only: HaHa upgraded with AddMath navigation, study tools
and design. The original AddMath repository and Site were not modified.

| Area | Strongest source | Integrated implementation |
| --- | --- | --- |
| Learner entry | AddMath | Four routes: Learn, Practice, Review, Study tools |
| Navigation | AddMath | Shared header, browser-back support, chapter/search filters, concept overviews and return links |
| Focused practice | AddMath flow + HaHa evidence | Up to five existing conceptual activities, selected by evidence and difficulty |
| Assessment | HaHa | Existing first-attempt/assisted distinction, difficulty-aware mastery and recommendations |
| Guided learning | Both | Package objectives/prerequisites before a lesson; reasoning explanations after checking |
| Progress | AddMath visual pattern + HaHa data | Seven-day checked-answer chart, recent evidence, derived milestones |
| Comfort | AddMath | Light/dark appearance, reading size and saved lessons |
| Language and accessibility | HaHa | English/Malay/Chinese interface, native controls, visible focus and mobile layouts |
| Delivery | HaHa | Validated packages, trusted visual renderers, unit/browser tests and CI |

The shell and study utilities are newly implemented in modular runtime files.
No owner-bound AddMath hosting identity, raw prototype profile records, private
credentials, simulated social messages or numeric question templates were imported.
No production dependency was introduced.

## Behavioral contract

- All 15 physics lessons and activity IDs remain stable; existing progress keys
  and mastery scoring are unchanged.
- `haha:study:v1` stores theme, reading size, locale and saved lesson IDs only.
  It does not create accounts, identities, personal profiles or remote tracking.
- Focused sets use a bounded `practice` query of current package activity IDs.
  The player renders that subset while recording against the full package. This
  preserves evidence for activities outside the set. Unknown/empty IDs safely
  fall back to the normal lesson. Completing a set does not imply a whole lesson
  is complete.
- Practice selection prioritizes assisted completions, unfinished attempted
  activities, new activities, recovery evidence and then demonstrated activities.
  Ties follow source order. Difficulty selection never fabricates questions.
- The end-of-set review shows saved evidence for the selected activities.
- Review includes legacy assisted completions and newer graded attempts that need
  more independent evidence. Reviewing does not change scores by itself.
- Weekly charts count existing graded attempts, including retries, by local day;
  skips are excluded. Milestones are derived from evidence, never editable ranks.
- Concept overviews expose existing authored objectives and prerequisites. Full
  textbook notes, live AI tutoring, matchmaking and a backend are not claimed.
- There are no competitive ranks, time pressure, progression locks or new mastery
  thresholds. Privacy/retention rules stay as documented for the device-local app.
- Existing export/clear controls act only on this catalog's evidence keys; study
  preferences and saved lesson choices remain separate.

## Verification

Run `node tests/test_study.js` and the existing JavaScript suites, content validation,
and the full Python test suite. Build the catalog and run all four browser suites.
`scripts/smoke_study_hub_browser.cjs` verifies home/navigation, empty search, saved
lessons across reload, concept overview, dark/large settings, all locales, focused
practice, preservation of outside-set evidence, review, charts/milestones, blocked
storage and desktop/mobile overflow. Existing catalog/mastery tests now open the
Learn route explicitly because Home is a dedicated study dashboard.
