import {
  getRandomAffirmation,
  getAllAffirmations,
  getRandomAffirmationForLanguage,
  getUserLanguage,
  getSupportedLanguages,
  isLanguageSupported,
} from "../app/services/affirmationService"

describe("AffirmationService", () => {
  describe("getRandomAffirmation", () => {
    it("should return a non-empty string", () => {
      const affirmation = getRandomAffirmation()
      expect(typeof affirmation).toBe("string")
      expect(affirmation.length).toBeGreaterThan(0)
    })

    it("should return different affirmations on multiple calls", () => {
      const affirmations = new Set()

      // Get 10 random affirmations
      for (let i = 0; i < 10; i++) {
        affirmations.add(getRandomAffirmation())
      }

      // Should have some variety (at least 2 different affirmations)
      expect(affirmations.size).toBeGreaterThanOrEqual(2)
    })
  })

  describe("getAllAffirmations", () => {
    it("should return an array of affirmations", () => {
      const affirmations = getAllAffirmations()
      expect(Array.isArray(affirmations)).toBe(true)
      expect(affirmations.length).toBeGreaterThan(0)
    })

    it("should return exactly 100 affirmations", () => {
      const affirmations = getAllAffirmations()
      expect(affirmations.length).toBe(100)
    })

    it("should contain only non-empty strings", () => {
      const affirmations = getAllAffirmations()
      affirmations.forEach((affirmation) => {
        expect(typeof affirmation).toBe("string")
        expect(affirmation.length).toBeGreaterThan(0)
      })
    })
  })

  describe("getRandomAffirmationForLanguage", () => {
    it("should return affirmation for supported language", () => {
      const affirmation = getRandomAffirmationForLanguage("es")
      expect(typeof affirmation).toBe("string")
      expect(affirmation.length).toBeGreaterThan(0)
    })

    it("should fallback to English for unsupported language", () => {
      const affirmation = getRandomAffirmationForLanguage("xyz")
      expect(typeof affirmation).toBe("string")
      expect(affirmation.length).toBeGreaterThan(0)
      // Should be a valid English affirmation (fallback behavior)
      expect(affirmation.length).toBeGreaterThan(10)
    })

    it("should handle case insensitive language codes", () => {
      const affirmation1 = getRandomAffirmationForLanguage("ES")
      const affirmation2 = getRandomAffirmationForLanguage("es")

      expect(typeof affirmation1).toBe("string")
      expect(typeof affirmation2).toBe("string")
      expect(affirmation1.length).toBeGreaterThan(0)
      expect(affirmation2.length).toBeGreaterThan(0)
    })
  })

  describe("getUserLanguage", () => {
    it("should return a supported language code", () => {
      const language = getUserLanguage()
      expect(typeof language).toBe("string")
      expect(language.length).toBeGreaterThan(0)
      expect(isLanguageSupported(language)).toBe(true)
    })
  })

  describe("getSupportedLanguages", () => {
    it("should return array of 18 supported languages", () => {
      const languages = getSupportedLanguages()
      expect(Array.isArray(languages)).toBe(true)
      expect(languages.length).toBe(18)
    })

    it("should include English as fallback", () => {
      const languages = getSupportedLanguages()
      expect(languages).toContain("en")
    })

    it("should include major world languages", () => {
      const languages = getSupportedLanguages()
      const expectedLanguages = [
        "en",
        "es",
        "fr",
        "de",
        "pt",
        "it",
        "ja",
        "ko",
        "zh",
        "ar",
        "hi",
        "ru",
      ]

      expectedLanguages.forEach((lang) => {
        expect(languages).toContain(lang)
      })
    })
  })

  describe("isLanguageSupported", () => {
    it("should return true for supported languages", () => {
      expect(isLanguageSupported("en")).toBe(true)
      expect(isLanguageSupported("es")).toBe(true)
      expect(isLanguageSupported("fr")).toBe(true)
      expect(isLanguageSupported("ja")).toBe(true)
    })

    it("should return false for unsupported languages", () => {
      expect(isLanguageSupported("xyz")).toBe(false)
      expect(isLanguageSupported("")).toBe(false)
      expect(isLanguageSupported("unknown")).toBe(false)
    })

    it("should handle case insensitive input", () => {
      expect(isLanguageSupported("EN")).toBe(true)
      expect(isLanguageSupported("Es")).toBe(true)
      expect(isLanguageSupported("FR")).toBe(true)
    })
  })

  describe("Language-specific content validation", () => {
    const testLanguages = ["en", "es", "fr", "de", "ja", "ko", "zh", "ar", "hi"]

    testLanguages.forEach((lang) => {
      it(`should have meaningful content for ${lang}`, () => {
        const affirmation = getRandomAffirmationForLanguage(lang)

        // Should not be empty or just whitespace
        expect(affirmation.trim().length).toBeGreaterThan(0)

        // Should be reasonably long (meaningful content)
        expect(affirmation.length).toBeGreaterThan(10)

        // Should not contain placeholder text
        expect(affirmation.toLowerCase()).not.toContain("lorem")
        expect(affirmation.toLowerCase()).not.toContain("ipsum")
        expect(affirmation.toLowerCase()).not.toContain("placeholder")
      })
    })
  })

  describe("Error handling", () => {
    it("should handle null/undefined language gracefully", () => {
      // @ts-ignore - Testing runtime behavior
      const affirmation1 = getRandomAffirmationForLanguage(null)
      // @ts-ignore - Testing runtime behavior
      const affirmation2 = getRandomAffirmationForLanguage(undefined)

      expect(typeof affirmation1).toBe("string")
      expect(typeof affirmation2).toBe("string")
      expect(affirmation1.length).toBeGreaterThan(0)
      expect(affirmation2.length).toBeGreaterThan(0)
    })
  })
})
