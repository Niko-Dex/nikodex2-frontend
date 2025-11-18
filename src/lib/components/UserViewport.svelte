<script lang="ts">
  import { beforePage, fetchNikos } from "$lib/assets/noikHelper";
  import { onMount } from "svelte";
  import Card from "./Card.svelte";
  import CardContainer from "./CardContainer.svelte";

  let {
    userData,
  }: {
    userData: {
      id: number;
      username: string;
      description: string;
      is_admin: boolean;
    };
  } = $props();

  let apiData: Niko[] = $state([]);
  onMount(async () => {
    await fetchNikos(userData.id, apiData);
  });
</script>

<h1 class="h1-txt-size text-center p-2">
  {userData.username}
</h1>
{#if userData.is_admin}
  <p class="bg-yellow-500 p-2 text-black w-fit">Administrator</p>
{/if}

<svelte:head>
  <title>User: {userData.username}</title>
</svelte:head>
<section class="flex flex-col gap-4">
  <div class="border-4 border-(--theme-color) p-5 flex flex-col gap-5 bg-black">
    <h2 class="h2-txt-size">Bio / About Me:</h2>
    <div class="ring-2 p-5 ring-(--theme-color)">
      {#if userData.description.trim().length == 0}
        <p><em>user has no description... 3:</em></p>
      {:else}
        <p>{userData.description}</p>
      {/if}
    </div>
  </div>
  <h2 class="h2-txt-size">Noiks:</h2>
  {#if apiData.length == 0}
    <p class="text-center h2-txt-size">no noiks! 3:</p>
  {:else}
    {#each apiData as _apiData}
      <CardContainer>
        <Card
          id={_apiData.id}
          author={_apiData.author}
          name={_apiData.name}
          description={_apiData.description}
          abilities={_apiData.abilities}
          short_desc={_apiData.short_desc}
        />
      </CardContainer>
    {/each}
  {/if}
</section>
