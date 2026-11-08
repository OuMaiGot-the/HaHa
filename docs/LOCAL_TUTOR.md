# Local CPU tutor — no API credits

This optional Windows mode runs the existing 8.3 tutor with a small CPU model on the owner's computer. It uses no paid provider, cloud key, external inference endpoint or new production package. It does not read `.env.local`. The public Site and private hosted pilot keep their existing configuration and audiences; neither can automatically reach this local service.

## Start on this workstation

Double-click `run-local-tutor.cmd` in the HaHa checkout. It checks the downloaded portable files, builds a fresh learning app, starts the model, and prints the local tutor URL. Normally this is `http://127.0.0.1:18773/tutor/`.

Start kinetic friction, then enable **Let local AI check the authored topic**. It is off initially. Authored topic buttons and text reading work without the model check. Browser speech/microphone remain optional and separate; recognition or voice services may use their own providers, as disclosed in the app. The no-network inference guarantee applies to the local text model, not browser speech services.

Keep the launcher running while using the local tutor. Ctrl+C stops both processes and removes the temporary model-access credential. The generated static app remains in the operating system's temporary directory; it contains no questions, audio, keys or learner progress. Browser learning records are separate from the public site's records because origins differ. Do not copy real learner records into development.

## Exact portable files

The research downloads are outside Git under `../integration-artifacts/free-ai-proof/`. They are not installed globally and are not committed or included in a Site archive.

- Official llama.cpp CPU build **b12211**, Windows x64: [runtime archive](https://github.com/ggml-org/llama.cpp/releases/tag/b12211). Extract all accompanying DLLs together. The launcher verifies the `llama-server.exe` SHA-256 `75e1099fec4b0e2c0ddd90813653a6a70638b79c6f6d38bf3103c85d7312e89e`.
- Official [Qwen2.5-1.5B-Instruct-GGUF](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF), file `qwen2.5-1.5b-instruct-q4_k_m.gguf`, 1,117,320,736 bytes. Model SHA-256: `6a1a2eb6d15622bf3c96857206351ba97e1af16c30d7a74ee38970e434e9407e`.

The default paths use these already-downloaded files. On another workstation, download the pinned files from the official sources, then supply their paths if needed:

```powershell
node scripts/run_local_tutor.mjs --runtime "C:\local-model\llama-server.exe" --model-file "C:\local-model\qwen2.5-1.5b-instruct-q4_k_m.gguf"
```

Node.js 22+ and Python are required. No installer, account or purchase is launched. Other runtime/model versions are rejected rather than silently substituted. `--port` and `--model-port` may select unused ports from 1024–65535. The launcher reports an occupied port instead of killing another process. Six CPU threads, a 4096-token context and zero GPU layers are used; the tested laptop has an i5-1235U and 15.7 GiB RAM. Performance varies by machine.

## Grounding and truthful fallback

Research found mixed topic-classification accuracy in the small model, even though three short explanations grounded in original notes were correct. This increment therefore **does not display generated explanations** or change the exact-source board protocol.

1. The existing authored router proposes a topic. Explicit lesson controls and supported out-of-scope checks skip inference.
2. The local model receives only the current question and proposed authored card. It can confirm that card or return unsupported; it cannot select a different topic, supply markup, draw figures, grade answers or change mastery/Mana.
3. Matching, valid output displays **Local AI confirmed this authored topic**.
4. Disagreement, malformed output or model failure displays **Using authored teaching**, preserving the proposed authored card. This fallback is visible. It does not imply the model understood the question.

The router remains a limited English keyword system; a plausible card can still be an imperfect match. Topic buttons provide deterministic navigation. Scope guards are not a general language-understanding or academic-validation system. No model output is used to assess students. New wording must still go through the content-authoring/review path before becoming lesson text.

## Local protection and privacy

The website and model bind only to 127.0.0.1. The gateway checks Host, exact same-origin JSON POSTs, request size and schema. Model URLs are restricted to the loopback chat endpoint, and redirects are rejected. No cloud fallback exists in this mode. Calls are serialized and limited to 60 admitted gateway requests/hour; resource-limit responses ask the learner to disable the check and continue authored teaching.

The launcher gives the model a random session access credential through an owner-local temporary file, never a command-line secret or browser field. It verifies the owned model alias before opening the website. The raw model Web UI and logging are disabled. Neither model API credentials nor OpenAI keys are exposed to the browser. This is a local development service, not production authentication; do not expose either port through a tunnel or bind it publicly.

Questions and model replies are not written by this implementation. Inference uses temporary process memory, not a saved conversation; no secure-memory-erasure guarantee is claimed. Uploaded notes, voice audio and prior conversation are not sent to the model. Clear/end removes the page state; stopping the launcher ends model memory. The source reader can still read the owner's original uploads locally without sending them to inference.

## Verification and release limits

Unit tests cover candidate-only confirmation, rejected prose/extra output, scope/control guards, disagreement/outage/abort handling, loopback-only targets, same-origin enforcement and truthful delivery metadata. Synthetic browser tests exercise local disclosure, confirmed/fallback labels, unchanged authored content and clearing. Windows launch and actual CPU model requests are verified separately from CI's synthetic provider fixtures.

Real microphone acoustics, browser-service availability and student-wide deployment remain separate work. The hosted tutor does not acquire free inference simply because this local adapter is committed. No paid AI configuration, billing or hosting audience is changed by the local launcher.
