<script lang="ts">
  import UnmigratedWarningIcon from "$lib/assets/images/page/account/unmigrated_warning_icon.png";
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

      {#if id == undefined}
        <div class="flex flex-col">
          <h1 class="group-hover:invert transition">
            {username}
          </h1>
          <em
            class="text-xl bg-red-500 flex gap-4 items-center text-white group-hover:invert transition"
          >
            <img
              src={UnmigratedWarningIcon}
              class="w-8"
              alt="Unmigrated Icon Warning"
            />
            Unmigrated Account!
          </em>
        </div>
      {:else}
        <h1 class="group-hover:invert transition">
          {username}
        </h1>
      {/if}
    </a>
  </div>
{:else}
  <em>Invalid Profile Link</em>
{/if}
