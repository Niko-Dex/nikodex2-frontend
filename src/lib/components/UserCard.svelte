<script lang="ts">
  let { username }: { username: string } = $props();
</script>

<section
  class="bg-black border-4 p-4 border-(--theme-color) flex flex-row items-center"
>
  <h1 class="w-full">{username}</h1>
  <a class="btn" href="/account/{username}">View</a>
</section>
