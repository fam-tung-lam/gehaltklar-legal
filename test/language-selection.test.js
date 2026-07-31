import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  DEFAULT_LANGUAGE,
  normalizedLanguage,
  resolveInitialLanguage
} from "../language-selection.js";

test("a supported query parameter takes precedence over browser preferences", () => {
  assert.equal(resolveInitialLanguage({
    search: "?lang=ru",
    browserLanguages: ["en-US"],
    browserLanguage: "en-US"
  }), "ru");
});

test("regional language tags resolve to a supported base language", () => {
  assert.equal(normalizedLanguage("uk-UA"), "uk");
  assert.equal(normalizedLanguage("vi-VN"), "vi");
});

test("the first supported browser preference is used without a query parameter", () => {
  assert.equal(resolveInitialLanguage({
    browserLanguages: ["fr-FR", "vi-VN", "en-US"],
    browserLanguage: "fr-FR"
  }), "vi");
});

test("navigator.language is used when navigator.languages is empty", () => {
  assert.equal(resolveInitialLanguage({
    browserLanguages: [],
    browserLanguage: "ru-RU"
  }), "ru");
});

test("German is used when no browser preference is supported", () => {
  assert.equal(resolveInitialLanguage({
    browserLanguages: ["fr-FR", "es-ES"],
    browserLanguage: "fr-FR"
  }), DEFAULT_LANGUAGE);
});

test("the app bar keeps language and theme controls available", async () => {
  const page = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(page, /<header class="app-bar">/);
  assert.match(page, /<a class="wordmark" href="#top">Gehalt<span>Klar<\/span><\/a>/);
  assert.match(page, /<select id="language-select"/);
  assert.match(page, /🇩🇪 Deutsch/);
  assert.match(page, /🇬🇧 English/);
  assert.match(page, /🇷🇺 Русский/);
  assert.match(page, /🇺🇦 Українська/);
  assert.match(page, /🇻🇳 Tiếng Việt/);
  assert.match(page, /position: sticky;/);
  assert.match(page, /class="language-select__globe"/);
  assert.match(page, /id="theme-button"/);
  assert.match(page, /aria-label="Helles oder dunkles Design umschalten"/);
  assert.match(page, /gk_legal_theme/);
  assert.match(page, /data-i18n="notCollectedTitle"/);
  assert.doesNotMatch(page, /fonts\.googleapis\.com|googletagmanager\.com/);
});
