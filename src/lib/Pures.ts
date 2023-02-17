import { MASTER_NUMBERS } from "./Consts"

export function calculateMaturity(
  expression: number,
  lifePath: number
): number {
  return reduceNumber(expression + lifePath)
}

export function reduceNumber(number: number): number {
  if (Number.isNaN(number)) throw new Error(`Invalid number: ${number}`)

  if ((MASTER_NUMBERS as readonly number[]).includes(number)) return number

  if (String(number).length > 1) {
    const added = [...String(number)].reduce(sumUpStringedNumbers, 0)
    return reduceNumber(added)
  }

  return number
}

/**
 * To be used with `Array.reduce`.
 *
 * Simply sums up all the numbers of an array.
 * @param total  The total to be added to
 *
 * @param numberToAdd The number to be added to the result
 * @returns The total of the summed values
 */
export function sumUpNumbers(total: number, numberToAdd: number) {
  return total + numberToAdd
}

/**
 * To be used with `.reduce`
 *
 * @example ["1","1","1"].reduce(sumUpStringedNumbers) //=> 3
 * @param total  The total of the summed values
 * @param letterToAdd The current letter or number as string to be added to the result
 */
export function sumUpStringedNumbers(
  total: number,
  letterToAdd: string | number
): number {
  if (Number.isNaN(Number(letterToAdd))) {
    throw new TypeError(
      `Invalid letter, it should be a number. Received: ${letterToAdd}`
    )
  }

  return total + Number(letterToAdd)
}

/**
 * Like {@link reduceNumber} but does also reduce master numbers.
 */
export function reduceNumberIgnoreMasters(number: number): number {
  if (Number.isNaN(number)) throw new Error(`Invalid number: ${number}`)

  if (String(number).length === 1) return number

  const added = [...String(number)].reduce(sumUpStringedNumbers, 0)

  return reduceNumberIgnoreMasters(added)
}

/**
 * Split an array into smaller parts.
 * @example {
 * chunkArray( [1, 2, 3, 4], 2) //=> [ [1,2] , [3, 4] ]
 * }
 */
export function chunkArray<T>(
  array: readonly T[],
  size: number
): readonly T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }).map(
    (_, index) => array.slice(index * size, index * size + size)
  )
}

if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest

  describe("sumUpStringsAsNumber", () => {
    test("happy", () => {
      const toTest = ["1", "1", "1"]
      expect(toTest.reduce(sumUpStringedNumbers, 0)).toEqual(3)
    })

    test("happy 2", () => {
      const toTest = ["2", "2", "1"]

      expect(toTest.reduce(sumUpStringedNumbers, 10)).toEqual(15)
    })
  })

  describe("sumUpNumbers", () => {
    test("happy", () => {
      const toTest = [1, 1, 1]
      expect(toTest.reduce(sumUpNumbers)).toEqual(3)
    })

    test("happy 2", () => {
      const toTest = [10, 10, 10]

      expect(toTest.reduce(sumUpNumbers)).toEqual(30)
    })
  })

  describe("reduceNumber", () => {
    test("happy master", () => {
      expect(reduceNumber(11)).toEqual(11)
    })

    test("happy", () => {
      expect(reduceNumber(12)).toEqual(3)
    })

    test("happy master 2", () => {
      expect(reduceNumber(994)).toEqual(22)
    })
  })

  describe("reduceNumberIgnoreMasters", () => {
    test("happy unmaster", () => {
      expect(reduceNumberIgnoreMasters(11)).toEqual(2)
    })

    test("happy", () => {
      expect(reduceNumberIgnoreMasters(4)).toEqual(4)
    })

    test("happy", () => {
      expect(reduceNumberIgnoreMasters(40)).toEqual(4)
    })
  })
}
