<script lang="ts">
    import Background from "$lib/assets/images/page/noik/bg1.png";
    import Card from "$lib/components/Card.svelte";
    import CardContainer from "$lib/components/CardContainer.svelte";
    import MetaTags from "$lib/components/MetaTags.svelte";
    import PageChanger from "$lib/components/PageChanger.svelte";
    import { api } from "$lib/helper/helper";
    import type { Niko } from "$lib/types/nikosona";
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";

    let dataLoaded = $state(false);
    let dataErr = $state(false);
    let apiData: Niko[] = $state([]);
    let maxPages = $state(1);
    let currentPage = $state(1);
    let searchQuery = $state("");
    let orderingOpt = $state("oldest_added");

    function mapping(d: Omit<Niko, "author"> & { author_name: string }): Niko {
        return {
            name: d.name,
            author_name: d.author_name,
            full_desc: d.full_desc,
            description: d.description,
            abilities: d.abilities,
            id: d.id,
            author_id: d.author_id,
            is_blacklisted: d.is_blacklisted,
        };
    }

    async function getData() {
        if (currentPage < 1 || currentPage > maxPages) return;

        dataLoaded = false;
        dataErr = false;

        try {
            const data = await api(
                `/api/data/page?page=${currentPage}&sort_by=${orderingOpt}`,
            );
            apiData = data.map(mapping);
            dataLoaded = true;
        } catch (err) {
            toast.error((err as Error).message);
            dataErr = true;
        }
    }

    async function getMaxPages() {
        try {
            const data = await api(`/api/data/count`);
            maxPages = Math.ceil(Number(data) / 14.0);
        } catch (err) {
            toast.error((err as Error).message);
            dataErr = true;
        }
    }

    async function getSearchData() {
        if (searchQuery.length === 0) return;

        currentPage = 1;
        dataLoaded = false;
        dataErr = false;

        try {
            const data = await api(`/api/data/name?name=${searchQuery}`);
            apiData = data.map(mapping);
            dataLoaded = true;
        } catch (err) {
            toast.error((err as Error).message);
            dataErr = true;
        }
    }

    async function clearSearch() {
        searchQuery = "";
        await getData();
    }

    onMount(async () => {
        await getMaxPages();
        await getData();
    });
</script>

<MetaTags
    description="It's exactly what the title stated lol."
    title="The Nikodex // The Niko List!"
    image="https://github.com/Niko-Dex/nikodex2-frontend/blob/main/src/lib/assets/images/logo.png?raw=true"
    type="website"
    url="https://nikodex.net/noik"
/>

<section class="w-full relative flex justify-center p-4">
    <div
        style="background-image: url({Background})"
        class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"
    ></div>
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <h1 class="h1-txt-size">The Noik List!</h1>
        <p><em>click on any of the nikosona to patpat! :3</em></p>

        <div class="w-full flex flex-row gap-4">
            <input
                class="w-full"
                placeholder="Search nikos by name..."
                bind:value={searchQuery}
            />
            <button class="btn" onclick={async () => await getSearchData()}
                >Search</button
            >
            {#if searchQuery.length > 0}
                <button class="btn" onclick={async () => await clearSearch()}
                    >Close</button
                >
            {/if}
        </div>
        <select
            bind:value={orderingOpt}
            onchange={async () => await getData()}
            aria-label="Sort by"
        >
            <option selected value="oldest_added">Sort by: oldest added</option>
            <option value="recently_added">Sort by: recently added</option>
            <option value="name_ascending">Sort by: name ascending</option>
            <option value="name_descending">Sort by: name descending</option>
        </select>
        {#if dataLoaded}
            <CardContainer>
                {#each apiData as data (data.id)}
                    <Card
                        abilities={data.abilities}
                        author={data.author_name}
                        description={data.full_desc}
                        name={data.name}
                        short_desc={data.description}
                        id={data.id}
                        is_blacklisted={data.is_blacklisted}
                        author_id={data.author_id}
                    />
                {/each}
            </CardContainer>
        {:else if dataErr}
            <p class="text-center">
                <em
                    >woops! something has gone wrong while connecting to the API
                    server :83c... check developer console for more info</em
                >
            </p>
        {:else}
            <p class="text-center">
                <em>loading data from API, please wait...</em>
            </p>
        {/if}
    </div>
</section>
<PageChanger
    {maxPages}
    onupdate={async (page) => {
        currentPage = page;
        await getData();
    }}
    disabled={!dataLoaded || dataErr}
/>
