# Kinetic-friction teaching preview

## What this increment does

Physics 8.3 now has ten original teaching moves plus a scope response. Each move names the corresponding sections of the existing original notes; the new wording is a pedagogical explanation, not a quotation from a textbook. Instructor review is still pending. The pilot is English only. The underlying notes and trusted visual models retain their existing English/Malay/Chinese content.

The sequence covers the initial stopping situation, relative sliding, normal force, combined-system boundary, mechanical versus total energy, stopping distance, angled pulling, center-of-mass versus application-point work, spring systems, and a synthesis question. Conceptual prompts request explanations, not calculations. No assessment, progression, mastery or Mana writes occur.

The friction-energy and angled-pull figures reuse `physics-notes/models.js` and `notes.js`. AI never supplies SVG, force arrows, formulas, slider limits or numerical results. Model assumptions remain visible. Model controls survive an interruption within page memory; clearing the lesson removes them. The text board continues through the unchanged exact-source `Protocol`. A resumed checkpoint restores its teaching-move ID and corresponding model.

## Authored navigation and optional AI

The public static preview has authored topic buttons and a deliberately limited keyword router. It is not a generative tutor. Unsupported requests get a bounded scope response; keyword matching is not a reliable language-understanding system. Use topic buttons when it selects the wrong topic.

An optional server-only OpenAI Responses adapter selects **one move ID** using a strict enum schema, `store: false`, no tools, and no conversation IDs. Both server and browser reject additional properties, unknown IDs and unexpected output. Refusals, incomplete responses, invalid output and network errors stop selection and visibly offer authored teaching. There is no silent AI fallback. Only the immutable authored text and matching trusted model are then displayed/read. This is AI-directed selection, not free-form AI teaching. It does not diagnose or grade the student's response.

The checkbox defaults off and is disabled if the same-origin status endpoint does not report availability. Enabling it authorizes sending the current question (max 500 characters), current move ID and content version. Uploaded files, prior questions, microphone audio, board marks, mastery and learner identifiers are never sent to this endpoint. No questions or provider responses are logged or saved by this implementation. `store: false` disables Responses application storage; it does not promise that the provider has no other retention. Browser recognition/voice services have their own disclosures, unchanged from the source reader.

## Local gateway and secure setup

Build into a fresh output directory:

```powershell
python scripts/build_catalog_release.py preview-tutor --include-tutor-lab
node scripts/serve_tutor.mjs preview-tutor
```

Open the printed `http://127.0.0.1:18770/tutor/`. With no configuration, authored teaching works and AI stays off. Configure `OPENAI_API_KEY` and `OPENAI_TUTOR_MODEL` through the local process's secure environment, using an account-approved model that supports Responses structured outputs. Do not paste credentials into chat, commit them, place them in browser code, or save them in the Site archive. No default paid model is assumed. `TUTOR_PORT` optionally changes the loopback port.

The built-in gateway binds only to 127.0.0.1, verifies Host and same-origin JSON POSTs, serves only the built directory (no dotfiles, unknown file types or paths escaping it), and allows one provider request at a time, at most 60 admitted requests per process/hour. Each provider call is capped at 512 output tokens and 18 seconds. Question decoding has a 2 KB request bound. It has no production authentication and must **not** be rebound to a public interface or exposed through a tunnel. Production requires an authenticated server deployment, per-user quotas and a provider budget configured by the owner; those are not provided by a static Site or this local gateway.

## Verification and honest release limits

- Unit tests check source coverage, exact-source board validation, conserved model energy, misconception routing, schema rejection, provider refusals/incomplete output, request shape, origin restrictions, path escape, oversized requests and quota exhaustion. Provider responses in tests are synthetic; no paid request occurs.
- Browser tests check both the preserved reader and the new teaching flow, scoped refusal, restored model on resume, mobile overflow, clearing, explicit opt-in and rejection of synthetic extra provider output.
- Existing synthetic voice tests cover permission handling, muted preference, denied/revoked permissions, stale results, word/phrase events, pause, cancellation and nested resume. They do not verify real microphone audio, actual voice latency, acoustic echo cancellation or a browser vendor's service reliability.
- Publishing the static preview does not configure or deploy the Node gateway. A missing production AI connection must remain visibly disabled. A fully live AI/voice milestone is not complete until the owner-configured provider and real-device speech flow are exercised.

API implementation reference: [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses).
