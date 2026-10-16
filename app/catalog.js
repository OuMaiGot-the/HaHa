(async function () {
  const status = document.getElementById('status');
  const root = document.getElementById('chapters');
  try {
    const response = await fetch('./catalog.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const catalog = await response.json();
    if (!Array.isArray(catalog)) throw new Error('Invalid catalog');
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
