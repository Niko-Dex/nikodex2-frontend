<script lang="ts">
    import { onMount } from "svelte";

    let { title = "" } = $props()
    let visible = $state(false)

    let isGrabbing = false
    let offsetX = 0;
    let offsetY = 0;
    let dialog: HTMLDivElement | undefined = $state();

    export function show() {
        visible = true
    }
    export function hide() { visible = false }

    function mouseDown(ev: PointerEvent) {
        if (!dialog) return
        isGrabbing = true
        offsetX = dialog.offsetLeft - ev.clientX
        offsetY = dialog.offsetTop - ev.clientY
    }

    function mouseMove(ev: PointerEvent) {
        if (!dialog) return
        if (!isGrabbing) return
        ev.preventDefault()
        let left = ev.clientX + offsetX
        let top = ev.clientY + offsetY

        dialog.style.left = left + "px"
        dialog.style.top = Math.max(top, 0) + "px"
    }

    function mouseUp() {
        isGrabbing = false
    }

    onMount(() => {
        document.onpointermove = mouseMove
        document.onpointerup = mouseUp
    })
</script>

{#if visible}
<div class="twm-window fixed top-0 left-0 z-15 bg-black border-4 border-amber-600 min-w-[320px] min-h-[240px] grid grid-rows-[48px_1fr]" bind:this={dialog}>
    <div class="border-b-4 border-amber-600 flex items-center p-2 justify-between hover:cursor-grab" onpointerdown={mouseDown} role="dialog" tabindex="-1">
        <p class="select-none">{title}</p>
        <button class="bg-amber-600 hover:cursor-pointer hover:bg-white transition duration-100" aria-label="Close" onclick={() => visible = false}>
            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>
        </button>
    </div>
    <div class="content">
        <slot />
    </div>
</div>
{/if}