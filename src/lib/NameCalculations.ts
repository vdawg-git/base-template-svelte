import { pipe } from "fp-ts/lib/function"
import * as RA from "fp-ts/lib/ReadonlyArray"
import { words as toWords } from "fp-ts-std/String"
import { reduceNumber, sumUpNumbers, sumUpStringedNumbers } from "./Pures"
import type { ICalculatedName } from "#types/Types"

// prettier-ignore
export const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",]
export const vowels = ["a", "e", "i", "o", "u", "y"] as const
// prettier-ignore
export const consonants = ["b","c","d","f","g","j","k","l","m","n","p","q","s","t","v","x","z","h","r","w","y"] as const
/**
 *  Y is a vowel, when it is preceded by A, E, I, or O and sounds as one sound
 *  For example in Hayde, Doyle or Raymond
 */
const vowelRegex = /ay|ey|oy|uy|iy|[aeiou]/gi

const consonantRegex = /[^\sa-z]/gi

/**
 *
 * @param name
 * @returns
 */
export function calculateName(name: string): ICalculatedName {
  const cleanedName = cleanUpString(name)

  return {
    name,
    expression: calculateExpression(cleanedName),
    soulUrge: calculateSouleUrge(cleanedName),
    personality: calculatePersonality(cleanedName),
  }
}

/**
 * @param name The name to be calculated. Can contain spaces. Currently only latin characters or numbers.
 * @returns The numerological value
 */
function calculateExpression(name: string): number {
  return reduceWords(name)
}

/**
 * Based on the vowels in the name
 */
function calculateSouleUrge(name: string) {
  return pipe(name, filterVowels, reduceWords)
}

/**
 * Also referred to as `Secret Self`.
 * Based on the consonants in the name.
 */
function calculatePersonality(name: string) {
  return pipe(name, filterConsonants, reduceWords)
}

/**
 * Removes all non vowels from the string, but keeps whitespace intact
 * @example "Arr Foo Bar" => "A oo a"
 */
function filterVowels(string: string): string {
  return pipe(
    string,
    toWords,
    RA.map((word) => word.match(vowelRegex)),
    RA.map((matches) => (matches ?? []).join("")),
    (words) => words.join(" ")
  )
}

/**
 * Removes all non consonants from the string, but keeps whitespace intact
 * @example "Arr Foo Bar" => "rr F Br"
 */
function filterConsonants(string: string): string {
  return string.replace(vowelRegex, "").replace(consonantRegex, "")
}

/**
 * Get the value of a word without reducing the letters.
 *
 * For example "K" has a value of 11 and it will not get reduced to 2.
 *
 * Then all totals get reduced together.
 * @param word An array of strings without spaces
 * @returns The numerological value of the given strings
 */
function getWordValueWithLettersUnreduced(word: string[]): number {
  const result = word
    .map(getLetterValueUnreduced)
    .reduce(sumUpStringedNumbers, 0)

  return result
}

/**
 *
 * @param letter One letter as a string, can also be a number like "123"
 */
function getLetterValueUnreduced(letter: string): number {
  if (!Number.isNaN(Number(letter))) return Number(letter)

  const result = letter.toLowerCase().codePointAt(0) - 96

  return result
}

/**
 * @example
 * "Hi there" -> [ ["H", "i"] , ["T","h","e","r","e"] ]
 */
function convertWordsToLetterArrays(name: string): readonly string[][] {
  return pipe(
    name,
    toWords,
    RA.map((word) => [...word])
  )
}

/**
 * Convert some characters to their numerological equivalent (like "ö" to "oe") and remove special characters.
 * Keeps numbers like "123"
 */
export function cleanUpString(string: string): string {
  return string
    .replace(/ß/gi, "ss")
    .replace(/ä/gi, "ae")
    .replace(/ü/gi, "ue")
    .replace(/ö/gi, "oe")
    .replace(/([^\da-z]+)/gi, " ")
}

/**
 * Reduces a string of a word or words like "Foo Bar" to its numerological value.
 * @param string
 * @returns The numerological value
 */
function reduceWords(string: string): number {
  return pipe(
    string,
    convertWordsToLetterArrays,
    RA.map(getWordValueWithLettersUnreduced),
    RA.reduce(0, sumUpNumbers),
    reduceNumber
  )
}

if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest

  describe("cleanUpString", () => {
    test.each([
      ["Fünf", "Fuenf"],
      ["ä-ö üüü", "ae oe ueueue"],
      ["123", "123"],
    ])(`"%s"`, (input, expectedValue) => {
      expect(cleanUpString(input)).toEqual(expectedValue)
    })

    test("unhappy", () => {
      expect(cleanUpString("***")).not.toBe("***")
    })
  })

  describe("expression", () => {
    test("happy", () => {
      expect(calculateExpression("A")).toEqual(1)
    })

    test("happy 2", () => {
      expect(calculateExpression("B")).toEqual(2)
    })

    test("spacing", () => {
      expect(calculateExpression("A B")).toEqual(3)
    })

    test("unhappy", () => {
      expect(() => calculateExpression("***")).toThrowError(/Invalid letter/)
    })
  })

  describe("calculateName", () => {
    test("happy", () => {
      const expected: ICalculatedName = {
        name: "Foo Bar",
        expression: 3,
        personality: 8,
        soulUrge: 4,
      }

      expect(calculateName(expected.name)).toEqual(expected)
    })

    test("with Umlaute", () => {
      const expected: ICalculatedName = {
        name: "Föö Bär",
        expression: 9,
        personality: 8,
        soulUrge: 1,
      }

      expect(calculateName(expected.name)).toEqual(expected)
    })
  })

  // TODO implement user vowel and consonant selection
  // describe("soulUrge", () => {
  // test("happy", () => {
  //   expect(calculateSouleUrge("arthur trent wilson")).toBe(6)
  // })
  // test("Y as a vowel", () => {
  //   // Y is a vowel, when it is preceded by A, E, I, or O and sounds as one sound
  //   // For example in Hayde, Doyle or Raymond
  //   expect(calculateSouleUrge("carolyn sylvia young")).toBe(22)
  // })
  // test("W as a vowel", () => {
  //   // W is *sometimes* a vowel, when it is preceded by A, E, I, or O and sounds as one sound
  //   // For example in Matthew, Lowell, Bradshaw
  //   expect(calculateSouleUrge("lowell adrian hunter")).toBe(8)
  // })
  // })

  describe("personality", () => {
    test.each([
      ["abraham lincoln", 6],
      ["franklin delano roosevelt", 7],
    ])(`"%s"`, (name, expectedValue) => {
      expect(calculatePersonality(name)).toEqual(expectedValue)
    })
  })

  describe("filterVoewls", () => {
    test.each(
      // prettier-ignore
      [
        ["Happy",         "foo bar",  "oo a"],
        ["Y as vowel 1",  "hayde",    "aye"],
        ["Y as vowel 2",  "doyle",    "oye"],
        ["Uppercase",     "rayAmond", "ayAo"],
        ["Space",         "ray Amond", "ay Ao"],
        ["Two spaces",    "ray Amond er", "ay Ao e"],
        ["Numbers",       "123abc", "a"],
        ["Special characters", ":-O", "O"],
      ]
    )("%s - %s => %s", (_name, input, expected) => {
      expect(filterVowels(input), `String "${input}"\n`).toEqual(expected)
    })
  })

  describe("filterConsonants", () => {
    test.each(
      // prettier-ignore
      [
        ["Happy",           "fooBar", "fBr"],
        ["Y as consonant",  "tyuu",   "ty"],
        ["Y as vowel",      "hayde",  "hd"],
        ["space",           "hay de", "h d"],
        ["numbers",         "C00L",   "CL"],
        ["special characters", ":-D",  "D"],
      ]
    )("%s - %s => %s", (_name, input, expected) => {
      expect(filterConsonants(input), `String "${input}"\n`).toEqual(expected)
    })
  })
}
