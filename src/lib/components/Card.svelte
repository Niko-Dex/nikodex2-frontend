<script lang="ts">
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";

    let expanded = $state(false)

    let {
        name = "",
        author = "",
        short_desc = "",
        description = "",
        abilities = [""],
        id = 0
    } = $props()

    let img_link = $derived(`/api/image?id=${id}`)
    let patpat_link = $derived(`/api/patpat?id=${id}`)
    let timeout: ReturnType<typeof setTimeout> | null = null

    let isPatPat = $state(false)

    // this is the squares
    let id12FramesBase64 = $state<string[]>(["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"]) // fill these 4 entries
    let id12FrameSrcs = $derived(
        id12FramesBase64.map((b64: string) => (
            b64?.startsWith("data:") ? b64 : (b64 ? `data:image/png;base64,${b64}` : "")
        ))
    )
    let id12Animating = $state(false)
    let id12FrameIndex = $state(0)
    let id12Interval: ReturnType<typeof setInterval> | null = null
    let id12Visible = $state(false) // controls fade
    let id12StopTimeout: ReturnType<typeof setTimeout> | null = null

    function startId12AnimOnce() {
        if (id12FrameSrcs.some((src: string) => !src)) return
        if (id12Interval) { clearInterval(id12Interval); id12Interval = null }
        if (id12StopTimeout) { clearTimeout(id12StopTimeout); id12StopTimeout = null }
        id12Visible = true
        id12Animating = true
        id12FrameIndex = 0
        id12Interval = setInterval(() => {
            id12FrameIndex = (id12FrameIndex + 1) % 4
        }, 125) // this is 8 fps
        Promise.resolve().then(() => { id12Visible = false })
        id12StopTimeout = setTimeout(() => {
            if (id12Interval) { clearInterval(id12Interval); id12Interval = null }
            id12Animating = false
            id12FrameIndex = 0
        }, 1000)
    }

    function patpat() {
        // id 12 is soda machine
        if (id === 12) return
        isPatPat = true
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            isPatPat = false
            timeout = null
        }, 1000)
    }

    onDestroy(() => {
        if (id12Interval) clearInterval(id12Interval)
        if (id12StopTimeout) clearTimeout(id12StopTimeout)
        if (timeout) clearTimeout(timeout)
    })

</script>

<div class={expanded ? "transition duration-200 fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center items-center" : "w-full"}>
    <div class="border-4 border-amber-600 p-4 bg-black flex gap-4 {expanded ? "max-w-[1200px] m-8" : "max-w-full lg:max-w-[640px]"} w-full flex-col md:flex-row">
        <div class="img flex flex-col gap-2">
            <button
                class="relative max-w-[256px] w-[256px] max-h-[256px] h-fit hover:cursor-pointer"
                onclick={() => { id === 12 ? startId12AnimOnce() : patpat() }}
            >
                {#if id !== 12}
                <img src={patpat_link} alt="nikosona of {name} by {author} getting pat" class="no-antialias w-full h-full object-contain {isPatPat ? "" : "hidden"}">
                {/if}
                <img src={img_link} alt="nikosona of {name} by {author}" class="no-antialias w-full h-full object-contain {isPatPat ? "hidden" : ""}">
                {#if id === 12 && (id12Animating || id12Visible)}
                <img src={id12FrameSrcs[id12FrameIndex]}
                     alt=""
                     class="pointer-events-none absolute inset-0 m-auto no-antialias object-contain w-full h-full transition-opacity duration-1000 {id12Visible ? 'opacity-100' : 'opacity-0'}">
                {/if}
            </button>
            <button class="btn" onclick={() => { expanded = !expanded }}>{expanded ? "Close" : "View More"}</button>
            <a class="btn text-center" href={`/twm/${id}`}>TWM View</a>
        </div>
        <div class="info">
            <h2 class="h2-txt-size w-fit">{name}</h2>
            <p>Created By <span class="bg-white text-black w-fit px-1">{author}</span></p>
            {#if !expanded}
            <p class="wrap-anywhere"><em>"{short_desc}"</em></p>
            {/if}
            <p class="bg-white text-black w-fit px-1">Abilities:</p>
            {#if abilities.length > 0}
            <ul class="list-disc list-inside">
                {#each abilities as ability}
                    <li>{ability}</li>
                {/each}
            </ul>
            {:else}
            <p><em>[empty]</em></p>
            {/if}
            {#if expanded}
            <p>{description}</p>
            {:else}
            <p>...</p>
            {/if}
        </div>
    </div>
</div>