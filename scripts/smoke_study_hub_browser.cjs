const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const base = process.env.SITE_URL || "http://127.0.0.1:8765/";
  const catalog = JSON.parse(fs.readFileSync("preview/catalog.json", "utf8"));
  const lesson = catalog[0],
    pkg = JSON.parse(
      fs.readFileSync(
        "preview/" + lesson.url.replace("index.html", "content/package.json"),
        "utf8",
      ),
    );
  const browser = await chromium.launch();
  try {
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } }),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base);
      await page.locator(".home-actions").waitFor();
      assert.equal(await page.locator(".home-action").count(), 4);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      await page.getByRole("link", { name: "Learn →", exact: true }).click();
      await page.locator(".lesson-card").first().waitFor();
      assert.equal(await page.locator(".lesson-card").count(), catalog.length);
      await page.locator("#lesson-search").fill("definitely-no-such-lesson");
      assert.equal(await page.locator(".lesson-card").count(), 0);
      assert(await page.locator(".empty").isVisible());
      await page.locator("#lesson-search").fill("");
      await page.locator(".bookmark").first().click();
      assert.equal(
        await page.locator(".bookmark").first().getAttribute("aria-pressed"),
        "true",
      );
      await page
        .getByRole("button", { name: "Saved lessons", exact: true })
        .click();
      assert.equal(await page.locator(".lesson-card").count(), 1);
      await page.reload();
      assert.equal(
        await page.locator(".bookmark").first().getAttribute("aria-pressed"),
        "true",
      );
      await page
        .getByRole("button", { name: "Concept overview", exact: true })
        .first()
        .click();
      await page
        .getByRole("heading", { name: "What you will explore", exact: true })
        .waitFor();
      assert(
        await page
          .getByRole("link", { name: "Open lesson", exact: true })
          .isVisible(),
      );
      await page
        .getByRole("link", { name: "Study tools", exact: true })
        .click();
      await page.locator("#setting-theme").selectOption("dark");
      await page.locator("#setting-size").selectOption("large");
      await page.reload();
      await page.locator("#setting-theme").waitFor();
      assert.equal(
        await page.locator("body").getAttribute("data-theme"),
        "dark",
      );
      assert.equal(
        await page.locator("body").getAttribute("data-size"),
        "large",
      );
      for (const locale of ["ms", "zh", "en"]) {
        await page.locator("#locale").selectOption(locale);
        assert.equal(await page.locator("html").getAttribute("lang"), locale);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
      }
      await page.goto(base + "#practice");
      await page.locator("#practice-difficulty").selectOption("easy");
      const href = await page.locator("#begin-practice").getAttribute("href"),
        ids = new URL(href, base).searchParams.get("practice").split(",");
      assert.equal(ids.length, 5);
      assert(
        ids.every(
          (id) => pkg.activities.find((a) => a.id === id).difficulty === "easy",
        ),
      );
      const outside = pkg.activities.find((a) => !ids.includes(a.id));
      await page.evaluate(
        ({ lesson, outside }) =>
          localStorage.setItem(
            "haha:progress:v1:" + lesson.id,
            JSON.stringify({
              version: 2,
              attempts: [
                {
                  id: "existing-evidence",
                  activityId: outside.id,
                  result: "correct",
                  assisted: false,
                  timestamp: new Date().toISOString(),
                },
              ],
              completed: [outside.id],
              independent: [outside.id],
            }),
          ),
        { lesson, outside },
      );
      await page.locator("#begin-practice").click();
      await page.locator(".question").waitFor();
      assert.equal(
        await page.locator("body").getAttribute("data-theme"),
        "dark",
      );
      for (let i = 0; i < 5; i++) {
        assert.equal(
          (await page.locator(".question").innerText())
            .replace(/\s+/g, " ")
            .trim(),
          pkg.activities
            .find((a) => a.id === ids[i])
            .prompt.en.replace(/\s+/g, " ")
            .trim(),
        );
        await page.locator("#skip").click();
      }
      await page.locator(".session-review").waitFor();
      assert.equal(await page.locator(".session-review p").count(), 5);
      const saved = await page.evaluate(
        (id) => JSON.parse(localStorage.getItem("haha:progress:v1:" + id)),
        lesson.id,
      );
      assert(saved.attempts.some((a) => a.id === "existing-evidence"));
      assert.equal(saved.attempts.filter((a) => a.result === "skip").length, 5);
      await page.locator(".study-back").click();
      await page.locator(".home-actions").waitFor();
      const mcq = pkg.activities.find((a) => a.type === "mcq"),
        correct = mcq.answerKey.correct;
      await page.goto(
        new URL(lesson.url + "?activity=" + encodeURIComponent(mcq.id), base)
          .href,
      );
      await page.locator(".choice").first().waitFor();
      await page.locator("#hint").click();
      await page.locator('.choice[data-value="' + correct + '"]').click();
      await page.locator("#check").click();
      await page.locator(".reasoning-review").waitFor();
      await page.goto(base + "#review");
      await page.locator(".review-row").first().waitFor();
      assert(
        await page
          .getByRole("link", { name: "Try independently", exact: true })
          .count(),
      );
      await page.goto(base + "#progress");
      await page.locator(".chart").waitFor();
      assert.equal(await page.locator(".chart-day").count(), 7);
      assert(await page.locator(".achievement").count());
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      assert.deepEqual(errors, []);
      await page.close();
    }
    const page = await browser.newPage();
    await page.addInitScript(() =>
      Object.defineProperty(window, "localStorage", {
        get() {
          throw Error("blocked");
        },
      }),
    );
    await page.goto(base + "#tools");
    await page.locator("#setting-theme").selectOption("dark");
    assert.match(
      await page.locator("#status").innerText(),
      /Storage is unavailable/,
    );
    await page.close();
    console.log(
      "Study hub browser passed: home, navigation, filters, saved lessons, concept overviews, settings/locales, focused sets, history preservation, review, milestones, charts, mobile and blocked storage.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
