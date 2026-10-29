(async function () {
  "use strict";
  const root = document.getElementById("chapters"),
    status = document.getElementById("status");
  const node = (tag, text, className) => {
    const e = document.createElement(tag);
    if (text !== undefined) e.textContent = text;
    if (className) e.className = className;
    return e;
  };
  const link = (text, href, className) => {
    const e = node("a", text, className);
    e.href = href;
    return e;
  };
  const button = (text, action, className) => {
    const e = node("button", text, className);
    e.type = "button";
    e.onclick = action;
    return e;
  };
  function storage() {
    try {
      return localStorage;
    } catch (_) {
      return {
        getItem: () => null,
        setItem: () => {
          throw Error("Unavailable");
        },
      };
    }
  }
  let prefs = HahaStudy.preferences(storage()),
    locale = prefs.locale,
    query = "",
    chapter = "",
    onlySaved = false;
  const t = (key) =>
    (HahaHubCopy[key] || [key, key, key])[["en", "ms", "zh"].indexOf(locale)];
  const localized = (v) =>
    typeof v === "string" ? v : v?.[locale] || v?.en || "";
  const selector = document.getElementById("locale");
  selector.value = locale;
  let storageWarning = false;
  const cache = new Map();
  let generation = 0;
  function savePrefs() {
    if (!HahaStudy.save(storage(), prefs)) { storageWarning = true; status.textContent = t("saveFailed"); }
  }
  function apply() {
    document.body.dataset.theme = prefs.theme;
    document.body.dataset.size = prefs.size;
    document.documentElement.lang = locale;
    document.getElementById("footer-copy").textContent = t("footer");
  }
  try {
    const response = await fetch("./catalog.json", { cache: "no-cache" });
    if (!response.ok) throw Error("HTTP " + response.status);
    const catalog = await response.json();
    if (!Array.isArray(catalog)) throw Error("Invalid catalog");
    const data = () =>
      Object.fromEntries(
        catalog.map((l) => [l.id, HahaLearning.read(storage(), l.id)]),
      );
    function nav(route) {
      const n = document.getElementById("navigation");
      n.replaceChildren();
      for (const key of (route === "subjects" ? ["subjects"] : ["subjects", "home", "learn", "progress", "tools"])) {
        const a = link(t(key), "#" + key);
        if (
          key === route ||
          (key === "learn" && ["practice", "review", "lesson"].includes(route))
        )
          a.setAttribute("aria-current", "page");
        n.append(a);
      }
    }
    function heading(key, description) {
      const h = node("header");
      h.append(node("p", t("space"), "eyebrow"), node("h1", t(key)));
      if (description) h.append(node("p", t(description), "muted"));
      root.append(h);
    }
    function recommend(saved) {
      const r = HahaLearning.recommend(catalog, saved),
        panel = node("section", undefined, "recommendation");
      panel.setAttribute("aria-label", t("title"));
      panel.append(
        node(
          "h2",
          r ? t(r.reason === "review" ? "reviewHeading" : r.reason) : t("done"),
        ),
      );
      if (r)
        panel.append(
          node("p", t("objective") + ": " + r.activity.objective),
          link(
            r.lesson.subchapter,
            r.lesson.url + "?activity=" + encodeURIComponent(r.activity.id),
          ),
        );
      root.append(panel);
    }
    function dashboard(saved) {
      const panel = node("section", undefined, "mastery-dashboard");
      panel.setAttribute("aria-label", t("title"));
      panel.append(node("h2", t("title")), node("p", t("local"), "muted"));
      const sums = catalog.map((l) =>
          HahaLearning.score(saved[l.id], l.activityMetadata),
        ),
        stats = node("div", undefined, "stats");
      for (const [value, label] of [
        [sums.reduce((n, s) => n + s.completed, 0), "completed"],
        [sums.reduce((n, s) => n + s.independent, 0), "independent"],
        [sums.reduce((n, s) => n + s.firstCorrect, 0), "first"],
      ]) {
        const e = node("div", undefined, "stat");
        e.append(node("strong", value), node("span", t(label)));
        stats.append(e);
      }
      panel.append(stats);
      const actions = node("div", undefined, "button-row");
      actions.append(
        button(t("export"), () => {
          const url = URL.createObjectURL(
            new Blob([JSON.stringify(saved, null, 2)], {
              type: "application/json",
            }),
          );
          const a = link("", url);
          a.download = "haha-device-progress.json";
          a.click();
          URL.revokeObjectURL(url);
        }),
        button(t("clear"), () => {
          for (const l of catalog) {
            try {
              storage().removeItem(HahaLearning.PREFIX + l.id);
            } catch (_) {
              storageWarning = true; status.textContent = t("saveFailed");
            }
          }
          render();
        }),
      );
      panel.append(actions);
      root.append(panel);
    }
    function subjects() {
      root.append(node("p", "HaHa Learning", "eyebrow"), node("h1", t("chooseSubject")), node("p", t("subjectIntro"), "muted"));
      const choices = node("section", undefined, "subject-grid");
      choices.setAttribute("aria-label", t("subjects"));
      for (const [key, href, symbol] of [["physics", "#home", "↗"], ["maths", "mathematics/index.html", "∑"]]) {
        const card = node("article", undefined, "subject-card");
        card.append(node("span", symbol, "card-symbol"), node("h2", t(key)), node("p", t(key === "physics" ? "physicsScope" : "mathsScope")));
        const entrance = link(t("openSubject") + " →", href, "primary");
        entrance.id = key + "-entrance";
        entrance.setAttribute("aria-label", t("openSubject") + ": " + t(key));
        card.append(entrance); choices.append(card);
      }
      root.append(choices);
    }
    function home(saved) {
      const hero = node("section", undefined, "hero"),
        text = node("div");
      text.append(
        node("p", t("space"), "eyebrow"),
        node("h1", t("welcome")),
        node("p", t("intro")),
      );
      const art = node("div", undefined, "orbit-art"),
        img = node("img");
      img.src = "hub-orbit.svg";
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      art.append(img);
      hero.append(text, art);
      root.append(hero);
      const cards = node("section", undefined, "home-actions");
      cards.setAttribute("aria-label", t("space"));
      for (const [key, symbol, desc] of [
        ["learn", "↗", "learnDesc"],
        ["practice", "✎", "practiceDesc"],
        ["review", "⟳", "reviewDesc"],
        ["tools", "✧", "toolsDesc"],
      ]) {
        const card = node("article", undefined, "home-action");
        card.append(
          node("span", symbol, "card-symbol"),
          node("h2", t(key)),
          node("p", t(desc)),
          link(t(key) + " →", "#" + key),
        );
        cards.append(card);
      }
      root.append(cards);
      recommend(saved);
      dashboard(saved);
    }
    function lessonCard(lesson, saved) {
      const card = node("article", undefined, "lesson-card"),
        top = node("div", undefined, "lesson-top");
      top.append(
        node(
          "span",
          lesson.status === "approved" || lesson.status === "published"
            ? t("learn")
            : t("draft"),
          "pill",
        ),
      );
      const b = button(
        prefs.favorites.includes(lesson.id) ? t("unsave") : t("save"),
        () => {
          const on = prefs.favorites.includes(lesson.id);
          prefs.favorites = on
            ? prefs.favorites.filter((x) => x !== lesson.id)
            : [...prefs.favorites, lesson.id];
          savePrefs();
          b.textContent = t(on ? "save" : "unsave");
          b.setAttribute(
            "aria-label",
            t(on ? "save" : "unsave") + ": " + lesson.subchapter,
          );
          b.setAttribute("aria-pressed", String(!on));
          if (onlySaved) render();
        },
        "bookmark",
      );
      b.setAttribute(
        "aria-pressed",
        String(prefs.favorites.includes(lesson.id)),
      );
      b.setAttribute("aria-label", t("save") + ": " + lesson.subchapter);
      top.append(b);
      const s = HahaLearning.score(saved[lesson.id], lesson.activityMetadata);
      card.append(
        top,
        link(lesson.subchapter, lesson.url),
        node("h3", t(s.level)),
        node(
          "p",
          `${s.percent}% · ${s.completed}/${s.total} ${t("completed")} · ${s.independent} ${t("independent")} · ${s.firstCorrect} ${t("first")}`,
        ),
      );
      const detail = node("details");
      detail.append(node("summary", t("objective")));
      for (const objective of [
        ...new Set(lesson.activityMetadata.map((a) => a.objective)),
      ]) {
        const x = HahaLearning.score(
          saved[lesson.id],
          lesson.activityMetadata.filter((a) => a.objective === objective),
        );
        detail.append(
          node("p", objective + ": " + t(x.level) + " · " + x.percent + "%"),
        );
      }
      card.append(
        detail,
        button(t("notes"), () => {
          location.hash = "lesson/" + encodeURIComponent(lesson.id);
        }),
      );
      return card;
    }
    function lessons(saved) {
      heading("learn", "learnDesc");
      recommend(saved);
      dashboard(saved);
      const filters = node("div", undefined, "filters"),
        sl = node("label", t("search")),
        search = node("input");
      search.type = "search";
      search.value = query;
      search.id = "lesson-search";
      sl.append(search);
      const cl = node("label", t("chapter")),
        choose = node("select");
      choose.id = "chapter-filter";
      const all = node("option", t("all"));
      all.value = "";
      choose.append(all);
      for (const c of [...new Set(catalog.map((l) => l.chapter))]) {
        const o = node("option", c);
        o.value = c;
        choose.append(o);
      }
      choose.value = chapter;
      cl.append(choose);
      const sb = button(t("saved"), () => {
        onlySaved = !onlySaved;
        sb.setAttribute("aria-pressed", String(onlySaved));
        paint();
      });
      sb.setAttribute("aria-pressed", String(onlySaved));
      filters.append(sl, cl, sb);
      root.append(filters);
      const lists = node("div");
      root.append(lists);
      function paint() {
        lists.replaceChildren();
        const matches = catalog.filter(
          (l) =>
            (!chapter || l.chapter === chapter) &&
            (!onlySaved || prefs.favorites.includes(l.id)) &&
            (
              l.chapter +
              " " +
              l.subchapter +
              " " +
              l.activityMetadata.map((a) => a.objective).join(" ")
            )
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase()),
        );
        if (!matches.length) lists.append(node("p", t("empty"), "empty"));
        for (const c of [...new Set(matches.map((l) => l.chapter))]) {
          const s = node("section", undefined, "chapter-group");
          s.append(node("h2", c));
          const grid = node("div", undefined, "grid");
          for (const lesson of matches.filter((l) => l.chapter === c))
            grid.append(lessonCard(lesson, saved));
          s.append(grid);
          lists.append(s);
        }
      }
      search.oninput = () => {
        query = search.value;
        paint();
      };
      choose.onchange = () => {
        chapter = choose.value;
        paint();
      };
      paint();
    }
    function practice(saved) {
      heading("practice", "practiceDesc");
      const panel = node("section", undefined, "panel"),
        form = node("div", undefined, "filters"),
        ll = node("label", t("lesson")),
        ls = node("select");
      ls.id = "practice-lesson";
      for (const l of catalog) {
        const o = node("option", l.subchapter);
        o.value = l.id;
        ls.append(o);
      }
      ll.append(ls);
      const dl = node("label", t("difficulty")),
        ds = node("select");
      ds.id = "practice-difficulty";
      for (const d of ["all", "easy", "moderate", "challenging"]) {
        const o = node("option", t(d === "all" ? "any" : d));
        o.value = d;
        ds.append(o);
      }
      dl.append(ds);
      form.append(ll, dl);
      const list = node("ol", undefined, "notes-list"),
        start = link(t("beginSet"), "", "primary");
      start.id = "begin-practice";
      panel.append(form, node("p", t("setInfo"), "muted"), list, start);
      root.append(panel);
      function update() {
        const lesson = catalog.find((l) => l.id === ls.value),
          ids = HahaStudy.practice(
            lesson.activityMetadata,
            saved[lesson.id],
            ds.value,
          );
        list.replaceChildren();
        for (const id of ids) {
          const a = lesson.activityMetadata.find((x) => x.id === id);
          list.append(node("li", a.objective + " · " + t(a.difficulty)));
        }
        start.href =
          lesson.url + "?practice=" + encodeURIComponent(ids.join(","));
      }
      ls.onchange = update;
      ds.onchange = update;
      update();
    }
    function review(saved) {
      heading("review", "reviewDesc");
      const panel = node("section", undefined, "panel");
      let count = 0;
      for (const lesson of catalog)
        for (const r of HahaLearning.evidence(
          saved[lesson.id],
          lesson.activityMetadata,
        ))
          if (r.credit < 1 && ((r.completed && !r.independent) || r.first)) {
            count++;
            const row = node("div", undefined, "review-row");
            row.append(
              node("small", lesson.subchapter),
              node("h3", r.activity.objective),
              node(
                "p",
                r.completed
                  ? t(r.independent ? "independent" : "assisted")
                  : t("retry"),
              ),
              link(
                t("retry"),
                lesson.url + "?activity=" + encodeURIComponent(r.activity.id),
              ),
            );
            panel.append(row);
          }
      if (!count) panel.append(node("p", t("noReview")));
      root.append(panel);
    }
    function progress(saved) {
      heading("progress");
      dashboard(saved);
      const panel = node("section", undefined, "panel");
      panel.append(node("h2", t("graph")), node("p", t("chartNote"), "muted"));
      const days = HahaStudy.week(catalog, saved),
        max = HahaStudy.axis(
          Math.max(0, ...days.map((d) => d.correct + d.incorrect)),
        ),
        chart = node("div", undefined, "chart");
      chart.setAttribute("role", "list");
      for (const day of days) {
        const total = day.correct + day.incorrect,
          el = node("div", undefined, "chart-day");
        el.tabIndex = 0;
        el.setAttribute("role", "listitem");
        const date = day.date.toLocaleDateString(
          locale === "ms" ? "ms-MY" : locale === "zh" ? "zh-CN" : "en-GB",
          { weekday: "short" },
        );
        el.setAttribute(
          "aria-label",
          `${date}: ${day.correct} ${t("correct")}, ${day.incorrect} ${t("incorrect")}`,
        );
        el.title = el.getAttribute("aria-label");
        const track = node("div", undefined, "chart-track"),
          bar = node("div", undefined, "chart-bar");
        bar.style.height = (total / max) * 100 + "%";
        for (const [value, cls] of [
          [day.incorrect, "chart-incorrect"],
          [day.correct, "chart-correct"],
        ]) {
          const segment = node("span", undefined, cls);
          segment.style.height = (total ? (value / total) * 100 : 0) + "%";
          bar.append(segment);
        }
        track.append(bar);
        el.append(node("span", total), track, node("small", date));
        chart.append(el);
      }
      const legend = node("div", undefined, "chart-key");
      legend.append(node("span", t("correct"), "legend-correct"), node("span", t("incorrect"), "legend-incorrect"));
      panel.append(legend, chart);
      root.append(panel);
      const badges = node("section", undefined, "panel");
      badges.append(node("h2", t("milestones")));
      const evidence = catalog.flatMap((l) =>
          HahaLearning.evidence(saved[l.id], l.activityMetadata),
        ),
        earned = [];
      if (evidence.some((r) => r.first))
        earned.push(["firstBadge", "firstBadgeDesc"]);
      if (evidence.filter((r) => r.independent).length >= 3)
        earned.push(["independentBadge", "independentBadgeDesc"]);
      if (evidence.some((r) => HahaStudy.comeback(r.rows)))
        earned.push(["comebackBadge", "comebackBadgeDesc"]);
      for (const [name, description] of earned) {
        const badge = node("div", undefined, "achievement");
        badge.append(node("h3", t(name)), node("p", t(description)));
        badges.append(badge);
      }
      if (!earned.length) badges.append(node("p", t("badgeEmpty")));
      root.append(badges);
      const recent = node("section", undefined, "panel");
      recent.append(node("h2", t("history")));
      const records = catalog
        .flatMap((l) =>
          HahaLearning.attempts(saved[l.id], l.activityMetadata)
            .filter((a) => a.result !== "skip")
            .map((a) => ({ a, l })),
        )
        .sort(
          (x, y) =>
            (Date.parse(y.a.timestamp) || 0) - (Date.parse(x.a.timestamp) || 0),
        )
        .slice(0, 10);
      for (const { a, l } of records) {
        const activity = l.activityMetadata.find((x) => x.id === a.activityId),
          row = node("div", undefined, "review-row");
        row.append(
          node("h3", activity.objective),
          node(
            "p",
            t(a.result === "correct" ? "correct" : "incorrect") +
              " · " +
              t(a.assisted ? "assisted" : "independent"),
          ),
          link(
            l.subchapter,
            l.url + "?activity=" + encodeURIComponent(a.activityId),
          ),
        );
        recent.append(row);
      }
      if (!records.length) recent.append(node("p", t("noReview")));
      root.append(recent);
    }
    function tools() {
      heading("tools", "toolsDesc");
      const panel = node("section", undefined, "panel");
      panel.append(node("h2", t("appearance")));
      const form = node("div", undefined, "filters");
      for (const [key, values, title] of [
        ["theme", ["light", "dark"], "appearance"],
        ["size", ["normal", "large"], "size"],
      ]) {
        const label = node("label", t(title)),
          s = node("select");
        s.id = "setting-" + key;
        for (const value of values) {
          const o = node("option", t(value));
          o.value = value;
          s.append(o);
        }
        s.value = prefs[key];
        s.onchange = () => {
          prefs[key] = s.value;
          savePrefs();
          apply();
        };
        label.append(s);
        form.append(label);
      }
      panel.append(form);
      root.append(panel);
      const help = node("section", undefined, "help-grid"),
        guide = node("article", undefined, "panel");
      guide.append(node("h2", t("approach")));
      const list = node("ol", undefined, "notes-list");
      for (const step of t("steps").split("|")) list.append(node("li", step));
      guide.append(list);
      const privacy = node("article", undefined, "panel");
      privacy.append(node("h2", t("privacy")), node("p", t("privacyText")));
      help.append(guide, privacy);
      root.append(help);
    }
    async function notes(id, current) {
      const lesson = catalog.find((l) => l.id === id);
      if (!lesson) {
        heading("learn");
        root.append(node("p", t("failed")));
        return;
      }
      root.append(
        link("← " + t("back"), "#learn", "back-link"),
        node("h1", lesson.subchapter),
      );
      if (!cache.has(id)) {
        const p = node("p", t("loading"));
        root.append(p);
        try {
          const response = await fetch(
            lesson.url.replace(/index\.html$/, "content/package.json"),
          );
          if (!response.ok) throw Error();
          cache.set(id, await response.json());
          if (current === generation) render();
        } catch (_) {
          if (current === generation) p.textContent = t("failed");
        }
        return;
      }
      const pkg = cache.get(id),
        goals = node("section", undefined, "panel");
      goals.append(
        node("span", t(lesson.status === "approved" || lesson.status === "published" ? "learn" : "draft"), "pill"),
        node("h2", t("goals")),
        node("p", t("notesHelp")),
      );
      const list = node("ul", undefined, "notes-list");
      for (const objective of pkg.learningObjectives || [
        ...new Set(pkg.activities.map((a) => a.objective)),
      ])
        list.append(node("li", localized(objective)));
      goals.append(list, link(t("open"), lesson.url, "primary"));
      root.append(goals);
      const prereqs = node("section", undefined, "panel");
      prereqs.append(node("h2", t("prerequisites")));
      for (const p of pkg.prerequisites || [])
        prereqs.append(
          node("h3", localized(p.description)),
          node("p", localized(p.recovery)),
        );
      root.append(prereqs);
    }
    function render() {
      generation++;
      const current = generation;
      apply();
      root.replaceChildren();
      const hash = location.hash.slice(1) || "subjects",
        route = hash.split("/")[0],
        saved = data();
      nav(route);
      status.textContent =
        catalog.length +
        " " +
        t("lessons") +
        " · " +
        new Set(catalog.map((l) => l.chapter)).size +
        " " +
        t("chapters");
      if (route === "subjects") status.textContent = t("subjectsAvailable");
      document.title = "HaHa · " + (route === "subjects" ? t("subjects") : t("physics"));
      if (storageWarning) status.textContent = t("saveFailed");
      if (route === "subjects") subjects();
      else if (route === "learn") lessons(saved);
      else if (route === "practice") practice(saved);
      else if (route === "review") review(saved);
      else if (route === "progress") progress(saved);
      else if (route === "tools") tools();
      else if (route === "lesson") {
        let id;
        try {
          id = decodeURIComponent(hash.slice(7));
        } catch (_) {
          id = "";
        }
        notes(id, current);
      } else home(saved);
    }
    selector.onchange = () => {
      locale = selector.value;
      prefs.locale = locale;
      savePrefs();
      render();
    };
    window.addEventListener("hashchange", () => {
      render();
      document.getElementById("main").focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    window.addEventListener("storage", () => {
      prefs = HahaStudy.preferences(storage());
      locale = prefs.locale;
      selector.value = locale;
      render();
    });
    render();
  } catch (error) {
    status.textContent = "Could not load the study space: " + error.message;
  }
})();
