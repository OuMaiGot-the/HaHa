(async function () {
  const status = document.getElementById('status');
  const root = document.getElementById('chapters');
  try {
    const response = await fetch('./catalog.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const catalog = await response.json();
    if (!Array.isArray(catalog)) throw new Error('Invalid catalog');
    const progressFor = (lesson) => {
      try {
        const saved = JSON.parse(localStorage.getItem('haha:progress:v1:' + lesson.id) || '{}');
        const completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter(id => typeof id === 'string') : []);
        const independent = new Set(Array.isArray(saved.independent) ? saved.independent.filter(id => typeof id === 'string') : []);
        return { completed: completed.size, independent: [...independent].filter(id => completed.has(id)).length };
      } catch (_error) {
        return { completed: 0, independent: 0 };
      }
    };
    const lessonProgress = catalog.map(lesson => ({ lesson, progress: progressFor(lesson) }));
    const review = lessonProgress.find(({ progress }) => progress.completed > progress.independent);
    const continuing = lessonProgress.find(({ lesson, progress }) => progress.completed > 0 && progress.completed < lesson.activities);
    const newLesson = lessonProgress.find(({ progress }) => progress.completed === 0);
    const recommended = review || continuing || newLesson;
    if (recommended) {
      const panel = document.createElement('section');
      panel.className = 'recommendation';
      panel.setAttribute('aria-label', 'Suggested learning');
      const heading = document.createElement('h2');
      heading.textContent = review ? 'Review with confidence' : continuing ? 'Continue learning' : 'Start learning';
      const description = document.createElement('p');
      description.textContent = review
        ? 'This lesson has hint-assisted completions. Revisit it for independent practice.'
        : continuing ? 'You have activities left to complete in this lesson.'
        : 'Begin with an available lesson.';
      const link = document.createElement('a');
      link.href = recommended.lesson.url;
      link.textContent = recommended.lesson.subchapter;
      panel.append(heading, description, link);
      root.append(panel);
    }
    const groups = new Map();
    for (const lesson of catalog) {
      if (!groups.has(lesson.chapter)) groups.set(lesson.chapter, []);
      groups.get(lesson.chapter).push(lesson);
    }
    for (const [chapter, lessons] of groups) {
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      heading.textContent = chapter;
      section.append(heading);
      const grid = document.createElement('div');
      grid.className = 'grid';
      for (const lesson of lessons) {
        const card = document.createElement('article');
        const link = document.createElement('a');
        link.href = lesson.url;
        link.textContent = lesson.subchapter;
        const detail = document.createElement('p');
        const count = document.createElement('small');
        count.textContent = lesson.activities + ' activities';
        detail.append(count);
        const progress = progressFor(lesson);
        if (progress.completed > 0) {
          const summary = document.createElement('p');
          summary.className = 'lesson-progress';
          summary.textContent = Math.min(progress.completed, lesson.activities) + ' of ' + lesson.activities + ' completed on this device';
          detail.append(summary);
          const mastery = document.createElement('p');
          mastery.className = 'lesson-progress';
          mastery.textContent = progress.independent + ' completed independently; ' + (progress.completed - progress.independent) + ' with hints';
          detail.append(mastery);
        }
        card.append(link, detail);
        grid.append(card);
      }
      section.append(grid);
      root.append(section);
    }
    status.textContent = catalog.length + ' lessons across ' + groups.size + ' chapters';
  } catch (error) {
    status.textContent = 'Could not load the lesson catalog: ' + error.message;
  }
})();
