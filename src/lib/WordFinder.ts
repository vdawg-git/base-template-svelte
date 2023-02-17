import type { INameNumbers } from "#types/Types"
import { omit } from "fp-ts-std/ReadonlyStruct"
import type { RequireAtLeastOne } from "type-fest"
import {
  alphabet,
  calculateName,
  consonants,
  type vowels,
} from "./NameCalculations"

type Path = readonly number[]

const vowelsMapped: Readonly<
  Record<number, typeof vowels[number] | undefined>
> = alphabet.reduce((accumulator, letter) => {
  if (isConsonant(letter)) return accumulator

  return {
    ...accumulator,
    [alphabet.indexOf(letter)]: letter,
  }
}, {})

const consonantsMapped: Readonly<
  Record<number, typeof consonants[number] | undefined>
> = alphabet.reduce((accumulator, letter) => {
  if (!isConsonant(letter)) return accumulator

  return {
    ...accumulator,
    [alphabet.indexOf(letter)]: letter,
  }
}, {})

const alphabetZeroBasedLength = alphabet.length - 1

/**
 * Create words with matching numerological values.
 * 
 * The function tries to create phonetically nice words.

 */
export function findWords({
  limit,
  values,
  maxLetters,
  minLetters,
}: {
  limit: number
  values: RequireAtLeastOne<INameNumbers>
  maxLetters: number
  minLetters: number
}) {
  const endingPath = JSON.stringify(
    Array.from({ length: maxLetters }).map((_) => alphabetZeroBasedLength - 1)
  )

  return recursion()

  function recursion(
    words: string[] = [],
    path: Path = [0],
    iteration = 0
  ): readonly string[] {
    if (iteration === limit) return words

    if (JSON.stringify(path) === endingPath) return words

    const letterToAdd = getNewLetterByPath(path)

    if (letterToAdd === undefined) return words

    const newWord = wordFromPath(path) + letterToAdd

    if (newWord.length < minLetters)
      return recursion(words, incrementPath(path, maxLetters), iteration + 1)

    const calculatedValues = omit(["name"])(calculateName(newWord))

    const isMatching = Object.entries(values).every(
      ([givenType, givenValue]) => calculatedValues[givenType] === givenValue
    )

    // Time to return stuff
    return recursion(
      [...words, ...(isMatching ? [newWord] : [])],
      incrementPath(path, maxLetters),
      iteration + 1
    )
  }
}

function wordFromPath(path: Path): string {
  return path.map((index) => alphabet[index]).join("")
}

function getNewLetterByPath(path: Path): string | undefined {
  const isLastLetterConsonant = isConsonant(getLastLetterOfPath(path))
  const currentPathIndex = path.at(-1)

  return isLastLetterConsonant
    ? getNextLetterFromMappedObject(currentPathIndex)(consonantsMapped)
    : getNextLetterFromMappedObject(currentPathIndex)(vowelsMapped)
}

function getLastLetterOfPath(path: Path): string | undefined {
  return alphabet[path.at(-1)] as string | undefined
}

function isConsonant(letter: string) {
  if (letter.length > 1)
    throw new TypeError(`No letter passed. Received ${letter}`)

  return consonants.includes(letter as typeof consonants[number])
}

/**
 * Increment the path. Returns `undefined` if the path reached the end.
 */
function incrementPath(path: Path, maxLetters: number): Path | undefined {
  if (path.length >= maxLetters && path.at(-1) >= alphabetZeroBasedLength)
    return undefined

  const newPath = [...path]
  const lastIndex = path.length - 1
  const lastValue = path[lastIndex]

  if (lastValue >= alphabetZeroBasedLength) newPath.push(0)
  else newPath[lastIndex] + 1

  return newPath
}

function getNextLetterFromMappedObject(
  currentIndex: number
): (
  object: Readonly<Record<number, string | undefined>>
) => string | undefined {
  return (object) => {
    console.log("🚀 ~ file: WordFinder.ts:147 ~ return ~ object", object)
    const nextIndex = Object.keys(object).find(
      (key) => Number(key) > currentIndex
    )
    console.log("🚀 ~ file: WordFinder.ts:150 ~ return ~ nextIndex", nextIndex)

    return object[nextIndex] as string | undefined
  }
}
