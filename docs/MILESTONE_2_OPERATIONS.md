# Milestone 2 — operations and acceptance

## Current release architecture

The repository builds `preview/` from `content/chapter-*/section-*/package.json` using `python scripts/build_catalog_release.py preview`. The publishing workflow runs the existing exercise smoke test and the full-catalog browser test before force-updating `gh-pages`. The public Vercel project is `haha-learning-preview` (`prj_1cJudJvQX7wVzAfq3o7hfsqcbG6c`).

## Automatic Vercel deployment — required one-time setup

1. Create a Vercel access token owned by an authorized project maintainer.
2. Add it to this repository's Actions secrets as `VERCEL_TOKEN`. Do **not** commit it to source.
3. Push a harmless change to `main` and inspect the **Publish HaHa preview branch** workflow. The final deployment step should run, rather than be skipped.
4. Confirm the Vercel production deployment is READY and test `https://haha-learning-preview.vercel.app/` from an unauthenticated browser.
5. Check that a new lesson or content change actually appears in production.

The workflow intentionally skips the Vercel step when the token is absent. A green workflow with a skipped deployment step is **not** evidence of automatic Vercel publishing.

## Test commands

```sh
python scripts/build_catalog_release.py preview
npm install --no-save playwright@1.56.1
npx playwright install chromium
python -m http.server 8765 --directory preview &
node scripts/smoke_preview_browser.cjs
node scripts/smoke_catalog_browser.cjs
```

The catalog smoke test covers all published packages on desktop and mobile, locale switching, network failures, and JavaScript exceptions. The existing lesson smoke test covers hints, retry, answer evaluation, activity navigation, and deep links.

## Content generation and review

The existing generator supports a Gemini API backend (environment variable `GOOGLE_API_KEY` or `GEMINI_API_KEY`) and Google Drive PDF sources. `scripts/gemini_api_smoke.py` requires configured authorized Google Drive access and a real PDF. Do not reuse inherited account credentials or change original-owner publication destinations. Use project-owned authorization and test with a controlled source PDF.

**Important:** the current catalog builder accepts `draft`, `review`, `approved`, and `published` packages. Thus the current site is a learning preview, **not** an approval-gated production curriculum. A review gate must be introduced and existing draft lessons reviewed before claiming automatic approved-content publication.

## Release recovery

- If the browser test fails, inspect the failing Actions job logs; `gh-pages` publishing will not run.
- If Vercel deployment fails, inspect the deployment step logs. The previously ready deployment should remain the production alias; verify before declaring recovery.
- For manual recovery, redeploy a known-good deployment from Vercel's deployment history, then verify the catalog and an exercise in an unauthenticated browser.
- Never print deployment tokens, Google credentials, or OAuth files in CI logs.

## Milestone 2 exit criteria

- All 15 lessons and assets verified publicly and on mobile.
- Test-gated GitHub-to-Vercel release proven by a real commit.
- An authorized PDF-to-Gemini run produces a valid reviewed package.
- An approved package appears in the production catalog automatically.
- Rollback verified, and the final evidence (commit, workflow, deployment, browser run) recorded.
