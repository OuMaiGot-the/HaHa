# Reviewed upstream integration — 3 November 2026

The user approved selective integration after the repository comparison. HaHa remains
the product and source of learning/reward policy. No upstream branch is merged wholesale.

## Pinned sources

- AddMath Lab: `jjyeo95/addmath-lab`, `68db17f5a15807012325ec20a461c18b74668969`.
  Restricted marking, notes graphs, progress/UI helpers, existing Functions data and
  expanded authored notes/evaluation are imported. `app/mathematics/provenance.json`
  records normalized file digests. Original 24 practice questions and five multipart
  capstones retain their content digest and question IDs.
- Tlyoon main: `aad23b3d27cfabde94950221159a413e6c8cf9cf`. Only the validated visual
  generation protocol/prompt/helper and its synthetic tests are adopted, together
  with the deterministic multi-worker gate test. Visual batches require exact IDs,
  supported templates, no rewritten question/answer content and at most two attempts.
- The private/draft integration PR #222 is **not** merged. No PDFs, private source
  packets, private academic receipts, credentials or learner records are copied.
  Its technical CI and previously reported private 0/18 academic acceptance are
  distinct from HaHa's release checks.

## Canonical app and release

`app/` now contains the previously hosted character shell, its approved artwork,
Physics player, and modular Mathematics app. `scripts/build_catalog_release.py`
builds the complete same app, including shared assets, from this one source tree.
Individual standalone Physics bundles retain their own common runtime assets;
catalog bundles refer to the shared root assets. The hosted source is prepared from
that build rather than independently edited. Sites publication is still a separate
operation; GitHub CI does not itself publish the Sites URL.

Build into a new empty staging directory, verify it, then replace only the existing
Site checkout's `dist/` with that generated tree. Preserve `.openai/hosting.json`
and its project identity. Package/push through the Sites source helper and save and
deploy that exact source commit. Future edits belong in `app/`, not a second UI fork.

## Mathematics behavior

- The restricted parser accepts supported equivalent numeric/algebraic, finite-set,
  surd and inequality answers. It is not a general algebra system. It rejects unsafe
  syntax and conservatively preserves denominator restrictions. Unreadable input
  receives a focused, labelled error before attempts, progress or Mana are awarded.
- Three topic-at-a-time lessons retain the HaHa shell. Imported original teaching
  adds domain/codomain/range, restrictions, repeated functions, absolute-value and
  inverse reflection graphs, embedded optional checks and nine evaluation questions.
  Semantic table/format tags are explicitly allowed; arbitrary HTML stays escaped.
- These are draft authored materials with upstream curriculum mapping, not teacher
  certification. No new numerical learner questions are authored in this integration;
  the numerical Maths material is the user-approved existing upstream import.
- Chapter completion remains submission-based. **No 60% completion/challenge gate,
  timed navigation lock or competitive ranking policy is imported.** Earlier Maths
  completion remains intact. Old three-question draft data is archived locally before
  a nine-question draft is initialized; it is never preselected against different questions.
- Refresh restores the route, question set, current question, draft and submitted
  review. A fresh navigation/tab starts at Home, with unfinished work available to
  resume. History entries carry set identity; replaced sets cannot appear under old
  result URLs. One active practice snapshot is stored per browser; concurrent draft
  editing across tabs is not a synchronized collaboration feature.
- Saved questions retain full browser-local snapshots across regeneration, have form
  filtering and can be checked/retried. Their Mana activity IDs match ordinary practice,
  so bookmarking does not create another first-correct reward. A saved question is not
  a full set and does not receive the daily set bonus.

## Preserved contracts

Physics package content, deterministic mastery, recommendation priorities and existing
Mana transactions/eligibility remain unchanged. No account, cloud sync, matchmaking,
social delivery, AI tutor or new production dependency is introduced. Native wallet
dialogs remain separate from the imported focus/input helpers. New local session and
bookmark data use the existing `haha:math:v1:` adapter and are never uploaded.

## Bounded quality checks

The exact inelastic-collision counterexample and narrow EN/MS/ZH universal-reversal
tripwires in `scripts/audit_science_contract.py` are source-free regression checks,
not a semantic audit of every explanation. Existing content/schema, visual invariant,
translation-presence and renderer tests remain active. Full source-grounded scientific
and translation acceptance still requires evidence; a green CI run does not supply it.

Validation includes pinned import hashes, all authored answer alternatives, hostile
input, denominator restrictions, saved/draft recovery, history identity, Mana migration
and duplicate-reward safeguards, existing browser journeys, new graph/bookmark browser
coverage, and complete build assets. Accounts and challenges remain later milestones.
