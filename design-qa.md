# Guided Physics notes — design QA

## Comparison target

Approved target: the existing HaHa visual system plus the accepted Product Design audit corrections. This is an intentional teaching-flow revision, not a pixel clone of the audited defects. Bright purple, existing typefaces, navigation, chapter artwork and assessed activities remain the reference. Audit source captures live in `../integration-artifacts/physics-notes-design-audit/`.

Source visual truth paths: `02-notes-start.png`, `04-checks.png`, `05-mobile-language.png` in that audit directory. Revised implementation captures: `../integration-artifacts/guided-notes-qa/after-desktop-start.png`, `after-desktop-checks.png`, `after-mobile-start.png`, `after-mobile-wrong-v2.png`. Images were opened together in the same comparison call; focused check/control captures were inspected separately.

## Viewports and image handling

Desktop source and revised native screenshots both measure 1265 × 712 pixels. Phone source and revised native screenshots both measure 375 × 812 pixels. Browser viewport targets were 1280 × 720 at desktop and 390 × 844 at phone width. The browser reports devicePixelRatio 2; its native screenshot API returns the above scaled captures. Both members of each pair use the same backend/native capture behavior, with no author-applied resampling or crop normalization. Pixel dimensions match within each pair.

Compared states: English notes entry at desktop; Chinese notes entry at phone width; explanation/check interaction states at their respective widths. The old phone capture was scrolled slightly to its objectives panel while the new capture begins at the route opening; exact vertical pixel alignment is therefore not asserted for that pair. The corrected hierarchy, translated text, legibility and first teaching content were inspected directly. No incidental browser-scroll difference is treated as a product defect.

## Findings and iteration history

1. P1 long opening, repeated headings and English objectives: replaced with a single localized authored heading/outcome and an early prerequisite disclosure. In the revised desktop DOM the first teaching section begins at 659 CSS pixels, versus about 1497 in the audit. Accepted intentional content/hierarchy change.
2. P1 passive answer disclosures: the friction pilot now has optional response choices, misconception-specific feedback, hint/retry/reveal and a five-step worked example. Wrong feedback is visibly red with explanatory text; correct feedback is green with explanatory text. These are independent of mastery/Mana. Accepted.
3. P2 phone mode-button wrapping: initial phone capture showed Chinese text stacked into a narrow column. Added a full-width row for that control. Recaptured phone opening shows the complete horizontal label and no page-width overflow. Fixed.
4. P1 contrast cascade: first corrected token was overridden by later shared tactile-button styles. Raised the scoped selector specificity, recaptured the wrong-answer state, and inspected computed foreground rgb(25,5,41) on the unchanged rgb(164,89,239) background. Contrast is approximately 4.8:1. Browser tests assert the actual rendered foreground. Fixed.
5. P1 prediction spoiled by preceding explanation: moved the direction-revealing paragraph into a later explanation disclosure and placed the prediction before model controls. The model remains optional to reveal. Fixed.

## Required fidelity surfaces

- Fonts/typography: retained existing family and fallback behavior. Compact note heading uses a 1.55–2rem range instead of the previous large repeated title. Text and mathematical HTML subscripts remain live content. All inspected labels are readable and wrap without truncation.
- Spacing/layout: compact header, early prerequisites, sticky contents/section position, guided/whole modes and section navigation. Phone controls stack as rows. Long reasoning cards still require normal vertical scrolling; this is expected and does not hide persistent controls or create horizontal overflow.
- Colors/tokens: retained bright Physics purple; scoped dark foreground fixes normal-size primary-action text contrast. Red/green feedback includes text, not color alone. Maths styling is unchanged.
- Image quality: original 1536 × 1024 block/table image was generated, inspected and used at its intrinsic aspect ratio with contain sizing. No replacement logo or approximate artwork was introduced. The image is contextual, not a measurement or answer-critical diagram; existing deterministic models still supply scientific arrows/results.
- Copy/content: English/Malay/Chinese strings cover pilot headings, recovery, controls, hints, choices, feedback and navigation. Display titles and the opening route use authored localized content. No false claim of teacher approval, student testing or durable progress saving appears.

## Functional inspection and limits

Browser inspection exercised contents/next navigation and focus, angle controls/prediction, force highlighting, optional incorrect response and correct retry, English/Chinese switching and phone reflow. Automated browser tests cover Malay as well, all fifteen notes routes, the new pilot and existing subject journeys. Browser console/page-error checks are part of CI; successful CI must be established separately before release.

No real learner sessions, expert translation certification, full screen-reader audit, 400% browser zoom audit or teacher review occurred. No mastery/progression/privacy/retention rules or assessed packages changed. In-visit reading state is memory-only and resets on refresh. Applying this guided pattern to the remaining fourteen lessons awaits separate iteration/learner feedback.

## Follow-up polish

P3: a phone check card is taller than one viewport once feedback is visible. A shorter optional-feedback presentation could reduce scrolling in a later pass. This does not block reading or retry.

## Implementation checklist

- Approved flow corrections implemented and compared against audit evidence.
- Phone wrapping and actual color cascade defects fixed and recaptured.
- Localized guide and contrast tests added; full CI required before publication.
- No actionable P0/P1/P2 design findings remain in the inspected pilot.

final result: passed
