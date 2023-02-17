import type { IFindDateResult } from "#types/Types"

export function isFindDateResult(data: unknown): data is IFindDateResult {
  return (
    typeof data === "object" &&
    (data as IFindDateResult)?.type === "FIND_DATE_RESULT"
  )
}
