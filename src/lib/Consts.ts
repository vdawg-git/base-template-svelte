/**
 * All master numbers (here 11 and 22 are treated as master numbers)
 */
export const MASTER_NUMBERS = [11, 22] as const

/**
 * The numbers from 1-9
 */
export const NORMAL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

/**
 * The numbers from 1-9 and the {@link MASTER_NUMBERS master numbers}.
 */
export const NUMBERS = [...NORMAL_NUMBERS, ...MASTER_NUMBERS] as const

export const FOOTER_SIZE = 48
