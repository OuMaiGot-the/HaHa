(function (root) {
  "use strict";
  const KEY = "haha:study:v1";
  function preferences(storage) {
    let value;
    try {
      value = JSON.parse(storage.getItem(KEY) || "{}");
    } catch (_) {
      value = {};
    }
    if (!value || typeof value !== "object") value = {};
    return {
      theme: value.theme === "dark" ? "dark" : "light",
      size: value.size === "large" ? "large" : "normal",
      locale: ["en", "ms", "zh"].includes(value.locale) ? value.locale : "en",
      favorites: [
        ...new Set(
          Array.isArray(value.favorites)
            ? value.favorites.filter((x) => typeof x === "string")
            : [],
        ),
      ],
    };
  }
  function save(storage, value) {
    try {
      storage.setItem(KEY, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }
  function practice(activities, saved, difficulty = "all", limit = 5) {
    const rows = root.HahaLearning.evidence(saved, activities).filter(
      (r) => difficulty === "all" || r.activity.difficulty === difficulty,
    );
    const rank = (r) =>
      r.completed && !r.independent
        ? 0
        : !r.completed && r.rows.length
          ? 1
          : !r.completed
            ? 2
            : r.credit < 1
              ? 3
              : 4;
    return rows
      .map((row, index) => ({ row, index }))
      .sort((a, b) => rank(a.row) - rank(b.row) || a.index - b.index)
      .slice(0, Math.max(0, limit))
      .map((x) => x.row.activity.id);
  }
  function week(lessons, saved, now = new Date()) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(day);
      d.setDate(d.getDate() - 6 + i);
      return { date: d, correct: 0, incorrect: 0, seconds: 0 };
    });
    for (const lesson of lessons)
      for (const attempt of root.HahaLearning.attempts(
        saved[lesson.id] || {},
        lesson.activityMetadata || [],
      )) {
        if (attempt.result === "skip") continue;
        const timestamp = new Date(attempt.timestamp);
        if (!Number.isFinite(timestamp.getTime())) continue;
        const bucket = days.find((d) => {
          const end = new Date(d.date);
          end.setDate(end.getDate() + 1);
          return timestamp >= d.date && timestamp < end;
        });
        if (bucket) {
          bucket[attempt.result]++;
          const duration = Number(attempt.durationMs);
          if (Number.isFinite(duration))
            bucket.seconds += Math.max(0, duration) / 1000;
        }
      }
    return days;
  }
  function axis(value) {
    if (value <= 1) return 1;
    const raw = value / 4,
      power = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].find((x) => x * power >= raw) * power;
    return Math.ceil(value / step) * step;
  }
  function comeback(rows) {
    return rows.some((attempt, index) => attempt.result === "incorrect" && rows.slice(index + 1).some(later => later.result === "correct"));
  }
  const api = { KEY, preferences, save, practice, week, axis, comeback };
  root.HahaStudy = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
