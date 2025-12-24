<script lang="ts">
    let { categoryName = "General", children } = $props();

    let categoryIsHidden = $state(false);
    let trianglePoints = $derived(
        categoryIsHidden ? "0,0 0,16 16,8" : "0,0 16,0 8,16",
    );
</script>

<div class="flex flex-col gap-2">
    <button
        class="flex flex-row items-center gap-4 cursor-pointer group hover:bg-white transition pl-2"
        onclick={() => (categoryIsHidden = !categoryIsHidden)}
    >
        <svg
            width="16"
            height="16"
            class="group-hover:invert fill-white transition"
        >
            <polygon points={trianglePoints}></polygon>
        </svg>
        <h1 class="h2-txt-size group-hover:invert transition">
            {categoryName}
        </h1>
    </button>
    <hr />
    {#if !categoryIsHidden}
        {@render children?.()}
    {/if}
    <hr />
</div>
