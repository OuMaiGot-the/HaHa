# Current tutor status — 8 November 2026

This section supersedes the historical increment descriptions below where they differ.
The implementation remains a bounded local source reader, not a completed AI teacher.

- Text and final voice results enter the same `ask` flow. Voice input preserves the
  unsent text draft. Submission or interim recognized speech cancels speech, drawing,
  and the current producer; stale speech errors/results cannot change a newer turn.
- Stop, interruption, audio changes, and page hiding preserve an in-memory checkpoint.
  `continue`, `go on`, `resume`, or **Resume interrupted lesson** restores the newest
  checkpoint, including its source references and existing board marks. It replays
  the current word to avoid losing a partially spoken word, then continues remaining
  sections. Up to three nested interruptions are retained; oldest checkpoints expire.
  `repeat`/`again` starts the last topic afresh. This is reading continuity, not
  conversational reasoning or model memory.
- Clear, material replacement, End session, and leaving/reloading clear checkpoints.
  No transcript, material, drawing, or checkpoint is persisted. Only the existing
  microphone mute preference is stored. Mastery and retention policies are unchanged.
- Previously authorized recognition starts automatically only with granted permission
  and saved unmuted preference. `no-speech` reconnects through the bounded existing
  restart delay; permission/service errors still stop and permit typing.
- The bottom composer remains available while reading. Collapsed privacy details,
  a sticky form, and dock-height measurement reduce overlap on small displays.
- `python scripts/build_catalog_release.py OUTPUT --include-tutor-lab` produces an
  explicitly labeled preview hub entry and self-contained `tutor/` route. Without
  this flag, normal release builds exclude the lab. No deployment is performed.

Evidence and comparison: [classroom audit](TUTOR_CLASSROOM_AUDIT.md).

# Real-time tutor foundation



## Current increment



Run `python scripts/serve.py` and open `http://127.0.0.1:8000/app/tutor/`.

The existing learner, content generator, mastery and release builders are unchanged.

This route is a standalone local lab and is not included in public release bundles.



The app accepts UTF-8 `.txt` original teaching notes (100 KB, 160 chunks maximum),

splits them into bounded sections with original line references, and retrieves up

to three sections by lexical overlap with the requested topic. At least half the

non-stopword query terms must match a section. This is retrieval, not semantic

verification, curriculum approval or prompt-injection classification. Only use

original, approved, non-sensitive teaching notes. Test fixtures are synthetic.

Unsupported topics return no source and no invented explanation.



No hosted model is called. The local adapter streams **source-reading segments**;

it does not generate teaching explanations, questions, equations or diagrams.

The board writes the words progressively and underlines each completed section.

Source content is never executed as code or inserted as HTML. No hosted AI call, transcript logging or mastery update is made by this code.

Only the microphone mute preference is stored in the browser. Notes and

playback state live only in the page's memory. Clear/reload removes them.



## Unified voice and text increment — 8 November 2026



The fixed bottom composer remains enabled during playback. The microphone status,

instant mute control, separate tutor-audio checkbox and End session control remain

in that same dock. Tutor audio defaults on; a browser may still block it. Changing

audio during playback stops that run and asks the student to submit again.



Enable microphone is explicit authorization to use the browser speech-recognition

service, which may send audio to its provider. We do not implement provider-side

retention or store raw audio. A returning page automatically starts recognition

only when microphone permission is already granted AND the saved mute preference

is false. A saved mute, unsupported API, insecure origin, permission-query failure

or browser gesture restriction preserves typing and requires explicit enabling.

Only `yoon.tutor.mic-muted` is persisted; no notes or conversation are persisted.

Storage denial is tolerated. Permission withdrawal, hiding/leaving the page,

Clear notes and End session stop recognition. End session also clears notes,

conversation and the board. Coming back from a hidden page requires re-enabling.



Voice and text submissions enter the same cancellation-fenced reading loop with

the same notes, topic, board and playback state. Interim recognized words interrupt

an active explanation; only final recognized text submits a new turn. Typing alone

does not interrupt. A submitted text turn interrupts immediately. Late recognition

and playback callbacks are rejected after cancellation. Browser recognition end

retries after 700 ms; errors stop and require explicit retry rather than a prompt

loop. Use headphones: acoustic echo rejection and noise discrimination are not

implemented or verified.



The conversation displays at most 40 turns in page memory, cleared on material

replacement, Clear or End session. `continue`, `again`, `repeat` and `go on` reuse

the previous topic, including across input methods. This is limited topic memory:

the local adapter does NOT reason over conversation history, resolve arbitrary

follow-up questions or resume an interrupted sentence. Each submitted turn rereads

matching notes and replaces the board. Lesson progress here means only the active

reader/playback state; assessed mastery is unchanged. The standalone lab is not

linked into public release bundles and is not a completed AI tutor.



API reference: [browser speech recognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).



## Protocol v1



`core.mjs` separates ingestion/retrieval, a stream adapter, validation and playback.

An adapter is an async iterable of JSON objects. `decodeJSONL` additionally decodes

fragmented UTF-8 byte streams for a future authenticated network adapter. Each

record must end with a newline and be at most 32,000 characters. It does not make

network requests or provide authentication itself.



Every event has `v: 1`, a unique per-run `session`, and a zero-based contiguous

`seq`. A segment contains `type: "segment"`, `source` (current material chunk ID),

`text` (must exactly equal that chunk in this reading-only protocol), and `actions`.

Supported actions are bounded `text` at SVG coordinates and `stroke` with bounded

polyline points. Each action has a nondecreasing `at` UTF-16 character offset into

the narration. No code, URLs, free-form SVG or arbitrary rendering templates are

accepted. The validator checks the entire event before rendering any actions.

A terminal `type: "done"` has `reason: "complete"` or `"no-source"`. Missing terminal

events, wrong sessions, repeated/out-of-order events and invalid actions fail closed.

There is a 12-event limit. Stream consumption waits for each segment to finish,

providing backpressure rather than buffering an unbounded lesson.



For speech, the utterance's actual `onstart` and `onboundary.charIndex` advance the

board. On voices without word boundaries the remainder appears at phrase end;

the UI discloses this weaker synchronization. No synthetic clock is presented as

audio timing. Speech start/completion has an active-time timeout. Without speech,

an explicitly labelled silent timeline advances the same actions. Pause freezes

the drawing cursor and requests speech pause; resume continues it. Stop invalidates

the playback generation, aborts the producer, cancels speech and rejects late

callbacks. Starting again retrieves anew and resets the board. New submissions cancel and restart with shared notes/topic state; they do not

resume an interrupted sentence or use AI reasoning.



First board-mark and browser speech-start times are measured locally from Start.

They are not hosted-model latency measurements. A text token appears as a unit;

this is not handwritten letter-stroke synthesis. Reduced-motion users receive

discrete updates without CSS motion; the full section is accessible as text.



## Remaining integration work



- Approved PDF extraction/OCR, page citations and instructor access controls.

- Server-only AI credentials, authorization, curriculum gating, budget/rate limits,

  material isolation and prompt-injection defenses before enabling a live model.

- A versioned model-output protocol with semantic grounding/claim validation.

  The strict source-equality check must not simply be removed for free-form AI.

- Streaming audio chunks and alignment against an audio playback clock for more

  reliable word timing, underrun handling and cross-browser pause behavior.

- Trusted equation/graph/vector templates and semantic diagram validation. The

  current generic polyline does not establish scientific correctness.

- Conversation state and interruption/resume design within approved privacy rules.

- Human speech/listening, screen-reader and device testing. Synthetic browser

  speech events validate control flow but cannot establish audible quality or sync.



## Checks



`node tests/test_tutor.mjs` checks retrieval/refusal, size bounds, strict protocol

validation, pause/cancel/stale generations and fragmented UTF-8 JSONL parsing.

`node tests/test_tutor_browser.cjs` exercises the real local page with Playwright,

using synthetic notes and deterministic speech callbacks; no microphone or live

voice service is used. Run the repository's content and Python regression gates

alongside these. Actual execution evidence is recorded in `TUTOR_VALIDATION.md`.

