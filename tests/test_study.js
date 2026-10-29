const assert = require("node:assert/strict");
global.HahaLearning = require("../app/learning.js");
const S = require("../app/study.js");
const acts = Array.from({ length: 8 }, (_, i) => ({
  id: "a" + i,
  difficulty: i % 2 ? "challenging" : "easy",
  objective: "o" + i,
}));
assert.equal(S.preferences({ getItem: () => "{bad" }).theme, "light");
assert.deepEqual(
  S.preferences({
    getItem: () =>
      JSON.stringify({
        theme: "evil",
        size: "x",
        locale: "de",
        favorites: ["x", "x", 1],
      }),
  }),
  { theme: "light", size: "normal", locale: "en", favorites: ["x"] },
);
assert.equal(
  S.save(
    {
      setItem() {
        throw Error();
      },
    },
    {},
  ),
  false,
);
const saved = {
  attempts: [
    {
      id: "first",
      activityId: "a6",
      result: "incorrect",
      assisted: false,
      timestamp: "2026-10-29T08:00:00Z",
      durationMs: 1000,
    },
  ],
};
assert.equal(S.practice(acts, saved)[0], "a6");
assert.equal(S.practice(acts, saved).length, 5);
assert(
  S.practice(acts, saved, "easy").every((id) => Number(id.slice(1)) % 2 === 0),
);
assert.equal(S.practice(acts, saved, "unknown").length, 0);
const before = JSON.stringify(saved);
S.practice(acts, saved);
assert.equal(JSON.stringify(saved), before);
const lessons = [{ id: "lesson", activityMetadata: acts }];
const now = new Date(2026, 9, 29, 12);
saved.attempts[0].timestamp = new Date(2026, 9, 29, 8).toISOString();
saved.attempts.push({
  id: "skip",
  activityId: "a0",
  result: "skip",
  assisted: false,
  timestamp: saved.attempts[0].timestamp,
});
const days = S.week(lessons, { lesson: saved }, now);
assert.equal(days.length, 7);
assert.equal(days[6].incorrect, 1);
assert.equal(days[6].correct, 0);
assert.equal(days[6].seconds, 1);
assert.equal(
  S.week(
    lessons,
    {
      lesson: {
        attempts: [
          {
            id: "bad",
            activityId: "a0",
            result: "correct",
            assisted: false,
            timestamp: "bad",
          },
        ],
      },
    },
    now,
  ).reduce((n, d) => n + d.correct, 0),
  0,
);
assert.equal(S.axis(0), 1);
assert.equal(S.axis(1), 1);
for (const n of [2, 4, 10, 27, 110])
  assert(S.axis(n) >= n && Number.isInteger(S.axis(n)));
console.log(
  "Study utilities passed: safe settings, deterministic focused practice, difficulty filtering, pure selection, local-week evidence, integer chart axes.",
);
