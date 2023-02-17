<script lang="ts">
  import Number from "#/components/atoms/Number.svelte"
  import TextInput from "#/components/atoms/TextInput.svelte"
  import { calculateDate } from "#/lib/DateCalculations"
  import { calculateName } from "#/lib/NameCalculations"
  import { calculateMaturity } from "#/lib/Pures"
  import { DateInput } from "date-picker-svelte"

  let birthdate: Date
  let name: string

  $: dateNumbers = birthdate ? calculateDate(birthdate) : undefined
  $: nameNumbers = name ? calculateName(name) : undefined
  $: maturity =
    dateNumbers?.lifePath && nameNumbers?.expression
      ? calculateMaturity(nameNumbers.expression, dateNumbers.lifePath)
      : undefined
</script>

<div
  class="flex h-full min-h-full w-full grow flex-col items-center justify-between gap-10 lg:flex-row lg:items-start lg:gap-6"
>
  <!-- Left side -->
  <!-- Inputs -->
  <div class="_left_wrapper">
    <h1 class="mb-8  max-w-[15ch] text-4xl tracking-normal text-amber-900">
      Calculate your numbers
    </h1>

    <div class="flex flex-col gap-4">
      <div class="text-base">Input your data</div>
      <TextInput
        name="Full Name"
        hasLabel={false}
        bind:value={name}
        maxWidth="16rem"
        placeholder="Add your name"
      />

      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="w-min">
        <div class="w-min">
          <DateInput
            bind:value={birthdate}
            min={new Date(0)}
            format="yyyy-MM-dd"
            placeholder="Add your birthdate"
            --date-picker-width="16rem"
          />
        </div>
      </label>
    </div>
  </div>

  <!-- Right side -->
  <!-- Numbers Display-->
  <div class="_right_wrapper justify-center">
    <div class="flex w-max flex-col">
      <h2 class="mb-4 text-2xl text-amber-900">Results</h2>
      <div class="mb-8">
        <div class="mb-1 text-2xs uppercase tracking-wider">Name numbers</div>
        <Number
          name="Expresison"
          number={nameNumbers?.expression}
          isLarge
          wrapperClasses="mb-3"
        />
        <div class="grid grid-cols-2 gap-4">
          <Number
            name="Soul Urge"
            number={nameNumbers?.soulUrge}
            onUncalculatedMessage="Name needs vowels for this number to be calculated"
          />
          <Number
            name="Personality"
            number={nameNumbers?.personality}
            onUncalculatedMessage="The name needs consonants for this number to be calculated"
          />
        </div>
      </div>
      <div class="">
        <div class="mb-1 text-2xs uppercase tracking-wider">
          Birth date numbers
        </div>
        <Number
          name="Life Path"
          number={dateNumbers?.lifePath}
          isLarge
          wrapperClasses="mb-3"
        />
        <div class="grid grid-cols-2 gap-x-2 gap-y-1">
          <Number name="Attitude" number={dateNumbers?.attitude} />
          <Number name="Generation" number={dateNumbers?.generation} />
          <Number name="Day of birth" number={dateNumbers?.dayOfBirth} />
        </div>
      </div>
      <div class="mt-6">
        <div class="mb-1 text-2xs uppercase tracking-wider">
          Compound number
        </div>
        <Number
          name="Maturity"
          number={maturity}
          onUncalculatedMessage="The name and birthdate need to be specified"
        />
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
</style>
