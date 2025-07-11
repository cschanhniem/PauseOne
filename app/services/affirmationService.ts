import * as Localization from "expo-localization"

// Supported languages with their affirmation files
const SUPPORTED_LANGUAGES = {
  en: () => require("../i18n/affirmations/en.json"),
  es: () => require("../i18n/affirmations/es.json"),
  fr: () => require("../i18n/affirmations/fr.json"),
  de: () => require("../i18n/affirmations/de.json"),
  pt: () => require("../i18n/affirmations/pt.json"),
  it: () => require("../i18n/affirmations/it.json"),
  ja: () => require("../i18n/affirmations/ja.json"),
  ko: () => require("../i18n/affirmations/ko.json"),
  zh: () => require("../i18n/affirmations/zh.json"),
  ar: () => require("../i18n/affirmations/ar.json"),
  hi: () => require("../i18n/affirmations/hi.json"),
  ru: () => require("../i18n/affirmations/ru.json"),
  nl: () => require("../i18n/affirmations/nl.json"),
  pl: () => require("../i18n/affirmations/pl.json"),
  sv: () => require("../i18n/affirmations/sv.json"),
  no: () => require("../i18n/affirmations/no.json"),
  da: () => require("../i18n/affirmations/da.json"),
  fi: () => require("../i18n/affirmations/fi.json"),
} as const

type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES
const FALLBACK_LANGUAGE: SupportedLanguage = "en"

interface AffirmationData {
  affirmations: string[]
}

/**
 * Detects the user's preferred language based on device locale
 * Falls back to English if the detected language is not supported
 */
function detectUserLanguage(): SupportedLanguage {
  try {
    const systemLocales = Localization.getLocales()

    // Check each system locale to find a supported language
    for (const locale of systemLocales) {
      const languageCode = locale.languageTag.split("-")[0].toLowerCase() as SupportedLanguage

      if (SUPPORTED_LANGUAGES[languageCode]) {
        return languageCode
      }
    }

    // If no supported language found, return fallback
    return FALLBACK_LANGUAGE
  } catch (error) {
    console.warn("Error detecting user language:", error)
    return FALLBACK_LANGUAGE
  }
}

/**
 * Loads affirmations for the specified language
 * Falls back to English if the language is not supported or fails to load
 */
function loadAffirmations(languageCode: SupportedLanguage): string[] {
  try {
    const loader = SUPPORTED_LANGUAGES[languageCode]
    if (!loader) {
      console.warn(`Language ${languageCode} not supported, falling back to ${FALLBACK_LANGUAGE}`)
      return loadAffirmations(FALLBACK_LANGUAGE)
    }

    const data: AffirmationData = loader()

    if (!data.affirmations || !Array.isArray(data.affirmations) || data.affirmations.length === 0) {
      console.warn(
        `Invalid affirmation data for ${languageCode}, falling back to ${FALLBACK_LANGUAGE}`,
      )
      return loadAffirmations(FALLBACK_LANGUAGE)
    }

    return data.affirmations
  } catch (error) {
    console.warn(`Error loading affirmations for ${languageCode}:`, error)

    // If we're already trying the fallback language and it fails, return a default affirmation
    if (languageCode === FALLBACK_LANGUAGE) {
      return ["You are enough."]
    }

    return loadAffirmations(FALLBACK_LANGUAGE)
  }
}

/**
 * Gets a random affirmation in the user's preferred language
 */
export function getRandomAffirmation(): string {
  const userLanguage = detectUserLanguage()
  const affirmations = loadAffirmations(userLanguage)

  if (affirmations.length === 0) {
    return "You are enough."
  }

  const randomIndex = Math.floor(Math.random() * affirmations.length)
  return affirmations[randomIndex]
}

/**
 * Gets all affirmations for the user's preferred language
 */
export function getAllAffirmations(): string[] {
  const userLanguage = detectUserLanguage()
  return loadAffirmations(userLanguage)
}

/**
 * Gets a random affirmation for a specific language
 */
export function getRandomAffirmationForLanguage(languageCode: string): string {
  if (!languageCode || typeof languageCode !== "string") {
    return getRandomAffirmation()
  }

  const normalizedLanguageCode = languageCode.toLowerCase() as SupportedLanguage
  const affirmations = loadAffirmations(normalizedLanguageCode)

  if (affirmations.length === 0) {
    return "You are enough."
  }

  const randomIndex = Math.floor(Math.random() * affirmations.length)
  return affirmations[randomIndex]
}

/**
 * Gets the detected user language code
 */
export function getUserLanguage(): string {
  return detectUserLanguage()
}

/**
 * Gets list of all supported language codes
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(SUPPORTED_LANGUAGES)
}

/**
 * Checks if a language is supported
 */
export function isLanguageSupported(languageCode: string): boolean {
  return languageCode.toLowerCase() in SUPPORTED_LANGUAGES
}
