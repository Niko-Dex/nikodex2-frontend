<script lang="ts">
    //? i'll say, this implementation of dropdown is actually brilliant.
    import { beforeNavigate, onNavigate } from "$app/navigation";
    import CloseIcon from "$lib/assets/images/components/close.png";

    let isShown = $state(false);

    let {
        btn_img = "",
        title,
        width,
        height = -1,
        custom_class,
        show_title = false,
    }: {
        btn_img?: string;
        title: string;
        width: number;
        height?: number;
        custom_class?: string;
        show_title?: boolean;
    } = $props();
    let trianglePoints = $derived(!isShown ? "0,0 0,16 16,8" : "0,0 16,0 8,16");
    beforeNavigate(() => {
        isShown = false;
    });
    onNavigate(() => {
        isShown = false;
    });
</script>

<div class="flex flex-row-reverse relative {custom_class}">
    <button
        onclick={() => (isShown = !isShown)}
        class="btn w-full flex flex-row gap-2 items-center group"
    >
        {#if btn_img != ""}
            <img
                src={isShown ? CloseIcon : btn_img}
                alt={title}
                class="w-4 h-4 sm:w-8 sm:h-8 group-hover:invert transition"
            />
            <span class={!show_title ? "lg:hidden" : ""}>{title}</span>
        {:else}
            <svg
                width="16"
                height="16"
                class="group-hover:invert fill-white transition"
            >
                <polygon points={trianglePoints}></polygon>
            </svg>
            <span>{title}</span>
        {/if}
    </button>
    <div
        class="absolute {isShown
            ? 'scale-100'
            : 'scale-0'} transition-all duration-200 origin-top-right grid gap-2 h-fit bg-black p-3 border-4 border-(--theme-color) z-50 max-w-full lg:max-w-none"
        style="width: {width}px; {height > 0
            ? `height: ${height}px`
            : ''}; top: calc(100% + 4px)"
    >
        <slot />
    </div>
</div>
