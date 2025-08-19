<script lang="ts">
    let expanded = $state(false)

    let {
        name = "",
        author = "",
        img_link = "",
        short_desc = "",
        description = "",
        abilities = [""]
    } = $props()

    let img: HTMLImageElement
    let patpatAPI = "https://tt7homa.eu.pythonanywhere.com/petpet.gif?image="
    function patpat() {
        img.src = patpatAPI + img.src
    }

</script>

<div class={expanded ? "transition duration-200 fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center items-center" : "w-full"}>
    <div class="border-4 border-amber-600 p-4 bg-black flex gap-4 {expanded ? "max-w-[1200px] m-8" : "max-w-full lg:max-w-[640px]"} w-full flex-col md:flex-row">
        <div class="img flex flex-col gap-2">
            <button class="max-w-[256px] h-fit hover:cursor-grab" onclick={patpat}>
                <img src={img_link} alt="nikosona of {name} by {author}" class="no-antialias w-100 h-auto" bind:this={img}>
            </button>
            <button class="btn" onclick={() => { expanded = !expanded }}>{expanded ? "Close" : "View More"}</button>
        </div>
        <div class="info">
            <h2 class="h2-txt-size w-fit">{name}</h2>
            <p>Created By <span class="bg-white text-black w-fit px-1">{author}</span></p>
            {#if !expanded}
            <p class="wrap-anywhere"><em>"{short_desc}"</em></p>
            {/if}
            <p class="bg-white text-black w-fit px-1">Abilities:</p>
            <ul class="list-disc list-inside">
                {#each abilities as ability}
                    <li>{ability}</li>
                {/each}
            </ul>
            {#if expanded}
            <p>{description}</p>
            {:else}
            <p>...</p>
            {/if}
        </div>
    </div>
</div>