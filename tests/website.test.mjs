import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const websiteScript = await readFile(path.join(projectRoot, "docs", "app.js"), "utf8");

const createElement = (dataset = {}) => {
  const attributes = new Map();
  const listeners = new Map();
  return {
    dataset,
    textContent: "",
    href: "",
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name); },
    addEventListener(name, listener) { listeners.set(name, listener); },
    click() { listeners.get("click")?.(); },
  };
};

const loadWebsite = ({ url = "https://example.test/", savedLanguage } = {}) => {
  const parsedUrl = new URL(url);
  const buttons = {
    zh: createElement({ language: "zh" }),
    en: createElement({ language: "en" }),
  };
  const copyElements = ["title", "download", "verified"].map((copy) => createElement({ copy }));
  const ariaElements = [createElement({ ariaCopy: "factsLabel" })];
  const elements = {
    "#subscribe-link": createElement(),
    "#download-link": createElement(),
    "#manual-url": createElement(),
  };
  const storage = new Map();
  if (savedLanguage !== undefined) storage.set("ntpu-calendar-language", savedLanguage);
  let replacedUrl;

  const context = {
    URL,
    URLSearchParams,
    document: {
      documentElement: { lang: "" },
      title: "",
      querySelectorAll(selector) {
        if (selector === "[data-copy]") return copyElements;
        if (selector === "[data-aria-copy]") return ariaElements;
        if (selector === "[data-language]") return Object.values(buttons);
        return [];
      },
      querySelector(selector) { return elements[selector]; },
    },
    history: { replaceState(_state, _title, nextUrl) { replacedUrl = String(nextUrl); } },
    localStorage: {
      getItem(key) { return storage.get(key) ?? null; },
      setItem(key, value) { storage.set(key, value); },
    },
    window: { location: { href: url, search: parsedUrl.search } },
  };

  vm.runInNewContext(websiteScript, context);
  return { context, buttons, copyElements, ariaElements, elements, storage, get replacedUrl() { return replacedUrl; } };
};

test("first visit defaults to Chinese and selects the Chinese feed", () => {
  const page = loadWebsite();
  assert.equal(page.context.document.documentElement.lang, "zh-Hant");
  assert.equal(page.elements["#download-link"].href, "ntpu-115-zh.ics");
  assert.equal(page.elements["#subscribe-link"].href, "webcal://joshua-fy-hsu.github.io/ntpu-days-off-calendar/ntpu-115-zh.ics");
  assert.equal(page.buttons.zh.getAttribute("aria-pressed"), "true");
});

test("English selection changes every calendar target to the English feed", () => {
  const page = loadWebsite();
  page.buttons.en.click();
  assert.equal(page.context.document.documentElement.lang, "en");
  assert.equal(page.elements["#download-link"].href, "ntpu-115-en.ics");
  assert.match(page.elements["#subscribe-link"].href, /ntpu-115-en\.ics$/);
  assert.match(page.elements["#manual-url"].textContent, /ntpu-115-en\.ics$/);
  assert.equal(page.storage.get("ntpu-calendar-language"), "en");
  assert.match(page.replacedUrl, /\?lang=en$/);
});

test("URL language overrides the saved preference", () => {
  const page = loadWebsite({ url: "https://example.test/?lang=en", savedLanguage: "zh" });
  assert.equal(page.context.document.documentElement.lang, "en");
  assert.equal(page.elements["#download-link"].href, "ntpu-115-en.ics");
});

test("invalid saved language safely falls back to Chinese", () => {
  const page = loadWebsite({ savedLanguage: "invalid" });
  assert.equal(page.context.document.documentElement.lang, "zh-Hant");
  assert.equal(page.buttons.zh.getAttribute("aria-pressed"), "true");
});
