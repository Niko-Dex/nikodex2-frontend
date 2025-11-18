<script lang="ts">
  let { username }: { username: string } = $props();
</script>

<svelte:head>
  <title>Search Accounts...</title>
</svelte:head>
<section
  class="bg-black border-2 p-5 border-(--theme-color) flex flex-row items-center"
>
  <h1 class="w-full">{username}</h1>
  <a class="btn" href="/account/{username}">view</a>
</section>
