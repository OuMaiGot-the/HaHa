(async function () {
  const root = document.getElementById('chapters');
  const status = document.getElementById('status');
  const labels = {
    en: { lessons: 'lessons', chapters: 'chapters', title: 'Your mastery on this device', start: 'Start learning', review: 'Review with confidence', continue: 'Continue learning', done: 'All available evidence reviewed', local: 'Device-local formative evidence. No cohort ranking. Legacy completions need fresh attempts for mastery.', completed: 'completed', independent: 'independent', first: 'first-attempt successes', objective: 'Objective', Starting: 'Starting', Developing: 'Developing', Proficient: 'Proficient', Mastered: 'Mastered', clear: 'Clear device progress', export: 'Export device progress' },
    ms: { lessons: 'pelajaran', chapters: 'bab', title: 'Penguasaan anda pada peranti ini', start: 'Mula belajar', review: 'Ulang kaji dengan yakin', continue: 'Teruskan pembelajaran', done: 'Semua bukti tersedia disemak', local: 'Bukti formatif pada peranti ini. Tiada kedudukan kohort. Jawab semula untuk menilai penguasaan rekod lama.', completed: 'selesai', independent: 'kendiri', first: 'kejayaan percubaan pertama', objective: 'Objektif', Starting: 'Permulaan', Developing: 'Berkembang', Proficient: 'Cekap', Mastered: 'Dikuasai', clear: 'Padam kemajuan peranti', export: 'Eksport kemajuan peranti' },
    zh: { lessons: '课', chapters: '章', title: '此设备上的学习掌握情况', start: '开始学习', review: '巩固复习', continue: '继续学习', done: '已复习所有可用证据', local: '仅保存在此设备的形成性学习记录。无群体排名。旧完成记录需重新作答以评估掌握程度。', completed: '已完成', independent: '独立完成', first: '首次独立答对', objective: '目标', Starting: '起步', Developing: '发展中', Proficient: '熟练', Mastered: '已掌握', clear: '清除此设备的进度', export: '导出此设备的进度' }
  };
  const node = (tag, text) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; return el; };
  try {
    const response = await fetch('./catalog.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const catalog = await response.json();
    if (!Array.isArray(catalog)) throw new Error('Invalid catalog');
    function storage() { try { return localStorage; } catch (_) { return { getItem: () => null }; } }
    function render() {
      const locale = document.getElementById('locale').value;
      const t = labels[locale]; document.documentElement.lang = locale;
      root.replaceChildren();
      const saved = Object.fromEntries(catalog.map(l => [l.id, HahaLearning.read(storage(), l.id)]));
      const dashboard = node('section'); dashboard.setAttribute('aria-label', t.title);
      dashboard.className = 'mastery-dashboard'; dashboard.append(node('h2', t.title), node('p', t.local));
      const exportButton = node('button', t.export);
      exportButton.onclick = () => {
        const url = URL.createObjectURL(new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' }));
        const link = node('a'); link.href = url; link.download = 'haha-device-progress.json'; link.click(); URL.revokeObjectURL(url);
      };
      const clearButton = node('button', t.clear);
      clearButton.onclick = () => { for (const lesson of catalog) { try { storage().removeItem(HahaLearning.PREFIX + lesson.id); } catch (_) { /* optional storage */ } } render(); };
      dashboard.append(exportButton, clearButton); root.append(dashboard);
      const recommended = HahaLearning.recommend(catalog, saved);
      const panel = node('section'); panel.className = 'recommendation'; panel.setAttribute('aria-label', t.title);
      panel.append(node('h2', recommended ? t[recommended.reason] : t.done));
      if (recommended) {
        panel.append(node('p', t.objective + ': ' + recommended.activity.objective));
        const link = node('a', recommended.lesson.subchapter);
        link.href = recommended.lesson.url + '?activity=' + encodeURIComponent(recommended.activity.id); panel.append(link);
      }
      root.append(panel);
      const groups = new Map();
      for (const lesson of catalog) { if (!groups.has(lesson.chapter)) groups.set(lesson.chapter, []); groups.get(lesson.chapter).push(lesson); }
      for (const [chapter, lessons] of groups) {
        const section = node('section'); section.append(node('h2', chapter));
        const grid = node('div'); grid.className = 'grid';
        for (const lesson of lessons) {
          const card = node('article'); const link = node('a', lesson.subchapter); link.href = lesson.url;
          const summary = HahaLearning.score(saved[lesson.id], lesson.activityMetadata || []);
          card.append(link, node('h3', t[summary.level]), node('p', `${summary.percent}% · ${summary.completed}/${summary.total} ${t.completed} · ${summary.independent} ${t.independent} · ${summary.firstCorrect} ${t.first}`));
          const details = node('details'); details.append(node('summary', t.objective));
          const objectives = [...new Set((lesson.activityMetadata || []).map(a => a.objective))];
          for (const objective of objectives) {
            const score = HahaLearning.score(saved[lesson.id], lesson.activityMetadata.filter(a => a.objective === objective));
            details.append(node('p', `${objective}: ${t[score.level]} · ${score.percent}%`));
          }
          card.append(details); grid.append(card);
        }
        section.append(grid); root.append(section);
      }
      status.textContent = `${catalog.length} ${t.lessons} · ${groups.size} ${t.chapters}`;
    }
    document.getElementById('locale').addEventListener('change', render);
    window.addEventListener('storage', render); render();
  } catch (error) { status.textContent = 'Could not load the lesson catalog: ' + error.message; }
})();
