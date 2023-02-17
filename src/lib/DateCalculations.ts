import { pipe } from "fp-ts/lib/function.js"
import { map, reduce } from "fp-ts/lib/ReadonlyNonEmptyArray.js"

import { reduceNumber, sumUpNumbers } from "./Pures.js"

import type { ICalculatedDate } from "#types/Types"
import { eachDayOfInterval } from "date-fns"

export function calculateDate(date: Date): ICalculatedDate {
  return {
    date,
    lifePath: calculateLifepath(date),
    attitude: calculateAttitude(date),
    generation: calculateGeneration(date),
    dayOfBirth: calculateDayOfBirth(date),
  }
}

function calculateLifepath(date: Date): number {
  return reduceNumbers(getYearMontAndhDay(date))
}

function calculateAttitude(date: Date): number {
  return reduceNumbers(getMonthAndDay(date))
}

function calculateGeneration(date: Date): number {
  return reduceNumber(date.getFullYear())
}

/**
 * Calculate the numerological number of the day of birth
 */
function calculateDayOfBirth(date: Date): number {
  return reduceNumber(date.getDate())
}

/**
 * Takes an array of numbers, reduces each of them, then redcuses their total.
 */
function reduceNumbers(numbers: readonly number[]): number {
  return pipe(numbers, map(reduceNumber), reduce(0, sumUpNumbers), reduceNumber)
}

function getYearMontAndhDay(date: Date): readonly [number, number, number] {
  return [date.getFullYear(), getMonth(date), date.getDate()] as const
}

function getMonthAndDay(date: Date): readonly [number, number] {
  return [getMonth(date), date.getDate()] as const
}

/**
 * Like `date.getMonth()` but increments the result by one, as the month is 0 indexed by default.
 */
function getMonth(date: Date): number {
  return date.getMonth() + 1
}

/**
 * Take a start and end date and calculated the values for the whole range.
 *
 * @param start The date to start from, inclusive
 * @param end The date to end, inclusive
 */
export function calculateDateRange(
  start: Date,
  end: Date
): readonly ICalculatedDate[] {
  return eachDayOfInterval({ start, end }).map(calculateDate)
}
if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest

  describe("lifePath", () => {
    test.each([
      [new Date(1990, 0, 1), 3],
      [new Date(2000, 1, 2), 6],
      [new Date(2023, 11, 10), 11],
    ])(`%s`, (input, expectedValue) => {
      expect(calculateLifepath(input)).toEqual(expectedValue)
    })
  })

  describe("reduceNumber", () => {
    test.each([
      [39, 3],
      [111_111, 6],
      [2884, 22],
    ])(`%i`, (input, expectedValue) => {
      expect(reduceNumber(input)).toEqual(expectedValue)
    })
  })
}
