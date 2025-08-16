<script lang="ts">

    let {
        name = "",
        author = "",
        img_link = "",
        short_desc = "",
        description = "",
        abilities = [""]
    } = $props()

    let showDesc = $state(false)

</script>
<div class="border-4 border-lime-400 px-4 py-2 bg-black flex gap-4 max-w-[640px] w-full flex-col md:flex-row">
    {#if showDesc}
    <div class="bigger_info_display fixed w-screen h-screen top-0 left-0 z-5 bg-black/50 flex justify-center items-center">
        <div class="bg-black min-w-[640px] max-w-[1200px] p-4 border-4 flex flex-col md:flex-row gap-4">
            <div class="flex flex-col gap-2">
                <img src={img_link} alt="nikosona of {name} by {author}" class="no-antialias max-w-[256px] h-fit">
                <button class="bg-red-700 rounded-sm px-2 hover:cursor-pointer hover:bg-white hover:text-black transition duration-100 active:transform-[translateY(4px)]" onclick={() => { showDesc = false }}>Close</button>
            </div>
            <div>
                <h2 class="h2-txt-size w-fit">{name}</h2>
                <p>Created by: <span class="bg-white text-black w-fit px-1">{author}</span></p>
                <p class="bg-white text-black w-fit px-1">Abilities:</p>
                <ul class="list-disc list-inside">
                    {#each abilities as ability}
                        <li>{ability}</li>
                    {/each}
                </ul>
                <p><span class="bg-white text-black w-fit px-1">Description:</span> {description}</p>
            </div>
        </div>
    </div>
    {/if}

    <div class="img flex flex-col gap-2">
        <img src={img_link} alt="nikosona of {name} by {author}" class="no-antialias max-w-[256px] h-fit">
        <button class="bg-purple-700 rounded-sm px-2 hover:cursor-pointer hover:bg-white hover:text-black transition duration-100 active:transform-[translateY(4px)]" onclick={() => { showDesc = true }}>View More</button>
    </div>
    <div class="info">
        <h2 class="h2-txt-size w-fit">{name}</h2>
        <p>By <span class="bg-white text-black w-fit px-1">{author}</span></p>
        <p class="wrap-anywhere"><em>"{short_desc}"</em></p>
        <p class="bg-white text-black w-fit px-1">Abilities:</p>
        <ul class="list-disc list-inside">
            {#each abilities as ability}
                <li>{ability}</li>
            {/each}
        </ul>
    </div>
</div>