export const DEFAULT_LANGUAGE = "de";
export const SUPPORTED_LANGUAGES = Object.freeze(["de", "en", "ru", "uk", "vi"]);

export function normalizedLanguage(value) {
  const language = String(value || "").trim().toLowerCase().split("-")[0];
  return SUPPORTED_LANGUAGES.includes(language) ? language : null;
}

export function resolveInitialLanguage({
  search = "",
  browserLanguages = [],
  browserLanguage = ""
} = {}) {
  const queryLanguage = normalizedLanguage(new URLSearchParams(search).get("lang"));
  if (queryLanguage) {
    return queryLanguage;
  }

  const languagePreferences = [
    ...Array.from(browserLanguages || []),
    browserLanguage
  ];

  for (const preference of languagePreferences) {
    const language = normalizedLanguage(preference);
    if (language) {
      return language;
    }
  }

  return DEFAULT_LANGUAGE;
}
