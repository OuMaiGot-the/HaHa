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
    const switchLabel=document.querySelector('.subject-switch>summary');if(switchLabel)switchLabel.textContent={en:'Switch subject',ms:'Tukar subjek',zh:'切换科目'}[locale];
    const subjects=document.querySelectorAll('.subject-switch-options a');if(subjects[0])subjects[0].textContent={en:'Mathematics',ms:'Matematik',zh:'数学'}[locale];if(subjects[1])subjects[1].textContent={en:'Physics',ms:'Fizik',zh:'物理'}[locale];
    const languageLabel=document.querySelector('.language-label');if(languageLabel?.firstChild?.nodeType===3)languageLabel.firstChild.textContent={en:'Language',ms:'Bahasa',zh:'语言'}[locale];
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
    const chapterLabel = c => ({
      "Physics and Measurement": {en:"Physics and Measurement",ms:"Fizik dan Pengukuran",zh:"物理与测量"},
      "Chapter 8": {en:"Energy and energy transfer",ms:"Tenaga dan pemindahan tenaga",zh:"能量与能量传递"},
      "Chapter 9": {en:"Momentum and collisions",ms:"Momentum dan perlanggaran",zh:"动量与碰撞"}
    }[c]?.[locale] || c);
    function nav(route) {
      const n = document.getElementById("navigation");
      n.replaceChildren();
      const subjectSwitch=document.querySelector(".subject-switch");if(subjectSwitch)subjectSwitch.hidden=route==="subjects";
      const shortcut=document.getElementById("study-tools-shortcut");
      if(shortcut){shortcut.textContent=t("tools");shortcut.hidden=route==="subjects";}
      document.querySelector(".brand-caption").textContent=route==="subjects"?"LEARNING STUDIO":t("physics").toUpperCase();
      for (const key of (route === "subjects" ? ["subjects"] : ["home", "learn", "practice", "progress"])) {
        const a = link(t(key), "#" + key);
        if (
          key === route ||
          (key === "learn" && ["review", "lesson"].includes(route))
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
        [sums.reduce((n, s) => n + s.independent, 0), "independentSuccess"],
        [sums.reduce((n, s) => n + s.firstCorrect, 0), "first"],
      ]) {
        const e = node("div", undefined, "stat");
        e.append(node("strong", value), node("span", t(label)));
        stats.append(e);
      }
      const checks=catalog.reduce((n,l)=>n+HahaLearning.attempts(saved[l.id],l.activityMetadata).filter(a=>a.result!=="skip").length,0);
      panel.append(node("p",t("attempted")+": "+checks,"attempt-summary"),stats,node("p",t("progressHelp"),"muted"));
      if(checks) panel.append(link(t("review")+" →","#review","review-next"));
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
      const settings=node("details",undefined,"progress-data-settings");
      settings.append(node("summary",t("dataSettings")),node("p",t("clearNote")),actions);
      actions.lastChild.classList.add("danger-action");
      panel.append(settings);
      root.append(panel);
    }
    function mascot(who,pose="welcome",extra=""){const m=node("span",undefined,"mascot mascot-"+who+" mascot-"+pose+" "+extra);m.setAttribute("aria-hidden","true");return m;}
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
        card.prepend(mascot(key === "physics" ? "phyphy" : "meymey"),node("small",key === "physics" ? "Meet PhyPhy" : "Meet MeyMey","mascot-name"));card.append(entrance); choices.append(card);
      }
      const hello=node("div",undefined,"mascot-greeting");hello.append(mascot("haha"),node("p",{en:"Hi, I’m HaHa. Let’s discover something new!",ms:"Hai, saya HaHa. Mari terokai sesuatu yang baharu!",zh:"你好，我是HaHa。一起来探索新知识吧！"}[locale]));root.append(hello,choices);
    }
    function phyphyChess(index,complete=false){
      const art=node("span",undefined,"phyphy-chess");
      art.setAttribute("aria-hidden","true");
      art.style.setProperty("--phy-x",index%2?"79%":"27%");
      art.style.setProperty("--phy-y",index%4>=2?"100%":"0%");
      art.style.setProperty("--phy-height",index%4>=2?"191.76%":"215.126%");
      art.append(node("span",undefined,"phyphy-expression"),PhyPhyMotion.create(index));
      if(complete)art.append(node("span","✓","phyphy-complete"));
      return art;
    }
    const phyphyBypass=new WeakSet();
    document.addEventListener("click",async event=>{
      const trigger=event.target.closest(".phyphy-trigger");
      if(!trigger||phyphyBypass.has(trigger))return;
      event.preventDefault();event.stopImmediatePropagation();
      if(trigger.dataset.reacting)return;
      // Closing an expanded lesson needs no second animation delay.
      if(trigger.tagName==="SUMMARY"&&trigger.parentElement.open){
        trigger.classList.remove("phyphy-reacting");
        phyphyBypass.add(trigger);try{trigger.click();}finally{phyphyBypass.delete(trigger);}return;
      }
      trigger.dataset.reacting="true";trigger.classList.add("phyphy-reacting");
      try{await PhyPhyMotion.play(trigger.querySelector(".phyphy-feature-canvas"));}
      finally{delete trigger.dataset.reacting;trigger.classList.remove("phyphy-reacting");}
      if(!trigger.isConnected)return;
      phyphyBypass.add(trigger);try{trigger.click();}finally{phyphyBypass.delete(trigger);}
    },true);
    function home(saved) {
      const groups=[...new Set(catalog.map(l=>l.chapter))],scores=catalog.map(l=>HahaLearning.score(saved[l.id],l.activityMetadata));
      const done=scores.reduce((n,x)=>n+x.completed,0),total=scores.reduce((n,x)=>n+x.total,0);
      const next=catalog.find((l,i)=>scores[i].completed<scores[i].total)||catalog[0];
      const copy={en:["A LITTLE PRACTICE. A BIG DIFFERENCE.","Your next physics adventure","PhyPhy is here to help. Let’s take it one step at a time.","Explore the world of Physics","Measurement, energy, and momentum.","All chapters →","Your progress","activities","Start learning →","A little practice?","Explore up to five activities, with hints and explanations.","Let’s practise →","Every step counts.","Explore at your own pace. You can revisit any lesson.","Progress stays in this browser.","Review & study tools"],ms:["LATIHAN KECIL. PERUBAHAN BESAR.","Pengembaraan fizik anda","PhyPhy sedia membantu. Mari belajar selangkah demi selangkah.","Terokai dunia Fizik","Pengukuran, tenaga dan momentum.","Semua bab →","Kemajuan anda","aktiviti","Mula belajar →","Mari berlatih?","Cuba sehingga lima aktiviti dengan petunjuk dan penjelasan.","Mari berlatih →","Setiap langkah bermakna.","Belajar mengikut rentak sendiri. Ulang mana-mana pelajaran.","Kemajuan disimpan dalam pelayar ini.","Ulang kaji & alat belajar"],zh:["每天练一点，进步多一点。","你的物理新冒险","PhyPhy来帮你。让我们一步一步学习。","探索物理世界","测量、能量与动量。","所有章节 →","你的进度","活动","开始学习 →","练习一下？","尝试最多五项活动，配有提示和解释。","开始练习 →","每一步都有意义。","按自己的节奏探索，随时重温课程。","进度保存在此浏览器中。","复习与学习工具"]}[locale];
      const layout=node("div",undefined,"physics-home-layout"),main=node("section",undefined,"physics-home-main"),side=node("aside",undefined,"physics-home-side");
      const greet=node("div",undefined,"physics-home-greeting"),words=node("div");words.append(node("p",copy[0],"eyebrow"),node("h1",copy[1]),node("p",copy[2]));greet.append(words,mascot("phyphy"));main.append(greet);
      const banner=node("section",undefined,"physics-home-banner"),intro=node("div");intro.append(node("small",t("physics").toUpperCase()),node("h2",copy[3]),node("p",copy[4]));banner.append(intro,link("▤", "#learn","physics-guide"));banner.lastChild.setAttribute("aria-label",copy[5]);main.append(banner);
      const recommendation=HahaLearning.recommend(catalog,saved);
      const nextLesson=recommendation?.lesson || next;
      const hasAttempts=catalog.some(l=>HahaLearning.attempts(saved[l.id],l.activityMetadata).length);
      const quick=node("section",undefined,"next-lesson-card");quick.id="next-lesson";
      quick.append(node("p",t("nextStep"),"eyebrow"),node("h2",nextLesson.subchapter),node("p",t("smallGoal")));
      quick.append(link(t(hasAttempts?"continue":"start")+" →",nextLesson.url+(recommendation?"?activity="+encodeURIComponent(recommendation.activity.id):""),"primary"));
      main.append(quick);
      const path=node("div",undefined,"physics-home-path");
      groups.forEach((c,i)=>{const stop=node("div",undefined,"physics-home-stop");stop.style.setProperty("--home-offset",["-50px","55px","-28px"][i%3]);const lessons=catalog.filter(l=>l.chapter===c),finished=lessons.every(l=>{const x=HahaLearning.score(saved[l.id],l.activityMetadata);return x.completed===x.total;});const go=button(finished?"✓":["↗","ϟ","⇄"][i%3],()=>{chapter=c;query="";onlySaved=false;location.hash="learn";},"physics-home-node node-colour-"+i);go.setAttribute("aria-label",t("learn")+": "+chapterLabel(c));go.classList.add("phyphy-trigger");go.replaceChildren(phyphyChess(i%4,finished));stop.append(go,node("strong",chapterLabel(c)),node("small",lessons.length+" "+(locale==="en"&&lessons.length===1?"lesson":t("lessons"))));path.append(stop);});main.append(path);
      const bottom=node("div",undefined,"physics-home-bottom"),bottomText=node("div");bottomText.append(node("strong",copy[12]),node("p",copy[13]));bottom.append(bottomText,link(copy[5],"#learn","primary secondary-home"));main.append(bottom);
      const progress=node("section",undefined,"physics-home-card"),title=node("div",undefined,"physics-side-title");title.append(node("h2",copy[6]),link("↗","#progress"));progress.append(title);const ring=node("div",undefined,"physics-home-ring");ring.style.setProperty("--completion",(total?done/total*100:0)+"%");const count=node("strong",done+" / "+total);count.append(node("small",copy[7]));ring.append(count);progress.append(ring,node("p",copy[14]),link(t("progress")+" →","#progress","primary secondary-home"));side.append(progress);
      const practice=node("section",undefined,"physics-home-card");practice.append(node("span","✎","physics-practice-icon"),node("h2",copy[9]),node("p",copy[10]),link(copy[11],"#practice","primary secondary-home"));side.append(practice);
      const extras=node("div",undefined,"physics-home-extras");extras.append(link(t("review"),"#review"),link(copy[15],"#tools"));side.append(extras);layout.append(main,side);root.append(layout);
    }
    function lessonCard(lesson, saved) {
      const card = node("article", undefined, "lesson-card"),
        top = node("div", undefined, "lesson-top");
      top.append(node("span", String(catalog.indexOf(lesson)+1).padStart(2,"0"), "lesson-step"));
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
        link(displayLesson(lesson), lesson.url),
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
      card.append(detail);
      return card;
    }
    function displayLesson(lesson) {
      const authored=HahaPhysicsNotesContent.lessons.find(item=>item.id===lesson.id);
      return locale==='en'||!authored?lesson.subchapter:authored.section+' · '+localized(authored.title);
    }
    function lessons(saved) {
      heading("learn", "learnDesc");
      const buddy=node("div",undefined,"mascot-note");buddy.append(mascot("phyphy","aha","mascot-small"),node("p",{en:"PhyPhy is ready to explore Physics with you.",ms:"PhyPhy sedia menerokai Fizik bersama anda.",zh:"PhyPhy准备好和你一起探索物理。"}[locale]));root.append(buddy);
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
        const o = node("option", chapterLabel(c));
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
      const lists = node("div", undefined, "learning-chapters");
      const nextStep=button({en:"Find my next lesson ↓",ms:"Cari pelajaran seterusnya ↓",zh:"查找下一课 ↓"}[locale],()=>{query="";chapter="";onlySaved=false;search.value="";choose.value="";sb.setAttribute("aria-pressed","false");paint();const target=document.querySelector("#physics-next-step");if(target){target.open=true;target.scrollIntoView({behavior:"smooth",block:"center"});target.querySelector("summary").focus({preventScroll:true});}},"find-next-step");
      root.append(nextStep,node("p",{en:"Tap a PhyPhy chess piece to open a lesson. Every available lesson is yours to explore.",ms:"Ketik buah catur PhyPhy untuk membuka pelajaran. Semua pelajaran tersedia boleh diterokai.",zh:"点击PhyPhy棋子打开课程。所有可用课程都可以自由探索。"}[locale],"path-help"),lists);
      recommend(saved);
      dashboard(saved);
      function paint() {
        lists.replaceChildren();
        const matches = catalog.filter(
          (l) =>
            (!chapter || l.chapter === chapter) &&
            (!onlySaved || prefs.favorites.includes(l.id)) &&
            (
              l.chapter +
              " " +
              displayLesson(l) + " " + l.subchapter +
              " " +
              l.activityMetadata.map((a) => a.objective).join(" ")
            )
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase()),
        );
        if (!matches.length) lists.append(node("p", t("empty"), "empty"));
        const nextLesson=catalog.find(l=>{const score=HahaLearning.score(saved[l.id],l.activityMetadata);return score.completed<score.total;});
        for (const c of [...new Set(matches.map((l) => l.chapter))]) {
          const section = node("section", undefined, "chapter-group physics-path-chapter");
          section.dataset.unit=String([...new Set(catalog.map(l=>l.chapter))].indexOf(c)+1);
          const banner=node("div",undefined,"path-chapter-banner");
          banner.append(node("span",String([...new Set(catalog.map(l=>l.chapter))].indexOf(c)+1).padStart(2,"0"),"path-unit-number"),node("h2",chapterLabel(c)));
          section.append(banner);
          const trail=node("div",undefined,"physics-trail");
          const chapterLessons=matches.filter(l=>l.chapter===c);
          chapterLessons.forEach((lesson,index)=>{
            const score=HahaLearning.score(saved[lesson.id],lesson.activityMetadata),complete=score.completed===score.total&&score.total>0,current=lesson.id===nextLesson?.id;
            const stop=node("details",undefined,"physics-stop"+(complete?" is-complete":"")+(current?" is-current":""));
            stop.style.setProperty("--step-offset",["-65px","0px","65px","0px"][index%4]);
            const summary=node("summary",undefined,"path-node-summary");
            summary.setAttribute("aria-label",displayLesson(lesson)+" · "+(complete?t("completed"):current?t("learn"):t("open")));
            const circle=node("span",complete?"✓":current?"★":String(catalog.indexOf(lesson)+1),"path-node-circle");
            circle.setAttribute("aria-hidden","true");
            summary.classList.add("phyphy-trigger");circle.classList.add("phyphy-node");circle.replaceChildren(phyphyChess(catalog.indexOf(lesson)%4,complete));summary.append(circle,node("strong",displayLesson(lesson),"path-node-title"),node("small",score.completed+" / "+score.total+" "+t("completed"),"path-node-progress"));
            if(current){summary.setAttribute("aria-current","step");stop.id="physics-next-step";}
            stop.append(summary);
            const panel=node("div",undefined,"path-node-panel");panel.append(lessonCard(lesson,saved));stop.append(panel);
            stop.addEventListener("toggle",()=>{if(!stop.open)summary.classList.remove("phyphy-reacting");if(stop.open)trail.querySelectorAll(".physics-stop").forEach(other=>{if(other!==stop)other.open=false;});});
            const actions=node("nav",undefined,"lesson-entry-actions");actions.setAttribute("aria-label",displayLesson(lesson));actions.style.setProperty("--step-offset",["-65px","0px","65px","0px"][index%4]);
            actions.append(link(t("notes"),'#lesson/'+encodeURIComponent(lesson.id),'primary'),link({en:'Practise lesson',ms:'Latih tubi pelajaran',zh:'课程练习'}[locale],lesson.url,'secondary'));
            trail.append(stop,actions);
          });
          section.append(trail);lists.append(section);
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
      const panel = node("section", undefined, "panel physics-practice-picker"),
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
      if(HahaPhysicsNotesContent.lessons.some(item=>item.id===id)){
        root.append(link('← '+t('back'),'#learn','back-link'));
        HahaPhysicsNotes.render(root,id,locale,catalog);
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
      HahaPhysicsNotes.render(root, id, locale, catalog);
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
      document.body.dataset.route=route;
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
