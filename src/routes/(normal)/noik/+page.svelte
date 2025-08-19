<script lang="ts">
    import Background from "$lib/assets/images/noik_page/bg1.png"
    import Card from "$lib/components/Card.svelte"
    import CardContainer from "$lib/components/CardContainer.svelte"
    import { onMount } from "svelte";

    // Adjustable text size for the warning line
    let warnSize = $state("text-sm")

    function replace_img(ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        const elm = ev.target as HTMLImageElement
        elm.src = elm.getAttribute("data-secsrc") ?? elm.src
    }

    let dataLoaded = $state(false)
    let dataErr = $state(false)
    let apiData: {
        name: string,
        author: string,
        img_link: string,
        short_desc: string,
        description: string,
        abilities: string[],
        id: number
    }[] = $state([])
    let maxPages = $state(1)
    let currentPage = $state(1)
    let isSearching = $state(false)
    let searchQuery = $state("")

    async function prevPage() {
        if (currentPage != 1) {
            currentPage--;
            await getData()
        }
    }

    async function nextPage() {
        if (currentPage + 1 <= maxPages) {
            currentPage++;
            await getData()
        }
    }

    async function getData() {
        if (currentPage < 1 || currentPage > maxPages) return
        apiData = []
        fetch(`/api/data/page?page=${currentPage}`)
            .then(d => d.json())
            .then(data => {
                for (let d of data) {
                    apiData.push({
                        name: d["name"],
                        author: d["author"],
                        description: d["full_desc"],
                        short_desc: d["description"],
                        abilities: d["abilities"].map((v: { name: string }) => v.name),
                        img_link: d["full_img_path"],
                        id: d["id"]
                    })
                }
                dataLoaded = true
            })
            .catch(err => {
                console.log(err)
                dataErr = true
            })
    }

    async function getMaxPages() {
        fetch(`/api/data/count`)
            .then(d => d.text())
            .then(data => {
                maxPages = Math.ceil((Number.parseFloat(data)) / 14.0);
            })
    }

    async function getSearchData() {
        if (searchQuery.length === 0) return
        apiData = []
        isSearching = true
        currentPage = 1
        dataLoaded = false
        fetch(`/api/data/name?name=${searchQuery}`)
            .then(d => d.json())
            .then(data => {
                for (let d of data) {
                    apiData.push({
                        name: d["name"],
                        author: d["author"],
                        description: d["full_desc"],
                        short_desc: d["description"],
                        abilities: d["abilities"].map((v: { name: string }) => v.name),
                        img_link: d["full_img_path"],
                        id: d["id"]
                    })
                }
                dataLoaded = true
            })
            .catch(err => {
                console.log(err)
                dataErr = true
            })
    }

    async function clearSearch() {
        isSearching = false
        searchQuery = ""
        await getData()
    }

    onMount(async () => {
        await getMaxPages()
        await getData()
    })
</script>

<svelte:head>
    <title>Noik List!</title>
</svelte:head>

<section class="w-full relative flex justify-center p-4">
    <div style="background-image: url({Background})" class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"></div>
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <h1 class="h1-txt-size">The Noik List!</h1>
        <p><em>click on any of the nikosona to patpat! :3</em></p>
        <p class={`flex items-center gap-2 ${warnSize}`}>
            <span>don't use autoclicker it will give the noik brain damage</span>
            <img
                src="https://cdn.discordapp.com/emojis/1083482257198682214.webp?size=128"
                alt="warning emoji"
                class="inline-block align-text-bottom"
                style="height: 1em; width: 1em;"
            />
        </p>

        {#if dataLoaded}
        <div class="p-4 bg-black border-4 border-amber-600 w-full flex flex-row gap-4">
            <input class="border-4 border-amber-600 w-full" placeholder="Search nikos by name.."
            bind:value={searchQuery}>
            <button class="btn" onclick={async() => await getSearchData()}>Search..</button>
            {#if searchQuery.length > 0}
                <button class="btn" onclick={async() => await clearSearch()}>Close</button>
            {/if}
        </div>
        <CardContainer>
            {#each apiData as data}
                <Card
                    abilities={data.abilities}
                    author={data.author}
                    description={data.description}
                    img_link={data.img_link}
                    name={data.name}
                    short_desc={data.short_desc}
                    id={data.id}
                />
            {/each}
        </CardContainer>
        {:else if dataErr}
        <p class="text-center"><em>woops! something has gone wrong while connecting to the API server :83c... check developer console for more info</em></p>
        {:else}
        <p class="text-center"><em>loading data from API, please wait...</em></p>
        {/if}
    </div>
</section>
{#if !dataErr && !isSearching}
    <div class="bg-gray-700 w-full flex justify-center gap-4 p-2">
        <button 
        class="transition duration-100 hover:bg-white hover:text-black hover:cursor-pointer border-2 border-white"
        onclick={async() => await prevPage()}>Prev</button>
        <input class="text-center border-2 border-white min-w-2"
        type="number" min={1} max={maxPages} bind:value={currentPage} onchange={async () => await getData()}>
        <button 
        class="transition duration-100 hover:bg-white hover:text-black hover:cursor-pointer border-2 border-white"
        onclick={async() => await nextPage()}>Next</button>
    </div>
{/if}