# Physics and Additional Mathematics subjects

## Scope and provenance

The user requested both subjects on 29 October 2026, extending the earlier
physics-only study-hub scope. The app entrance now offers Physics and Additional
Mathematics; Physics retains its existing `#home` route and its complete catalog.

Mathematics imports the existing material from `jjyeo95/addmath-lab` commit
`4296ada59af904666da8489c4aae92b0993c2dcc`, file `dist/index.html`, blob
`f893fb14b627905d45eda2238acdb9d38aed8744`. The upstream repository and original
owner's Site are not modified. No owner-bound hosting configuration, credentials
or browser profile exports were copied.

The original authored mathematics structures are preserved, with a structural
SHA-256 recorded in `app/mathematics/provenance.json` and checked by
`tests/test_mathematics_import.js`. This includes:

- Three note sections and worked examples: Functions, Composite Functions,
  Inverse Functions.
- The deterministic function machine and graph for `f(x) = 2x + 1`.
- Three optional concept checks and three chapter evaluation questions.
- Twenty-four practice-bank questions and five multipart capstone templates.
- Existing Form 4/Form 5 chapter maps, with unavailable chapters still marked
  as coming soon.

No new mathematics question text was authored for this import. The existing
numerical/algebraic exercises are carried over at the user's request; the Physics
question-authoring rules and content-package validator remain unchanged. The math
prototype is a separate subject module, not a Physics package or a claim of full
SPM syllabus coverage. Its material remains labelled as draft and needs its own
subject review before a learner-content pilot.

## Integration behavior

- The default entrance and `#subjects` route show two actual subject choices.
  The chooser supports English/Malay/Chinese. Imported mathematics material is
  currently English; the chooser and math header say so.
- Physics keeps existing lessons, activity IDs, mastery scoring, preferences,
  bookmarks and `haha:progress:v1:<packageId>` records.
- Mathematics uses the adapter prefix `haha:math:v1:` for every original storage
  key. It does not write old unprefixed `am*` or `addmathLab*` keys or touch Physics
  evidence. Physics progress clearing leaves Mathematics records intact.
- Mathematics retains the source's own evaluation/practice rules: chapter
  evaluation completion is separate from correctness, and practice results show
  answers and worked solutions. It is not silently scored with Physics mastery.
- A persistent Switch subject link returns from Mathematics to the chooser.
  Physics navigation includes Subjects; lesson return links lead to Physics home.
- Math appearance/reading controls persist separately and remain usable with
  blocked storage. Corrupt record shapes fall back to the original defaults.
- The mathematics shell exposes learning, practice and progress. Unconnected
  social/challenge/tutor/profile routes are not exposed as working features;
  their source definitions remain within the imported snapshot for provenance.
  There is no shared account, live tutor, matchmaking or remote learner database.
- The build copies `app/mathematics/` into `mathematics/` in the static release.
  The existing Sites identity, public URL and audience are preserved.

## Verification

The subject browser suite tests the three-language chooser, both subject paths,
all three math notes, function-machine output, wrong-answer feedback, evaluation
completion after an intentionally wrong test attempt, practice results, reload
persistence, theme/reading controls, two-way storage separation, mobile overflow,
and blocked browser storage. Physics retains its four existing browser suites.
The mathematics import unit test checks the entire imported content digest,
question counts, expected evaluation keys, JavaScript syntax and namespace/network
boundaries. These checks do not replace mathematical/educational review.
