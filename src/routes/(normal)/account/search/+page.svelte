<script lang="ts">
  import type { PageProps } from "./$types";
  import Background from "$lib/assets/images/page/user/world_machine.png";
  import toast from "svelte-french-toast";
  import { onMount } from "svelte";
  import UserCard from "$lib/components/UserCard.svelte";
  let { data }: PageProps = $props();

  let maxPages = $state(0);
  let err = $state(false);
  let currentPage = $state(1);
  let usernameToSearchFor = $state("");
  let currentUsers: User[] = $state([]);

  async function getMaximumPages() {
    try {
      const fetchingPromise = await fetch("/api/data/user/count");
      const res = await fetchingPromise.text();
      maxPages = Math.ceil(Number.parseFloat(res) / 14.0);
    } catch (err) {
      console.error(`error: ${err}`);
      err = true;
    }
  }
  async function getCurrentUsers() {
    const apiDataCurrent = fetch(
      `/api/data/user/search?username=${usernameToSearchFor}&page=${currentPage}`
    )
      .then((r) => r.json())
      .then((r) => {
        currentUsers = r;
      });
    toast.promise(apiDataCurrent, {
      loading: "loading pls wait...",
      success: "loaded search data!",
      error: (e) => `oops! ${e.message}`,
    });
  }
  onMount(async () => {
    await getCurrentUsers();
    await getMaximumPages();
  });
</script>

<section class="w-full relative flex justify-center p-4">
  <div
    style="background-image: url({Background})"
    class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"
  ></div>
  <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
    <h1 class="h1-txt-size">The User Listo!</h1>
    <p>Look through all the cool listings, woah!</p>
    <div
      class="p-4 bg-black border-4 border-(--theme-color) w-full flex flex-row gap-4"
    >
      <input
        bind:value={usernameToSearchFor}
        class="w-full border-4"
        placeholder="Search user by username..."
        onchange={async () => {
          await getCurrentUsers();
        }}
      />
      <button class="btn">Search..</button>
    </div>
    {#each currentUsers as _userPart}
      <UserCard username={_userPart.username} />{/each}
    <div class="w-full grid grid-cols-3">
      <button
        class="btn"
        onclick={() => {
          currentPage = Math.min(maxPages, currentPage++);
        }}>Prev</button
      >
      <input
        bind:value={currentPage}
        class="text-center border-2 border-white min-w-20"
        type="number"
        min={1}
        max={maxPages}
        onchange={async () => {
          await getCurrentUsers();
        }}
      />
      <button
        class="btn"
        onclick={() => {
          currentPage = Math.max(0, currentPage--);
        }}>Next</button
      >
    </div>
  </div>
</section>
