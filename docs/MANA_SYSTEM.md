# Shared Mana wallet

The user approved the shared reward plan on 3 November 2026. Mana rewards learning
habits and unlocks cosmetic appearance only. It never gates lessons, explanations,
hints, mastery or progression. Existing mastery algorithms remain unchanged.

## Earning contract

| Trigger | Mana | Limit |
| --- | ---: | --- |
| First checked correct answer without hints or a previous checked mistake | 5 | Once per activity |
| First checked correct answer with a hint or after a checked mistake | 3 | Once per activity, replaces the 5-point reward |
| Correct review on a later local calendar day | 2 | At least seven elapsed days between paid reviews for that activity |
| Every question in a focused Physics practice set or Maths practice set attempted | 5 | Once per subject per local calendar day |

No deduction occurs for wrong answers, skipping or using hints. Unanswered skips
do not qualify a set for its bonus. A wrong checked answer counts as an attempt.
First-correct and review rewards cannot stack on the same answer. A set bonus is
separate from question rewards. Clock rollback cannot mint an earlier review.

Physics uses package/activity IDs. Maths uses stable checkpoint, evaluation and
practice question/part IDs, not random set positions. Optional concept checks,
evaluation and practice are eligible; merely reading notes is not rewarded.

## Storage and migration

`haha:mana:v1` is a versioned, browser-local ledger plus reward eligibility state.
The available balance is derived from signed transactions; awards and purchases
use stable receipt IDs. It is shared across subjects on the same origin. Individual
subject learning records remain separate. Clearing Physics progress does not reset
Mana or make previously paid activities eligible again.

The existing numeric `haha:math:v1:amMana` balance (or legacy `amSparks` fallback)
is carried over exactly once. Old Maths values remain unchanged, and historical
answers are not replayed for retroactive rewards. The old per-skill automatic
five-Mana award is replaced by the approved per-activity rules. New checked attempts
can earn rewards under the new rules. Mana on different website origins cannot be
merged automatically.

Browser Web Locks serialize writes across tabs. Same-tab writes are queued too.
Purchases are unavailable on browsers without Web Locks, avoiding unsafe concurrent
spending. Basic earning can continue in a single tab on those browsers. Blocked,
full or malformed storage does not produce a false successful reward or purchase;
malformed saved wallet data is preserved rather than silently reset. Storage failure
does not block learning. There is no server account, cloud sync or tamper-proof
currency: a user can edit or erase their own browser data.

The ledger contains reward type, amount, timestamp, subject/activity identifiers
and cosmetic IDs. It stores no answer text or identity and sends no network requests.
Transactions and eligibility are retained locally until browser site data is erased;
there is no new server retention policy. No wallet records belong in GitHub.

## Shop and learner experience

The shared wallet button appears on the chooser, Physics hub, Maths hub and players.
It opens a keyboard-accessible native dialog with the available balance, earning
rules, cosmetic previews, purchase confirmation and dated transaction history.
Wallet labels support English, Malay and Chinese; Maths content remains English.

| Cosmetic | Price | Effect |
| --- | ---: | --- |
| Forest accent | 30 | Green header accent |
| Ocean accent | 60 | Blue header accent |
| Golden frame | 90 | Gold header accent and next-lesson frame |

Buying requires confirmation, equips the cosmetic and charges once. Owned cosmetics
can be reused freely; original appearance is always free. Insufficient funds never
create a negative balance. Cosmetic styles do not recolor answer feedback.

## Validation and release

`test_mana.js` checks pure reward and spending rules. `test_mana_storage.js` checks
one-time migration, concurrent tabs, duplicate awards/purchases, write failure,
malformed/blocked storage and unsupported-browser purchase safety. Browser coverage
checks actual answers and practice, the shop, migration, cross-subject balance,
history and phone/desktop layouts. All original content and mastery checks remain.

GitHub source and the hosted character shell both receive the wallet. Sites source
publication remains separate from GitHub CI; a passing artifact workflow does not
by itself update the live app.
