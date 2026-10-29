# Test plan

## Foundation gates

- All JSON files parse.
- Content packages satisfy structural and semantic validation.
- Publishable subchapters contain the exact required activity distribution.
- Calculator-required and numerical-answer activities are rejected.
- Required multilingual fields are present.
- Course-specific legacy naming is absent.
- Documentation links and protected-file expectations remain valid.

## Vertical-slice gates

- Responsive keyboard-accessible activity player.
- First-attempt and assisted evidence remain distinct.
- Offline submission queue is idempotent.
- Mastery/progression changes have deterministic unit tests.
- Tutor is grounded, bounded, and falls back safely.
- Teacher and student views enforce role boundaries.
- Automated accessibility checks plus manual screen-reader and mobile checks.

## Pilot evidence

Measure immediate understanding, delayed retention, participation/completion, tutor accuracy/usefulness, and teacher-management workload. Do not optimise solely for time in app, streak length, or activity volume.


## Milestone 4 implementation

See [device-local mastery](MILESTONE_4_MASTERY.md) for the attempt contract,
scoring thresholds, recommendation priorities, privacy boundaries, and test gates.

Browser workflows wait for a successful catalog response with `scripts/wait_preview.py`
before opening Chromium, avoiding a race with the background preview server.

## Integrated study hub

See [the comparison and integration contract](INTEGRATED_STUDY_HUB.md) for the
physics study shell, focused practice, evidence-based review, preferences and tests.
