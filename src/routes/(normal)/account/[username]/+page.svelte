<script lang="ts">
    import type { PageProps } from "./$types";

    import Background from "$lib/assets/images/page/user/world_machine.png";
    import { beforePage, fetchNikos } from "$lib/helper/noikHelper";
    import { onMount } from "svelte";
    import CardContainer from "$lib/components/CardContainer.svelte";
    import Card from "$lib/components/Card.svelte";
    let { data }: PageProps = $props();
    let apiData: Niko[] = $state([]);
    onMount(async () => {
        await fetchNikos(data.requestedInformation.id, apiData);
    });
</script>

<section class="w-full relative flex justify-center p-4">
    <div
        style="background-image: url({Background})"
        class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"
    ></div>
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <a class="btn w-fit" href={$beforePage}>Go Back</a>
        <h1 class="h1-txt-size text-center p-2">
            {data.requestedInformation.username}
        </h1>
        {#if data.requestedInformation.is_admin}
            <p class="bg-yellow-500 p-2 text-black w-fit">Administrator</p>
        {/if}
        <section class="flex flex-col gap-4">
            <h2 class="h2-txt-size">Bio / About Me:</h2>
            <div class="ring-2 p-5 ring-(--theme-color) bg-black">
                {#if data.requestedInformation.description.trim().length == 0}
                    <p><em>user has no description... 3:</em></p>
                {:else}
                    <p>{data.requestedInformation.description}</p>
                {/if}
            </div>
            <h2 class="h2-txt-size">Noiks:</h2>
            {#if apiData.length == 0}
                <p class="text-center h2-txt-size">no noiks! 3:</p>
            {:else}
                <CardContainer>
                    {#each apiData as _apiData (_apiData.id)}
                        <Card
                            id={_apiData.id}
                            author={_apiData.author}
                            name={_apiData.name}
                            description={_apiData.description}
                            abilities={_apiData.abilities}
                            short_desc={_apiData.short_desc}
                        />
                    {/each}
                </CardContainer>
            {/if}
        </section>
    </div>
</section>
