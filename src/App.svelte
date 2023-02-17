<script lang="ts">
  import { Router, Route } from "svelte-navigator"
  import Footer from "./components/organisms/footer.svelte"
  import Navbar from "./organisms/Navbar.svelte"
</script>

<main class="h-full w-full">
  <Router>
    <Navbar />

    <Route path="/">
      <div class="" />
    </Route>

    <!-- Default path if not found -->

    <Footer />
  </Router>
</main>

<style lang="postcss">
</style>
