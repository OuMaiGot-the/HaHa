# Classroom audit and implementation evidence — 8 November 2026

## Verdict

The working checkout is `HaHa`, a static learner app plus a separate Python
content-generation pipeline. On entry, Git already contained uncommitted tutor
files, tests, workflow edits and documentation. These were preserved and extended;
this report does not claim their original functionality as new work.

The tutor is still a local source reader. This increment delivers interruption
recovery end to end, with in-memory board/source/word-position continuity, draft
preservation, recognition recovery, a smaller composer dock and an opt-in built
preview route. It does not deliver the full requested AI teaching engine.

## Reference and evidence boundaries

The public [Studdy site](https://studdyai.com/) was opened on this run. Its visible
page describes lessons built around uploaded material, stepwise equations and
scientific representations, clarification interruptions and material-based practice.
The hero demo visibly includes a force sketch. Those are public observations and
product claims, not verification of a signed-in tutoring session. No proprietary
model, transport, whiteboard library or synchronization architecture was accessed.
Default microphone behavior and a permanent composer are YOON requirements; their
exact Studdy equivalents were not independently established.

## Audited steps

1. **Enter the tutor — partial.** Standalone source-reader limitations are clearly
   disclosed. The source route was not included in normal release bundles. An
   explicit build flag now adds a labeled hub link and repairs the return link.
2. **Load material — functional for UTF-8 text only.** Original sample notes and
   bounded `.txt` upload feed line-referenced retrieval. PDF/OCR, slides, images,
   instructor material access and semantic retrieval are unfinished.
3. **Speak or type — functional control flow, live audio unverified.** One submission
   path shares materials and lesson state. Previously authorized, unmuted recognition
   auto-starts when browser permission is granted. Saved mute and permission withdrawal
   are honored. Voice results now preserve an unsent typed draft. Recognition silence
   reconnects; fatal errors leave typing available. Acoustic echo suppression remains
   unfinished and headphones are advisable.
4. **Hear and watch — partial.** Browser utterances read retrieved source segments;
   actual speech-boundary callbacks advance words and underlines. Phrase-end fallback
   is disclosed when word boundaries are absent. Silent playback uses a labeled time
   line. This is not token-streamed AI explanation or chunked synthesized audio.
   The board reproduces source text; it does not verify the truth of uploaded notes
   or draw validated equations, graphs or scientific diagrams.
5. **Interrupt, clarify, resume — improved and tested.** Text submission, interim
   speech, Stop, audio changes and hiding the page cancel output. Up to three
   interrupted lessons can be restored. Follow-up reading can finish before resuming
   the previous topic. Restored marks are not redrawn twice, and the current word is
   replayed rather than losing a partially spoken word. `repeat` restarts the last
   topic. Arbitrary follow-up reasoning and adaptive AI teaching remain unfinished.
6. **Keep composing and end — functional with limits.** The composer remains fixed
   at the bottom; privacy details collapse, the form stays sticky and document
   padding follows dock height. Mobile and short-viewport bounds are tested.
   Clear, material replacement, End session and reload clear lesson checkpoints.
   No cross-reload/cross-device continuity is implemented.

## Accessibility observations

The controls have labels, status text, keyboard focus styles and at least 44-pixel
button targets. Full source text accompanies the SVG board. Mobile board content
requires horizontal scrolling to preserve legibility, which remains a usability
cost. Screen-reader behavior, real microphone indicators, large font settings,
mobile keyboard occlusion and device/browser-specific voice behavior still need
human/device verification. Screenshots alone do not establish accessibility compliance.

## Current-run artifacts

Artifacts are outside the repository in `../tutor-audit/`:

- `01-reference.png`: public Studdy hero/demo capture; no account session.
- `02-before.png`: original YOON setup and fixed composer.
- `03-after.png`: built preview with source reading and restored lesson context.
- `04-mobile.png`: synthetic Chromium mobile state with composer and resume control.
- `python-tests.log`: complete Python regression output.
- `final.diff`: accumulated working-tree diff, including pre-existing tutor work.
- `build/`: self-contained catalog preview, including `tutor/`.

## Tests actually run

- `python scripts/validate_content.py`: PASS; 16 content package files checked.
- `python -m unittest discover -s tests -v`: PASS; 435 tests, one optional live
  Gemini test skipped. Includes the new opt-in build/navigation/asset test.
- All 24 JavaScript commands from `validate.yml`: PASS. The domain-renderer path
  was resolved using the repository Python resolver for Windows compatibility.
- `node tests/test_tutor.mjs`: PASS, including bounded checkpoint isolation,
  word-safe resume, completion and clear.
- `node tests/test_tutor_browser.cjs`: PASS in Chromium, using synthetic recognition
  and synthesis callbacks. Includes interruption/follow-up/resume, exact final board
  words without duplication, unsent draft preservation, late error callbacks,
  mute/revocation/autostart, no-speech recovery, a fixed mobile dock and a short
  viewport composer. No real speech or raw audio was captured.
- `python scripts/build_catalog_release.py ../tutor-audit/build --include-tutor-lab`:
  PASS; 15 packages across three chapters. The built tutor route was opened and
  sample playback/resume inspected in the in-app browser.
- `git diff --check`: PASS.

The full JavaScript runner initially misparsed a shell substitution on Windows;
resolving that one path correctly produced the all-pass result. This was a runner
issue, not an application failure. Python ran on the installed 3.14 interpreter;
CI's pinned 3.12 environment was not reproduced here.

## Remaining implementation

The checkout has no runtime AI-tutor endpoint/authenticated session transport. Its
Gemini generation pipeline is an offline authoring system, not a voice-teaching
backend. Production authentication/hosting are also outside the documented foundation
scope. This increment adds no dependency, credentials, learner records, hosted
model call or deployment. A completed tutor still needs a server-side model adapter,
authorized material isolation, bounded curriculum/grounding checks, validated visual
plans, streamed audio with timing, echo-aware barge-in, and end-to-end live-service
verification. Existing source-equality validation remains intact; it was not weakened
to accept unconstrained model output. Persistent lessons would require a separately
specified privacy-compliant storage design.
