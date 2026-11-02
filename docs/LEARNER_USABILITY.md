# Learner usability improvements — 2 November 2026

The live audit identified long routes to the first activity, generic chapter labels,
unexplained progress terminology and a long combined Mathematics notes page.

## Resulting behavior

- The two-subject chooser uses smaller cards and less introductory artwork on narrow screens.
- Both subjects offer a named Start/Continue lesson before the remaining home content.
- Chapter 8 and Chapter 9 display Energy and energy transfer and Momentum and collisions.
  Stored chapter keys, question content, scoring, progression and local storage remain unchanged.
- Progress acknowledges checked answers, including incorrect answers and retries. Successful
  answers without hints are distinguished from attempts without hints. Earlier saved progress remains compatible.
- Physics export and clear controls are grouped under Progress data settings; clear has danger styling.
  The operation retains its existing behavior and Mathematics progress is unaffected.
- Mathematics displays one existing topic at a time, with topic navigation, Previous and Next,
  then the existing evaluation. Correct/incorrect checks and all worked examples remain available.
- Single-answer Physics questions expose radio semantics, one tab stop, arrow-key selection and
  retained focus after choosing. Existing interaction and scoring contracts are preserved.
- Main buttons and chapter banners use darker colors; small labels and focus outlines are clearer.

Completed, practised and mastered are not interchangeable. Mathematics retains its original
completion/practice model; no new mastery claims, scoring thresholds or cloud accounts are introduced.
Existing Mathematics Mana is described as practice points rather than a mastery score.

## Source and publication

The GitHub generator checkout and hosted Sites source currently have different visual shells.
These behavior changes are applied to both; the hosted version retains its approved character
artwork and chapter journey. GitHub builds keep their existing shell. Sites publication is
manual and separate from GitHub CI; a passing build alone does not update production.

## Validation

Run content validation, Python tests and all JavaScript tests. Browser CI checks both subjects,
topic steps, existing evaluation/practice and isolated storage. The new usability smoke checks
top-of-home lesson actions, radio keyboard behavior, checked-attempt summaries, and topic navigation.
The in-app browser is used to inspect the actual hosted shell at phone and desktop widths.
This is not a full WCAG certification or a real learner study.

## Browser tab identity

All published subject and lesson pages declare the shared HaHa h. brand mark as an SVG favicon. The versioned icon URL refreshes cached tab artwork; standalone releases also include the icon.
