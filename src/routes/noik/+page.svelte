<script lang="ts">
    import Background from "$lib/assets/images/noik_page/bg1.png"
    import Card from "$lib/components/Card.svelte"
    import CardContainer from "$lib/components/CardContainer.svelte"

    function replace_img(ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        const elm = ev.target as HTMLImageElement
        elm.src = elm.getAttribute("data-secsrc") ?? elm.src
    }

    let dataLoaded = false
    let apiData: {
        name: string,
        author: string,
        img_link: string,
        short_desc: string,
        description: string,
        abilities: string[]
    }[] = $state([])
</script>

<svelte:head>
    <title>Noik List!</title>
</svelte:head>

<section class="w-full relative flex justify-center p-4">
    <div style="background-image: url({Background})" class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"></div>
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <h1 class="h1-txt-size">The Noik List!</h1>
        <p><em>again, patpat functionality will be added later :3</em></p>

        {#if dataLoaded}
        <CardContainer>
            {#each apiData as data}
                <Card
                    abilities={data.abilities}
                    author={data.author}
                    description={data.description}
                    img_link={data.img_link}
                    name={data.name}
                    short_desc={data.short_desc}
                />
            {/each}
        </CardContainer>
        {:else}
        <p class="text-center"><em>loading data from API, please wait...</em></p>
        {/if}
    </div>
</section>