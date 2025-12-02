<script lang="ts">
    let {
        id = 0,
        title = "",
        username = "",
        isDeletable = false,
        deleteRequested = Promise<void>,
    } = $props();
    let confirmDeletion = $state(false);
</script>

<div class="bg-black border-4 border-(--theme-color) p-2">
    <a href={`/post/${id}`}>
        <h2 class="h2-txt-size">{title}</h2>
        <p>
            By: <span class="bg-white text-black w-fit px-1">{username}</span>
        </p>
        <div class="flex flex-col items-center">
            <img
                alt={title}
                src={`/api/posts/image?id=${id}`}
                class="h-56 non-pixelated"
            />
        </div>
    </a>
    {#if isDeletable}
        {#if !confirmDeletion}
            <button class="btn" onclick={() => (confirmDeletion = true)}
                >Delete
            </button>
        {:else}
            <div class="flex flex-row items-center gap-4">
                <p>Are you sure?</p>
                <button
                    class="btn"
                    onclick={async () => await deleteRequested()}>Yes</button
                >
                <button class="btn" onclick={() => (confirmDeletion = false)}
                    >No</button
                >
            </div>
        {/if}
    {/if}
</div>
