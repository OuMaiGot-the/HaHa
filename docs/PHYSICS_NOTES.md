# Physics lecture notes

The release also retains the existing live version 27 tactile button CSS/JS unchanged. Those published assets are now represented in the canonical build, including purple Physics and green Maths styling and existing red/green answer feedback. Physics note reveal buttons use the existing primary-action styling.

Physics → Learn → Notes opens original supplementary teaching material for all 15 existing sections (1.1, 8.1–8.5, 9.1–9.9). Eight teaching sections per lesson, a three-step worked example and two optional reasoning checks are available in English, Malay and Simplified Chinese. Each chapter group has nine qualitative review questions. The concise learner edition follows the longer discussion draft archived in `PHYSICS_TEACHING_DRAFT.md`; it is an adaptation, not a verbatim transcript.

## Source and editorial status

Curriculum mapping follows tlyoon/brilliant.org-style-learning-apps at `aad23b3d27cfabde94950221159a413e6c8cf9cf`, using section source manifests and learning-design objectives. No controlled source PDF was accessed. Most manifests do not identify a full textbook edition or printed page range. Section 1.1 identifies a Cengage 2019 excerpt, pages 3–6. Section 8.1's descriptive teaching title is editorial; the manifest says Section 8.1. No textbook passages, figures or questions are reproduced.

Technical cross-checks use BIPM SI definitions, OpenStax University Physics volume 1, NASA ideal rocket/thrust references, and Chabay, Sherwood and Titus (2019), DOI 10.1119/1.5109519, for actual work versus center-of-mass force integrals. Links and the pinned section manifest are visible in every lesson. This is labelled original draft teaching material, not instructor-approved content. The pre-existing lesson packages are unchanged.

## Visual implementation

All 32 planned insertion identifiers M1–M3, E1–E10 and P1–P19 map to repository-owned deterministic representations in `app/physics-notes/`. Content supplies declarative model kinds and section associations; trusted renderer/model code owns SVG and calculations. Several original simulation plans are deliberately simplified into bounded instantaneous state explorations or static schematics. There is no continuous animation or numerical-answer task. In particular, suspension is an equilibrium schematic, the rocket represents all exhaust as an aggregate, and capture/swing is a two-stage explanation. These are labelled honestly beside the visual.

Controls expose physical comparisons, reset to the same state, ask learners to predict before revealing, and provide full HTML values plus text assumptions. SVG diagrams have descriptions, labels and arrows; axes state plotted quantities. All values are explicitly normalized, not physical measurements. Native buttons, sliders, selects and disclosure answers support keyboard/touch use. No color-only meaning, generated imagery or new dependencies are used. Reduced-motion users receive the same instantaneous experience.

Models explicitly separate energy and momentum isolation, actual work and center-of-mass force integrals, relative and laboratory exhaust velocities, and total versus mechanical energy. Rough-patch motion stops once kinetic energy is exhausted; plots beyond that point are labelled inaccessible. Equal-mass perpendicular scattering is restricted to a stationary target, ideal elasticity and both outgoing objects moving. Fragmented projectile models retain all fragments and gravitational acceleration.

## Evidence and persistence

Reading, reveal answers and explorations are supplementary, ephemeral actions. They write no attempts, grades, completion, Mana or other browser storage. Refresh resets exploration state. Existing authored activities remain the assessed learning path; no mastery/progression rules change. No account, tutor, tracking or cloud persistence is added.

## Validation

`node tests/test_physics_notes.js` verifies complete locale fields, catalog/source identity, section/check/visual coverage, finite model states, and independent conservation/limiting-case equations across the control ranges. `scripts/smoke_physics_notes_browser.cjs` covers all lessons and locales on phone and desktop, keyboard disclosure and focus, resets, DOM rendering, storage non-mutation, deep links, page errors and overflow. Both are required in CI alongside existing suites. Repository validation and Python tests remain required. Automated checks do not establish instructor approval or independently certify translation quality.
