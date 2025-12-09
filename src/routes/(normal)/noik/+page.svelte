<script lang="ts">
    import Background from "$lib/assets/images/page/noik/bg1.png";
    import Card from "$lib/components/Card.svelte";
    import CardContainer from "$lib/components/CardContainer.svelte";
    import PageChanger from "$lib/components/PageChanger.svelte";
    import type { Niko } from "$lib/types/nikosona";
    import { onMount } from "svelte";

    let dataLoaded = $state(false);
    let dataErr = $state(false);
    let apiData: Niko[] = $state([]);
    let maxPages = $state(1);
    let currentPage = $state(1);
    let searchQuery = $state("");
    let orderingOpt = $state("oldest_added");

    async function getData() {
        if (currentPage < 1 || currentPage > maxPages) return;
        dataLoaded = false;
        dataErr = false;
        apiData = [];
        try {
            const res = await fetch(
                `/api/data/page?page=${currentPage}&sort_by=${orderingOpt}`,
            );
            const data = await res.json();

            for (let d of data) {
                const author_id = d["author_id"] || 0;
                apiData.push({
                    name: d["name"],
                    author: d["author_name"],
                    full_desc: d["full_desc"],
                    description: d["description"],
                    abilities: d["abilities"],
                    id: d["id"],
                    author_id: author_id,
                    is_blacklisted: d["is_blacklisted"],
                });
            }
            dataLoaded = true;
        } catch (err) {
            console.log(err);
            dataErr = true;
        }
    }

    async function getMaxPages() {
        try {
            dataErr = false;
            const res = await fetch(`/api/data/count`);
            const data = await res.text();
            maxPages = Math.ceil(Number.parseFloat(data) / 14.0);
        } catch (err) {
            console.log(err);
            dataErr = true;
        }
    }

    async function getSearchData() {
        if (searchQuery.length === 0) return;
        apiData = [];
        currentPage = 1;
        dataLoaded = false;
        dataErr = false;
        try {
            const res = await fetch(`/api/data/name?name=${searchQuery}`);
            const data = await res.json();

            for (let d of data) {
                apiData.push({
                    name: d["name"],
                    author: d["author_name"],
                    full_desc: d["full_desc"],
                    description: d["description"],
                    abilities: d["abilities"],
                    id: d["id"],
                    author_id: d["author_id"],
                    is_blacklisted: d["is_blacklisted"],
                });
            }
            dataLoaded = true;
        } catch (err) {
            console.log(err);
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

<svelte:head>
    <title>Noik List!</title>
</svelte:head>

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
                        author={data.author}
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
