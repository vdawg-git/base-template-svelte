import { calculateDateRange } from "#/lib/DateCalculations"
import type { IFindDateArgument, IFindDateResult } from "#types/Types"
import { match } from "ts-pattern"

onmessage = ({ data }: Event & { data: unknown }): void => {
  match(data)
    .when(isFindDateArgument, (argument_) => {
      const { id, selectedLifepaths, start, end } = argument_

      const result = calculateDateRange(start, end).filter(({ lifePath }) =>
        selectedLifepaths.includes(lifePath)
      )

      const answer = {
        type: "FIND_DATE_RESULT",
        id,
        result,
      } satisfies IFindDateResult

      postMessage(answer)
    })
    .otherwise((unknown) => {
      throw new TypeError(`Unexpected message:\n${unknown}`)
    })
}

function isFindDateArgument(argument: unknown): argument is IFindDateArgument {
  return (
    typeof argument === "object" &&
    (argument as IFindDateArgument)?.type === "FIND_DATE"
  )
}
