<script lang="ts">
    import Squares from "$lib/assets/images/components/nohand.png";
    let isPatPat = $state(false);
    let {
        id,
        is_blacklisted,
        name,
        author,
    }: { id: number; is_blacklisted: boolean; name: string; author: string } =
        $props();

    let img_link = $derived(`/api/image?id=${id}`);
    let patpat_link = $derived(`/api/patpat?id=${id}`);
    let timeout: ReturnType<typeof setTimeout> | null = null;
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

<button
    class="max-w-[256px] w-full md:w-[256px] max-h-[256px] h-fit hover:cursor-grab niko-image {isPatPat
        ? 'pointer-events-none'
        : ''}"
    onpointerdown={patpat}
>
    {#if is_blacklisted}
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

<style>
    .niko-image {
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

    .niko-image div.anim {
        animation: square 0.25s infinite forwards linear;
    }
</style>
