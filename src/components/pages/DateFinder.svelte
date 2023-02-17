<script lang="ts">
  import { NUMBERS } from "#/lib/Consts"
  import hexoid from "hexoid"
  import type { ICalculatedDate, IFindDateArgument } from "#types/Types"
  import { add } from "date-fns"
  import { DateInput } from "date-picker-svelte"
  import { isFindDateResult } from "./DateFinderHelper"
  import VirtualList from "svelte-tiny-virtual-list"
  import {
    formatDateShort,
    formatListDisjunction,
    formatNumber,
  } from "#/lib/Helper"

  const worker = new Worker(new URL("DateFinderWorker", import.meta.url), {
    type: "module",
  })
  const createUID = hexoid()

  let startDate: Date | undefined = undefined
  let endDate: Date | undefined = undefined
  let selectedLifepaths: number[] = []

  let foundDates: readonly ICalculatedDate[] | undefined = undefined

  let minEndDate: Date = startDate
    ? add(startDate, { days: 1 })
    : new Date(9999)

  $: isFormValid =
    startDate &&
    endDate &&
    foundDates !== undefined &&
    selectedLifepaths.length > 0
  $: {
    // Do not allow end date to be before the start date
    if (startDate > endDate) {
      const newEndDate = add(startDate, { days: 1 })
      endDate = newEndDate
      minEndDate = newEndDate
    }
  }

  let latestID: string
  let isLoading = false
  $: {
    if (startDate && endDate && selectedLifepaths) {
      const id = createUID()
      latestID = id
      isLoading = true
      worker.postMessage({
        type: "FIND_DATE",
        start: startDate,
        end: endDate,
        selectedLifepaths,
        id,
      } satisfies IFindDateArgument)
    }
  }

  worker.addEventListener("message", ({ data }: { data: unknown }) => {
    if (isFindDateResult(data) && data.id === latestID) {
      isLoading = false
      foundDates = data.result
    }
  })

  const itemHeight = 32
  const itemWidth = 148

  let gridWidth: number
  let gridElement: HTMLElement | undefined

  let gridHeight = 0

  $: rowColumns =
    gridWidth < itemWidth
      ? 1
      : Math.min(
          foundDates?.length <= 3
            ? foundDates.length
            : Math.floor(gridWidth / itemWidth),
          4
        )

  function useSetListHeight(list: HTMLElement) {
    // Do not instantly update, bc it does not work otherwise, for some reason
    const timeout = setTimeout(() => {
      gridHeight = getListHeight(list)
    }, 2)

    return {
      destroy: () => clearTimeout(timeout),
    }
  }

  let resizeTimeout: NodeJS.Timeout

  function updateListHeight() {
    if (!gridElement) return

    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      gridHeight = getListHeight(gridElement)
    }, 16)
  }

  function getListHeight(_list: HTMLElement | undefined) {
    return gridElement.getBoundingClientRect().height
  }

  function focusStartDateInput() {
    ;(document.querySelector("#startDate input") as HTMLInputElement)?.focus()
  }

  function focusEndDateInput() {
    ;(document.querySelector("#endDate input") as HTMLInputElement)?.focus()
  }
</script>

<svelte:window on:resize={updateListHeight} />

<!-- Left side -->
<!-- Inputs -->
<div class="_left_wrapper">
  <h1 class="mb-8  max-w-[15ch] text-4xl ">Find dates by lifepath</h1>

  <div class="flex flex-col gap-6">
    <div class="">
      <div class="mb-1">Choose the desired lifepath(s)</div>
      <div class="grid max-w-max grid-flow-row grid-cols-4 gap-3">
        {#each NUMBERS as number}
          <label class="h-8 w-8 appearance-none">
            <input
              type="checkbox"
              name={String(number)}
              value={number}
              bind:group={selectedLifepaths}
              class="peer absolute h-0 w-0 appearance-none"
            />
            <div
              class="solid flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-50 text-base shadow shadow-amber-900/20 peer-checked:border-0 peer-checked:bg-orange-600 peer-checked:text-white"
            >
              {number}
            </div>
          </label>
        {/each}
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <DateInput
        bind:value={startDate}
        min={new Date(0)}
        format="dd/MM/yyyy"
        placeholder="Start date"
        --date-picker-width="2rem"
      />

      <DateInput
        bind:value={endDate}
        format="dd/MM/yyyy"
        placeholder="End date"
        min={minEndDate}
        max={new Date(3100, 1, 1)}
        --date-picker-width="2rem"
      />
    </div>
  </div>
</div>

<!-- Right Side -->
<!-- Dates Display-->
<div
  class="_right_wrapper flex flex-col items-center justify-start px-2 pb-16"
  class:opacity-60={isLoading}
>
  {#if isFormValid}
    <div class="mb-8 flex flex-col items-center">
      <h2 class="mb-2 text-center text-3xl">
        {`Found ${formatNumber(foundDates.length)} date${
          foundDates.length === 0 || foundDates.length > 1 ? `s` : ""
        }`}
      </h2>
      <p class="text-center">
        between <button
          class="inline text-yellow-900"
          on:click={focusStartDateInput}>{formatDateShort(startDate)}</button
        >
        and
        <button class="inline text-yellow-900" on:click={focusEndDateInput}
          >{formatDateShort(endDate)}</button
        >
        for the lifepath{selectedLifepaths.length > 1 ? "s" : ""}
        {formatListDisjunction.format(selectedLifepaths.map(String))}.
      </p>
    </div>

    <div
      class="h-full w-full transition-opacity"
      class:opacity-40={isLoading}
      bind:clientHeight={gridHeight}
      bind:clientWidth={gridWidth}
      bind:this={gridElement}
      style:--grid-justification={foundDates?.length > 3 && rowColumns > 1
        ? "end"
        : "center"}
      use:useSetListHeight
    >
      {#if foundDates && foundDates.length > 0 && rowColumns}
        <VirtualList
          width={gridWidth}
          height={gridHeight}
          itemCount={Math.ceil(foundDates.length / rowColumns)}
          itemSize={itemHeight}
        >
          <div slot="item" let:index let:style {style}>
            <div class="_row" style="--grid-columns: {rowColumns}">
              {#each Array.from({ length: rowColumns }) as _, rowItemIndex}
                {#if foundDates[index * rowColumns + rowItemIndex]}
                  <div
                    class="group flex h-10 items-center justify-end gap-3 p-2"
                    style="width: {itemWidth}px;"
                    class:even:bg-orange-100={foundDates.length > 2}
                  >
                    {formatDateShort(
                      foundDates[index * rowColumns + rowItemIndex].date
                    )}

                    {#if selectedLifepaths.length > 1}
                      <div
                        class="-ml-3 flex h-8 w-8 items-center justify-center border-orange-300 text-center text-yellow-900 "
                      >
                        {foundDates[index * rowColumns + rowItemIndex].lifePath}
                      </div>
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        </VirtualList>
      {/if}
    </div>
  {:else}
    <div class="w-full max-w-[60ch] text-center">
      Select from the options to find dates by their numerological value
    </div>
  {/if}
</div>

<style lang="postcss">
  ._row {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    justify-items: var(--grid-justification);
  }
</style>
