<script lang="ts">
    import { onMount } from 'svelte'
    let expanded = $state(false)

    let {
        name = "",
        author = "",
        img_link = "",
        short_desc = "",
        description = "",
        abilities = [""],
        id = 0
    } = $props()

    let img: HTMLImageElement
    let resetTimer: ReturnType<typeof setTimeout> | null = null
    let firstPatUrl = ""
    let firstPatUsed = false
    let patSeq = 0

    onMount(() => {
        // Preload first pat GIF so the initial click starts instantly
        firstPatUrl = `/api/patpat?id=${id}&seed=${Math.random().toString(36).slice(2)}`
        const pre = new Image()
        pre.src = firstPatUrl
    })

    function patpat() {
        // Cancel any pending revert immediately so continuous clicks don't revert mid-pat
        if (resetTimer) {
            clearTimeout(resetTimer)
            resetTimer = null
        }

        // Use preloaded URL for the first pat; then cache-bust per click
        const url = firstPatUsed && firstPatUrl
            ? `/api/patpat?id=${id}&t=${Date.now()}`
            : (firstPatUrl || `/api/patpat?id=${id}&t=${Date.now()}`)
        img.src = url
        firstPatUsed = true

        const token = ++patSeq
        img.addEventListener("load", () => {
            // Start/refresh revert timer 1s after the LAST successfully loaded pat
            if (resetTimer) clearTimeout(resetTimer)
            resetTimer = setTimeout(() => {
                // Only revert if this is still the latest pat
                if (token === patSeq) {
                    img.src = img_link
                }
            }, 1000)
        }, { once: true })
    }

</script>

<div class={expanded ? "transition duration-200 fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center items-center" : "w-full"}>
    <div class="border-4 border-amber-600 p-4 bg-black flex gap-4 {expanded ? "max-w-[1200px] m-8" : "max-w-full lg:max-w-[640px]"} w-full flex-col md:flex-row">
        <div class="img flex flex-col gap-2">
            <button class="max-w-[256px] h-fit hover:cursor-grab" onpointerdown={patpat}>
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