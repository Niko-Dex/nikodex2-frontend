<script lang="ts">
    //? i'll say, this implementation of dropdown is actually brilliant.
    import { onNavigate } from "$app/navigation";

    let isShown = $state(false);

    let {
        btn_img = "",
        title,
        width,
        height = -1,
    }: {
        btn_img?: string;
        title: string;
        width: number;
        height?: number;
    } = $props();

    onNavigate(() => {
        isShown = false;
    });
</script>

<div class="flex flex-row-reverse relative">
    <button
        onclick={() => (isShown = true)}
        class="btn w-full flex flex-row gap-2 items-center sm:p-1 group"
    >
        {#if btn_img != ""}
            <img
                src={btn_img}
                width="32"
                height="32"
                alt={title}
                class="group-hover:invert"
            />
            <span class="sm:hidden">{title}</span>
        {:else}
            <span>{title}</span>
        {/if}
    </button>
    <div
        class="absolute {isShown
            ? 'scale-100'
            : 'scale-0'} transition-all duration-200 origin-top-right grid gap-2 h-fit bg-black p-3 border-4 border-(--theme-color) z-50 max-w-full sm:max-w-none"
        style="width: {width}px; {height > 0 ? `height: ${height}px` : ''}"
    >
        <button class="btn w-fit float-left" onclick={() => (isShown = false)}
            >Close</button
        >
        <slot />
    </div>
</div>
