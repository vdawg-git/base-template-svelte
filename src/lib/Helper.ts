export const formatDateLong = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  numberingSystem: "latn",
  calendar: "iso8601",
}).format

export const formatDateShort = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  numberingSystem: "latn",
  calendar: "iso8601",
}).format

/**
 * Number formatter short format
 */
export const formatNumber = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  compactDisplay: "long",
}).format

/**
 * List formatter
 */
export const formatListDisjunction = new Intl.ListFormat("en-GB", {
  type: "disjunction",
})
