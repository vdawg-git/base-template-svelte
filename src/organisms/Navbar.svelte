<script lang="ts">
  import { Link } from "svelte-navigator"
  import { slide } from "svelte/transition"

  import BarsIcon from "virtual:icons/uil/bars"

  let isDropDownActive = false

  function toggleDropDown() {
    isDropDownActive = !isDropDownActive
  }
</script>

<nav
  class="fixed top-0 flex w-screen items-center justify-center py-2 px-6 lg:inset-0 lg:h-[128px]"
>
  <div
    class="flex w-[748px] items-center justify-between rounded-full bg-amber-50 px-6 py-2 shadow-md shadow-amber-500/20"
  >
    <div class="text-sm md:text-lg">
      <Link to="/"
        ><div class="flex items-center">
          <img
            src="numerology-toolbelt.svg"
            class="h-8 w-8"
            alt="Numerology Toolbelt Logo"
          /> Home
        </div></Link
      >
    </div>

    <!-- Desktop & Tablet-->
    <ul class="hidden gap-4 text-sm sm:visible sm:flex">
      <li class="hover:text-orange-700">
        <Link to="/">Home</Link>
      </li>
    </ul>

    <!-- Mobile-->
    <div class="relative sm:hidden">
      <button class="h-8 w-8 p-1" on:click={toggleDropDown}><BarsIcon /></button
      >

      {#if isDropDownActive}
        <ul
          class="absolute right-0 flex min-w-max flex-col gap-4 rounded-xl bg-amber-50 p-3 text-sm shadow-lg shadow-amber-900/10"
          transition:slide={{ duration: 120 }}
        >
          <li class="hover:text-orange-700">
            <Link to="/">Home</Link>
          </li>
        </ul>
      {/if}
    </div>
  </div>
</nav>
