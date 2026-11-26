/**
 * Проверка вёрстки на экранах телефонов.
 * Открывает собранную игру (dist/index.html) в Google Chrome в нескольких размерах экрана,
 * проходит по всем экранам и типам заданий, делает скриншоты и ищет элементы, вылезающие за экран.
 *
 * Запуск: npm run check:mobile   (результат — в папке mobile-screens/)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'dist/index.html'));
const OUT = path.join(ROOT, 'mobile-screens');
const BASE = 'http://kotik.test/';

const VIEWPORTS = [
  { name: '360x740-android-small', width: 360, height: 740 },
  { name: '412x915-android', width: 412, height: 915 },
  { name: '800x360-landscape', width: 800, height: 360 },
];

/** Сохранение для проверки: котик, монеты, покупки, всё открыто */
const SAVE = {
  version: 1,
  state: {
    profile: { catName: 'Мурзик', fur: 'ginger' },
    coins: 999,
    owned: ['ginger', 'party', 'round', 'bow', 'home-bed', 'home-bowl', 'home-tree', 'home-sofa', 'home-aquarium', 'toy-yarn', 'toy-box', 'toy-ball'],
    equipped: { hat: 'party' },
    lessonStars: { 'home-1': 3, 'home-2': 2 },
    bossDefeated: {},
    srs: { cat: { box: 1, due: 0, seen: 1, wrong: 1 }, dog: { box: 2, due: 0, seen: 2, wrong: 0 }, milk: { box: 1, due: 0, seen: 1, wrong: 0 }, fish: { box: 1, due: 0, seen: 1, wrong: 0 } },
    streak: { lastDay: 0, count: 3 },
    settings: { rate: 0.85, voiceName: null, muted: true, unlockAll: true },
    savedSessions: {},
    customThemes: [],
  },
};

/** Ищет элементы, которые торчат за правый/левый край экрана и при этом не обрезаны контейнером */
function findOverflow() {
  const W = window.innerWidth;
  const clippedBy = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.overflowX !== 'visible' || s.overflow === 'hidden') {
        const r = p.getBoundingClientRect();
        if (r.left >= -1 && r.right <= W + 1) return true;
      }
    }
    return false;
  };
  const describe = (el) => {
    const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '';
    const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50);
    return `${el.tagName.toLowerCase()}${cls} «${text}»`;
  };
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.right <= W + 2 && r.left >= -2) continue;
    if (clippedBy(el)) continue;
    const parent = el.parentElement?.getBoundingClientRect();
    if (parent && (parent.right > W + 2 || parent.left < -2) && !clippedBy(el.parentElement)) continue; // сообщаем только верхний
    bad.push(`${describe(el)} → left ${Math.round(r.left)}, right ${Math.round(r.right)} (экран ${W})`);
  }
  return { pageScrollWidth: document.documentElement.scrollWidth, width: W, bad: bad.slice(0, 10) };
}

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (e) {
    console.error('Не удалось запустить Google Chrome. Он установлен?\n', e.message.split('\n')[0]);
    process.exit(1);
  }
  const report = {};

  for (const vp of VIEWPORTS) {
    const dir = path.join(OUT, vp.name);
    fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, locale: 'ru-RU' });
    await ctx.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.host !== 'kotik.test') return route.abort();
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML });
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    let n = 0;
    const results = [];

    const open = async (hash, save = SAVE) => {
      await page.goto('about:blank');
      await page.goto(BASE);
      await page.evaluate((s) => {
        localStorage.clear();
        if (s) localStorage.setItem('kitty-english-v1', JSON.stringify(s));
      }, save);
      await page.goto(BASE + hash);
      await page.reload();
      await page.waitForTimeout(1200);
    };
    const shot = async (name) => {
      const file = `${String(++n).padStart(2, '0')}-${name}.png`;
      await page.screenshot({ path: path.join(dir, file) });
      const overflow = await page.evaluate(findOverflow);
      results.push({ file, ...overflow });
    };
    const click = async (text) => {
      const el = page.getByText(text, { exact: false }).first();
      if (await el.count()) await el.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(700);
    };

    // онбординг
    await open('', null);
    await shot('onboarding');
    await click('Начать приключение');
    await shot('onboarding-fur');

    // карта: тематический мир, грамматический мир и его правила
    await open('#/map/0');
    await shot('map-home');
    await page.evaluate(() => document.querySelector('.screen')?.scrollTo(0, 99999));
    await page.waitForTimeout(400);
    await shot('map-home-bottom');
    await open('#/map/12');
    await shot('map-far-world-strip');
    await open('#/map/1');
    await shot('map-grammar');
    await click('Правила');
    await shot('map-rules');
    await open('#/map/0');
    await page.locator('button', { hasText: /^3$/ }).first().click().catch(() => {});
    await page.waitForTimeout(600);
    await shot('map-lesson-card');

    // знакомство: правило и слово
    await open('#/lesson/be-1');
    await shot('intro-rule');
    await click('Понятно');
    await shot('intro-word');

    // все задания уроков — по одному скриншоту на каждый тип
    const seen = new Set();
    for (const lessonId of ['home-3', 'be-2', 'plurals-3', 'market-5']) {
      for (let i = 0; i < 20; i++) {
        await open(`#/lesson/${lessonId}/${i}`);
        const title = ((await page.locator('h2').first().textContent().catch(() => '')) || '').trim();
        if (!title || seen.has(title)) continue;
        seen.add(title);
        await shot(`ex-${lessonId}-${i}`);
      }
    }
    // ответ с подсказкой внизу (неправильный выбор)
    await open('#/lesson/home-1/0');
    await page.locator('.option').nth(0).click().catch(() => {});
    await page.locator('.option').nth(1).click().catch(() => {});
    await page.waitForTimeout(900);
    await shot('ex-feedback');

    // босс
    await open('#/boss/be');
    await shot('boss-intro');
    await click('В бой');
    await shot('boss-fight');

    // остальные экраны
    for (const [hash, name] of [
      ['#/shop/hat', 'shop-hats'],
      ['#/shop/interior', 'shop-interior'],
      ['#/home', 'home'],
      ['#/album', 'album'],
      ['#/review', 'review'],
      ['#/parent', 'parent'],
    ]) {
      await open(hash);
      await shot(name);
    }
    await open('#/shop/toy');
    await page.locator('.scroll').last().evaluate((el) => el.scrollTo(0, 99999)).catch(() => {});
    await page.waitForTimeout(400);
    await shot('shop-scrolled');
    await open('#/home');
    await click('💡');
    await shot('home-hint');
    await open('#/map/0');
    await click('⚙️');
    await shot('parent-gate');
    await open('#/map/0');
    await click('📲');
    await shot('install-help');

    report[vp.name] = { errors, results };
    await ctx.close();
  }
  await browser.close();

  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  let problems = 0;
  for (const [vp, { errors, results }] of Object.entries(report)) {
    console.log(`\n== ${vp}`);
    for (const r of results) {
      const flag = r.bad.length || r.pageScrollWidth > r.width + 1;
      if (flag) {
        problems++;
        console.log(`  ⚠️  ${r.file}: ширина страницы ${r.pageScrollWidth}/${r.width}`);
        r.bad.forEach((b) => console.log(`       ${b}`));
      }
    }
    if (errors.length) console.log('  Ошибки JS:', errors);
  }
  console.log(`\nСкриншоты: ${OUT}\nЭкранов с вылезающими элементами: ${problems}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
