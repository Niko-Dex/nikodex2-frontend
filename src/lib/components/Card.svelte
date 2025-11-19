<script lang="ts">
    import blacklist from "$lib/assets/data/blacklist.json";
    import Squares from "$lib/assets/images/components/nohand.png";
    import EditModal from "$lib/components/EditModal.svelte";
    const maxAbilitiesChar = 100;
    const maxAbilitiesCnt = 5;
    const viewMore = "...";
    let expanded = $state(false);
    let edit_mode = $state(false);

    let {
        name = "",
        author = "",
        short_desc = "",
        description = "",
        abilities = [] as string[],
        id = 0,
        author_id = 0,
        full_expand = false,
        edit_allow = false,
    } = $props();

    let img_link = $derived(`/api/image?id=${id}`);
    let patpat_link = $derived(`/api/patpat?id=${id}`);

    let isBlacklisted = $derived(blacklist.findIndex((v) => v == id) != -1);
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let shortenedAbilities = $derived.by(() => {
        let curLen = 0;
        let out: string[] = [];
        for (let i of abilities.slice(0, maxAbilitiesCnt)) {
            if (curLen >= maxAbilitiesChar) {
                out.push(viewMore);
                break;
            }
            let str = i.slice(0, maxAbilitiesChar - viewMore.length);
            if (i.length >= maxAbilitiesChar - viewMore.length) str += viewMore;
            out.push(str);
            curLen += i.length;
        }
        return out;
    });

    let isPatPat = $state(false);

    function patpat() {
        isPatPat = true;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            isPatPat = false;
            timeout = null;
        }, 1000);
    }
</script>

<EditModal
    {id}
    {name}
    description={short_desc}
    full_desc={description}
    {author}
    {author_id}
    bind:open={edit_mode}
/>
<div
    class="{expanded
        ? 'transition duration-200 fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center'
        : 'w-full'} card"
>
    <div
        class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 {expanded
            ? 'max-w-[1200px] mx-8 my-auto overflow-auto max-h-screen'
            : 'max-w-full'} {!expanded && !full_expand
            ? 'lg:max-w-[640px]'
            : ''} w-full flex-col md:flex-row"
    >
        <div
            class="img flex flex-col gap-2 bg-black {expanded
                ? 'sticky top-0 z-1'
                : ''}"
        >
            <button
                class="max-w-[256px] w-full md:w-[256px] max-h-[256px] h-fit hover:cursor-grab {isPatPat
                    ? 'pointer-events-none'
                    : ''}"
                onpointerdown={patpat}
            >
                {#if isBlacklisted}
                    <div class="relative w-full h-full">
                        <img
                            src={img_link}
                            alt="nikosona of {name} by {author}"
                            class="no-antialias w-full h-full object-contain"
                        />
                        <div class={isPatPat ? "opacity-100" : "opacity-0"}>
                            <div
                                class="{isPatPat
                                    ? 'opacity-0'
                                    : 'opacity-100'} transition duration-1000 absolute w-full h-full bg-(image:--bg) top-0 left-0 z-1 anim"
                                style="--bg: url({Squares}); transition-timing-function: cubic-bezier(0.260, 0.010, 0.310, 0.990);"
                            ></div>
                        </div>
                    </div>
                {:else}
                    <img
                        src={patpat_link}
                        alt="nikosona of {name} by {author} getting pat"
                        class="no-antialias w-full h-full object-contain {isPatPat
                            ? ''
                            : 'hidden'}"
                    />
                    <img
                        src={img_link}
                        alt="nikosona of {name} by {author}"
                        class="no-antialias w-full h-full object-contain {isPatPat
                            ? 'hidden'
                            : ''}"
                    />
                {/if}
            </button>
            <button
                class="btn"
                onclick={() => {
                    expanded = !expanded;
                }}>{expanded ? "Close" : "Expand"}</button
            >
            <a class="btn text-center" href={`/twm/${id}`}>TWM View</a>
            {#if edit_allow}
                <button
                    class="btn text-center"
                    onclick={() => (edit_mode = true)}>Edit..</button
                >
            {/if}
        </div>
        <div class="info grow relative">
            <p class="absolute right-0 bottom-0 text-gray-500">
                <em>#{id}</em>
            </p>
            <h2 class="h2-txt-size w-fit">{name}</h2>
            {#if !expanded}
                <p class="wrap-anywhere"><em>"{short_desc}"</em></p>
            {/if}
            <p>
                By: <a
                    class="bg-white text-black w-fit px-1"
                    href="/account/{author}">{author}</a
                >
            </p>
            <p class="bg-white text-black w-fit px-1">Abilities:</p>
            <ul class="list-disc list-inside">
                {#each expanded ? abilities : shortenedAbilities as ability}
                    <li class="break-words">{ability}</li>
                {:else}
                    <li><em>[undetermined]</em></li>
                {/each}
            </ul>
            {#if expanded}
                <p>{description}</p>
            {:else}
                <p><em>[...]</em></p>
            {/if}
        </div>
    </div>
</div>

<style>
    .card {
        --sq-frames: 4;
        --sq-fWidth: 192px;
        --sq-fHeight: 192px;
    }
    @keyframes square {
        0%,
        24.9% {
            background-position-x: 0px;
        }
        25%,
        49.9% {
            background-position-x: -192px;
        }
        50%,
        74.5% {
            background-position-x: -384px;
        }
        75%,
        99.9% {
            background-position-x: -576px;
        }
        100% {
            background-position-x: -576px;
        }
    }

    .card div.anim {
        animation: square 0.25s infinite forwards linear;
    }
</style>
