<script lang="ts">
  import TrashIcon from "$lib/assets/images/page/account/trash_icon.png";

  let {
    id = 0,
    title = "",
    username = "",
    isDeletable = false,
    deleteRequested = Promise<void>,
  } = $props();
  let confirmDeletion = $state(false);
</script>

{#if confirmDeletion}
  <div class="fixed flex left-0 top-0 w-screen h-screen bg-black/60 z-20 p-4">
    <div
      class="min-w-32 min-h-32 flex flex-col gap-4 bg-black p-4 border-4 m-auto border-(--theme-color)"
    >
      <p class="h1-txt-size text-center">Are you sure?</p>
      <p class="text-center">There's no going back!</p>
      <div class="grid grid-cols-2 gap-4">
        <button
          class="btn"
          onclick={() => {
            deleteRequested();
            confirmDeletion = false;
          }}
        >
          Yes!
        </button>
        <button class="btn" onclick={() => (confirmDeletion = false)}
          >No...</button
        >
      </div>
    </div>
  </div>
{/if}

<div class="bg-black relative border-4 border-(--theme-color) p-2">
  {#if isDeletable}
    <button
      class="btn absolute right-0 mr-2 group"
      onclick={() => (confirmDeletion = true)}
      ><img
        src={TrashIcon}
        draggable="false"
        class="min-w-10 transition group-hover:invert min-h-10"
        alt="Trash Icon"
      />
    </button>
  {/if}

  <a href={`/post/${id}`} class="no-underline">
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
</div>
