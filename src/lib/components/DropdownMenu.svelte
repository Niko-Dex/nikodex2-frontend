<script lang="ts">
    import { afterNavigate, onNavigate } from "$app/navigation";

    let {
        menuData,
        title,
    }: {
        menuData: {
            linkName: string;
            linkGoto: string;
        }[];
        title: string;
    } = $props();

    let isShown = $state(false);

    onNavigate(() => {
        isShown = false;
    });
</script>

<section class="flex flex-row-reverse">
    <button
        onclick={() => (isShown = true)}
        class="btn w-full flex flex-row gap-2 items-center"
    >
        <slot />
    </button>
    <div
        class="absolute {isShown
            ? 'scale-100'
            : 'scale-0'} transition-all duration-200 origin-top-right grid gap-2 w-80 h-fit bg-black p-3 border-4 border-(--theme-color) z-50"
    >
        <button class="btn w-fit float-left" onclick={() => (isShown = false)}
            >Close</button
        >
        <h1 class="h2-txt-size text-white items-center">{title}</h1>
        {#each menuData as menuPiece}
            <a
                class="btn text-white w-full h-full items-center flex flex-row"
                href={menuPiece.linkGoto}
            >
                <p class="text-center w-full">{menuPiece.linkName}</p>
            </a>
        {/each}
    </div>
</section>
