<script lang="ts">
  import { Router, Route } from "svelte-navigator"
  import Footer from "./components/organisms/footer.svelte"
  import DateFinder from "./components/pages/DateFinder.svelte"
  import PersonalNumbers from "./components/pages/PersonalNumbers.svelte"
  import { ROUTES } from "./lib/Routes"
  import Navbar from "./organisms/Navbar.svelte"
</script>

<main class="h-full w-full">
  <Router>
    <Navbar />

    <Route path="/">
      <PersonalNumbers />
    </Route>
    <Route path={ROUTES.dateFinder}>
      <DateFinder />
    </Route>
    <!-- Default path if not found -->
    <Route>
      <PersonalNumbers />
    </Route>

    <Footer />
  </Router>
</main>

<style lang="postcss">
</style>
