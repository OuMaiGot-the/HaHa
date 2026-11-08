# Latest evidence

See [the classroom audit](TUTOR_CLASSROOM_AUDIT.md) for this run's changes,
435-test Python result, JavaScript/browser checks, preview build and explicit
unfinished features. The records below describe earlier increments.

# Unified tutor follow-up — 8 November 2026



## Starting state



The active HaHa checkout already contained uncommitted source-reading lab work,

including its tests, CI entries and documentation. Those changes were preserved

and extended; the clean-checkout statement in the historical report below refers

to the earlier increment, not this task's starting state. Synced sources were not

changed. No production dependency, hosted model, credentials or deployment added.



## Follow-up changes



- Fixed bottom voice/text composer, persistent microphone status/mute, independent

  default-on tutor audio, End session and bounded in-memory conversation display.

- New `app/tutor/microphone.mjs`: explicit browser-recognition authorization,

  permission-and-preference-gated automatic restart, permission revocation,

  session/visibility shutdown, stale callback fencing and browser-error fallback.

- Both inputs share the existing notes, topic and cancellation/playback loop.

  Recognized interim speech interrupts; final speech or submitted text starts a

  new reading turn. Typing alone preserves playback. Simple continuation commands

  reuse the topic; arbitrary conversational reasoning/resumption is not connected.

- Existing browser checks extended with deterministic microphone callbacks and

  permission state. These tests never capture real microphone audio.



## Follow-up verification



- Content validation: passed, 16 package files.
- Required Python suite: 434 tests in 36.343 seconds, OK (skipped=1).
  The skipped test is the opt-in live Gemini smoke test; suite messages describing
  live operations are mocked operational tests, not live service evidence.
- Tutor core tests: passed (retrieval, validation, cancellation and playback).
- Updated Chromium browser suite: passed, including automatic start with saved
  enable plus granted permission, saved mute, denied/revoked permission, stale
  recognition, unsupported recognition with working text fallback, voice/text
  interruptions and the fixed composer at 390 x 844.
- Lint, documentation-impact check, module syntax and whitespace checks: passed.
- Inspected the synthetic mobile screenshot. Actual software keyboard behavior,
  screen readers and other browsers/devices remain unverified.
- Python ran on local 3.14, not the repository-declared 3.12. Hosted CI has not run.
- Existing unrelated JavaScript suites were not rerun in this follow-up.

Full working-tree diff is delivered separately and includes the preserved earlier
lab increment as well as this follow-up. No commit or deployment was made.

 The older report

is historical evidence only. Real device speech, audible timing, echo rejection,

live AI teaching, PDF ingestion, full conversational context and deployment remain

unverified or unimplemented, as detailed in REALTIME_TUTOR.md.



---



# Tutor increment validation â€” 8 November 2026



## Inspection and scope



Inspected the clean `HaHa` checkout at `64c7caf` and the referenced Studley Overview

discussion. The parent directory contains many historical previews; `HaHa/.git`

identifies this active source repository. No synced `sources/` files were changed.

The application is a dependency-free static learner. The existing Python/Gemini

generator is a separate offline generation pipeline, not a runtime speech tutor.

There was no runtime tutor endpoint, speech/drawing stream or upload-to-lesson UI.



The resulting increment is a standalone local **source-reading lab**, not a

completed real-time AI tutor. It adds no production dependency or hosted service.

It does not read credentials, access real learner data, update learning evidence,

or deploy anything. All new tests use original synthetic teaching notes.



## Actual checks



- `python scripts/validate_content.py`: passed, 16 package files.

- `python -m unittest discover -s tests -v`: 434 tests ran in 65.217 seconds;

  result `OK (skipped=1)`. The opt-in live Gemini smoke test was skipped.

- All 19 existing `tests/*.js` suites: passed.

- `node tests/test_tutor.mjs`: passed grounding/refusal, input bounds, protocol

  rejection, cancellation, pause/resume, stale callbacks and fragmented UTF-8 JSONL.

- `node tests/test_tutor_browser.cjs`: passed in headless Chromium with synthetic

  browser speech. Covers upload, unsupported topics, silent progressive rendering,

  word callbacks, phrase-only callbacks, speech errors, pause/resume, stop/late

  callbacks, clearing, literal markup, no local storage, mobile width/readability.

- `python scripts/lint.py`, `python scripts/check_documentation_impact.py`,

  `node --check app/tutor/tutor.mjs` and `git diff --check`: passed.

- Inspected the synthetic mobile screenshot. Added a keyboard-focusable horizontal

  board viewport to keep lettering legible on a narrow screen; full source text

  also remains below the board.



Local environment: Windows, Node v24.21.0, Python 3.14.7. The project declares

Python 3.12; that interpreter is not installed here, so a supported-version Python

run remains unverified. CI is configured for 3.12. The new core and browser checks

have been added to CI, but hosted CI has not run for these uncommitted changes.



The unit-suite console includes mocked generator/coordinator operational messages;

these are not evidence of live Gemini generation, authorization or deployment.

Browser metrics are local UI timings; simulated speech start times are not real

audio latency or measured audio-to-drawing accuracy.



## Reviewable diff



- `app/tutor/core.mjs`: bounded in-memory ingestion, line-based source references,

  lexical retrieval, async source-reading stream, strict protocol validator,

  fragmented JSONL decoder and cancellation-fenced playback cursor.

- `app/tutor/index.html`, `tutor.css`, `tutor.mjs`: standalone accessible lab route,

  original sample notes, upload controls, safe progressive SVG, browser-speech

  coordination, silent fallback, pause/resume/stop/clear and local timing display.

- `tests/test_tutor.mjs`, `tests/test_tutor_browser.cjs`: new synthetic checks.

- `.github/workflows/validate.yml`, `browser-smoke.yml`: run the new checks.

- `README.md`, `docs/CONTEXT_INDEX.md`, `docs/REALTIME_TUTOR.md` and this report:

  entry point, architecture, boundaries, actual evidence and remaining work.



## Unverified or blocked



No live model adapter or authorized runtime credentials/configuration were

established. PDF extraction/OCR and page citations are not implemented. Retrieval

does not establish curriculum approval or semantic correctness. Generated teaching

requires a server authorization/material-isolation/safety layer and a separate

validated output contract before relaxing source-only reading. Robust streamed

audio alignment, semantic equation/graph templates and conversational interruption

resumption remain future work. Browser-native speech still needs human listening

and device testing; simulated callbacks cannot verify audible synchronization.



See `REALTIME_TUTOR.md` for the runnable entry point and exact protocol contract.

