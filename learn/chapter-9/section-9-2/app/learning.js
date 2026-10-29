(function (root) {
  'use strict';
  const PREFIX = 'haha:progress:v1:';
  const weights = { easy: 1, moderate: 2, challenging: 3 };
  function read(storage, id) {
    try {
      const value = JSON.parse(storage.getItem(PREFIX + id) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (_) { return {}; }
  }
  function attempts(saved, activities) {
    const ids = new Set(activities.map(a => a.id));
    const seen = new Set();
    return (Array.isArray(saved.attempts) ? saved.attempts : []).filter(a => {
      if (!a || typeof a.id !== 'string' || seen.has(a.id) || !ids.has(a.activityId) ||
          !['correct', 'incorrect', 'skip'].includes(a.result) || typeof a.assisted !== 'boolean') return false;
      seen.add(a.id); return true;
    });
  }
  function evidence(saved, activities) {
    const history = attempts(saved, activities);
    const completed = new Set(Array.isArray(saved.completed) ? saved.completed : []);
    const independent = new Set(Array.isArray(saved.independent) ? saved.independent : []);
    return activities.map(activity => {
      const rows = history.filter(a => a.activityId === activity.id);
      const first = rows.find(a => a.result !== 'skip');
      const success = rows.some(a => a.result === 'correct');
      const unaided = rows.some(a => a.result === 'correct' && !a.assisted);
      // Legacy completion is visible, but cannot invent first-attempt evidence.
      const legacy = completed.has(activity.id);
      return { activity, rows, first, completed: success || legacy,
        independent: unaided || (legacy && independent.has(activity.id)),
        credit: first?.result === 'correct' && !first.assisted ? 1 : unaided ? .7 : success ? .35 : 0 };
    });
  }
  function score(saved, activities) {
    const rows = evidence(saved, activities);
    const denominator = rows.reduce((sum, r) => sum + (weights[r.activity.difficulty] || 1), 0);
    const percent = denominator ? Math.round(100 * rows.reduce((sum, r) => sum + r.credit * (weights[r.activity.difficulty] || 1), 0) / denominator) : 0;
    const covered = rows.filter(r => r.first).length;
    const level = percent >= 90 && covered === rows.length && rows.length ? 'Mastered' : percent >= 70 ? 'Proficient' : percent >= 30 ? 'Developing' : 'Starting';
    return { percent, level, covered, total: rows.length, completed: rows.filter(r => r.completed).length,
      independent: rows.filter(r => r.independent).length, firstCorrect: rows.filter(r => r.first?.result === 'correct' && !r.first.assisted).length };
  }
  function record(storage, pkg, activity, event) {
    if (!event || typeof event.id !== "string" || !["correct", "incorrect", "skip"].includes(event.result) || !pkg.activities.some(a => a.id === activity.id)) return false;
    const saved = read(storage, pkg.packageId);
    const history = attempts(saved, pkg.activities);
    if (history.some(a => a.id === event.id)) return true;
    const row = { id: event.id, activityId: activity.id, result: event.result,
      assisted: !!event.hint || !!event.retry, hint: !!event.hint,
      timestamp: event.timestamp, durationMs: Math.max(0, Number(event.durationMs) || 0), locale: event.locale };
    history.push(row);
    const next = { ...saved, version: 2, attempts: history };
    const rows = evidence(next, pkg.activities);
    next.completed = rows.filter(r => r.completed).map(r => r.activity.id);
    next.independent = rows.filter(r => r.independent).map(r => r.activity.id);
    next.updatedAt = event.timestamp;
    try { storage.setItem(PREFIX + pkg.packageId, JSON.stringify(next)); return true; } catch (_) { return false; }
  }
  function recommend(lessons, savedById) {
    const candidates = [];
    for (const lesson of lessons) {
      const topicRows = evidence(savedById[lesson.id] || {}, lesson.activityMetadata || []);
      const started = topicRows.some(r => r.completed || r.rows.length);
      for (const row of topicRows) {
        const priority = row.completed && !row.independent ? 0 : row.rows.some(a => a.result === 'incorrect') && !row.completed ? 0 : !row.completed && row.rows.length ? 1 : !row.completed ? (started ? 1 : 2) : row.credit < 1 ? 3 : 4;
        if (priority < 4) candidates.push({ lesson, activity: row.activity, priority,
          reason: priority === 0 || priority === 3 ? 'review' : priority === 1 ? 'continue' : 'start' });
      }
    }
    // Stable catalog/activity ordering breaks ties. Prioritize weak objectives within a topic.
    for (const candidate of candidates) {
      const topic = candidate.lesson.activityMetadata || [];
      const objective = topic.filter(a => a.objective === candidate.activity.objective);
      candidate.objectiveScore = score(savedById[candidate.lesson.id] || {}, objective).percent;
      candidate.topicScore = score(savedById[candidate.lesson.id] || {}, topic).percent;
    }
    candidates.sort((a, b) => a.priority - b.priority || a.topicScore - b.topicScore || a.objectiveScore - b.objectiveScore);
    if (!candidates.length) return null;
    const chosen = candidates[0];
    return chosen;
  }
  const api = { PREFIX, read, attempts, evidence, score, record, recommend };
  if (typeof module !== 'undefined') module.exports = api;
  root.HahaLearning = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
