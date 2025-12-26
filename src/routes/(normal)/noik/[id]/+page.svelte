<script lang="ts">
  import type { PageData, PageProps } from "./$types";
  import Background from "$lib/assets/images/page/noik/bg1.png";
  import type { Niko } from "$lib/types/nikosona";
  import GoBackButton from "$lib/components/GoBackButton.svelte";
  import toast from "svelte-french-toast";
  import { page } from "$app/state";
  import UserProfileComponent from "$lib/components/UserProfileComponent.svelte";
  let { data }: PageProps = $props();

  let isPatting = $state(false);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  function patpat() {
    isPatting = true;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      isPatting = false;
      timeout = null;
    }, 1000);
  }
</script>

<svelte:head>
  <title>Noik - {data.noikData.name}</title>
</svelte:head>
<section class="w-full relative flex justify-center p-4">
  <div
    style="background-image: url({Background})"
    class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"
  ></div>
  <div
    class="max-w-[1200px] w-[800px] flex flex-col gap-4 min-h-screen bg-black border-4 border-(--theme-color) p-4"
  >
    <div class="flex flex-row gap-4 items-center">
      <GoBackButton _force_link_to={"/noik"}>Go Back</GoBackButton>
      <button
        class="btn h-fit"
        onclick={() => {
          navigator.clipboard.writeText(page.url.href);
          toast.success("Copied to clipboard!");
        }}>Copy Link</button
      >
    </div>
    <div class="flex flex-row flex-wrap h-full gap-4 overflow-auto">
      <button class="w-[40%] h-fit cursor-grab" onclick={patpat}>
        <img
          src={`/api/image?id=${data.noikData.id}`}
          class="w-full max-h-fit {isPatting ? 'hidden' : ''}"
          alt="Nikosona by {data.noikData.author}"
          draggable="false"
        />
        <img
          src={`/api/patpat?id=${data.noikData.id}`}
          class="w-full max-h-fit {!isPatting ? 'hidden' : ''}"
          alt="Nikosona by {data.noikData.author}"
          draggable="false"
        />
      </button>
      <span class="flex flex-col gap-4 h-fit overflow-auto">
        <h1 class="h1-txt-size">{data.noikData.name}</h1>
        <em>"{data.noikData.description}"</em>
        <UserProfileComponent
          username={data.noikData.author_name}
          id={data.noikData.author_id}
        ></UserProfileComponent>
        {#if data.noikData.abilities.length > 0}
          <h1 class="h1-txt-size">Abilities</h1>
        {/if}
        <ul class="list-disc ml-8">
          {#each data.noikData.abilities as ability}
            <li>
              {ability.name}
            </li>
          {/each}
        </ul>
      </span>
    </div>
    <p class="h-full bg-gray-500/10 p-4">{data.noikData.full_desc}</p>
  </div>
</section>
