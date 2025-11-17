<script lang="ts">
    import Background from "$lib/assets/images/page/noik/bg1.png";
    import Card from "$lib/components/Card.svelte";
    import CardContainer from "$lib/components/CardContainer.svelte";
    import { json } from "@sveltejs/kit";
    import { onMount } from "svelte";

    function replace_img(
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) {
        const elm = ev.target as HTMLImageElement;
        elm.src = elm.getAttribute("data-secsrc") ?? elm.src;
    }

    let dataLoaded = $state(false);
    let dataErr = $state(false);
    let apiData: Niko[] = $state([]);
    let maxPages = $state(1);
    let currentPage = $state(1);
    let searchQuery = $state("");
    let orderingOpt = $state("oldest_added");
    let pageSelectDetect = $state() as HTMLDivElement;
    let pageSelectAtBottom = $state(false);

    async function prevPage() {
        if (currentPage != 1) {
            currentPage--;
            await getData();
        }
    }

    async function nextPage() {
        if (currentPage + 1 <= maxPages) {
            currentPage++;
            await getData();
        }
    }

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
                apiData.push({
                    name: d["name"],
                    author: d["author"],
                    description: d["full_desc"],
                    short_desc: d["description"],
                    abilities: d["abilities"].map(
                        (v: { name: string }) => v.name,
                    ),
                    id: d["id"],
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
                    author: d["author"],
                    description: d["full_desc"],
                    short_desc: d["description"],
                    abilities: d["abilities"].map(
                        (v: { name: string }) => v.name,
                    ),
                    id: d["id"],
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
        const observer = new IntersectionObserver(
            (data) => {
                pageSelectAtBottom = data[0].isIntersecting;
            },
            {
                root: null,
                threshold: 1,
            },
        );

        observer.observe(pageSelectDetect);
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

        <div
            class="p-4 bg-black border-4 border-(--theme-color) w-full flex flex-row gap-4"
        >
            <input
                class="w-full border-4"
                placeholder="Search nikos by name..."
                bind:value={searchQuery}
            />
            <button class="btn" onclick={async () => await getSearchData()}
                >Search..</button
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
                {#each apiData as data}
                    <Card
                        abilities={data.abilities}
                        author={data.author}
                        description={data.description}
                        name={data.name}
                        short_desc={data.short_desc}
                        id={data.id}
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
<div bind:this={pageSelectDetect}></div>
{#if !dataErr}
    <div
        class="bg-gray-700 flex justify-center gap-4 p-2 {pageSelectAtBottom
            ? 'w-full'
            : 'p-4 w-fit mx-auto sticky bottom-4'}"
    >
        <button
            class="transition duration-100 hover:bg-white hover:text-black hover:cursor-pointer border-2 border-white px-4 py-1 disabled:opacity-50 disabled:pointer-events-none"
            onclick={prevPage}
            disabled={currentPage <= 1 || !dataLoaded}>Prev</button
        >
        <input
            class="text-center border-2 border-white min-w-20"
            type="number"
            min={1}
            max={maxPages}
            bind:value={currentPage}
            aria-label="Page number"
            onchange={async () => await getData()}
            disabled={!dataLoaded}
        />
        <button
            class="transition duration-100 hover:bg-white hover:text-black hover:cursor-pointer border-2 border-white px-4 py-1 disabled:opacity-50 disabled:pointer-events-none"
            onclick={nextPage}
            disabled={currentPage >= maxPages || !dataLoaded}>Next</button
        >
    </div>
{/if}
