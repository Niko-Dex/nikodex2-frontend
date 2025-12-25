<script lang="ts">
  import GoBackIcon from "$lib/assets/images/components/GoBackIcon.svelte";
  import LogoutIcon from "$lib/assets/images/components/LogoutIcon.svelte";

  let { children, _class = "", _force_link_to = "" } = $props();
</script>

{#if _force_link_to == ""}
  <button
    class="btn flex flex-row gap-2 items-center {_class}"
    onclick={() => history.back()}
  >
    <GoBackIcon />
    {@render children()}
  </button>
{:else}
  <a class="btn {_class} flex flex-row gap-2" href={_force_link_to}>
    <GoBackIcon />
    {@render children()}
  </a>
{/if}
