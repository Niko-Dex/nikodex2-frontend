<script lang="ts">
  let { username, id }: { username: string; id: number } = $props();
</script>

{#if username}
  <div class="flex flex-row items-center gap-4">
    By:
    <a
      class="w-fit px-1 no-underline h2-txt-size h-fit mt-auto flex items-center gap-4 transition group hover:bg-white p-2 border-4 border-(--theme-color)"
      href="/account/{username}"
    >
      {#if id}
        <img
          src="/api/data/user/pfp?id={id}"
          class="w-16 h-16 group-hover:invert transition"
          alt="Profile picture of {username}"
        />
      {/if}
      <h1
        class="group-hover:invert transition {id == undefined
          ? 'bg-red-500'
          : ''}"
      >
        {username}
      </h1>
    </a>
  </div>
{:else}
  <em>Invalid Profile Link</em>
{/if}
