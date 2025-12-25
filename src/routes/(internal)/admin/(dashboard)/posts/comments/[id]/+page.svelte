<script lang="ts">
  import { onMount } from "svelte";
  import type { PageProps } from "./$types";
  import BanHammer from "$lib/assets/images/page/account/ban_hammer.png";
  import toast from "svelte-french-toast";
  import type { NikodexComment } from "$lib/types/comment";
  import GoBackButton from "$lib/components/GoBackButton.svelte";
  let { data }: PageProps = $props();

  async function loadComments() {
    const commentFetchRequest = fetch(
      `/api/data/comments?post_id=${data.id}`
    ).then(async (r) => {
      const res = await r.json();
      if (!r.ok) throw res;
      apiData = res;
    });

    toast.promise(commentFetchRequest, {
      loading: "Loading Comments...",
      success: "Loaded Comments!",
      error: (e) => `Error while loading comments: ${e}`,
    });
  }

  async function deleteComment(comment_id: number) {
    const commentDeleteFetchRequest = fetch(
      `/api/comments/delete?id=${comment_id}`,
      {
        method: "DELETE",
      }
    ).then(async (r) => {
      const res = await r.json();
      if (!r.ok) throw res;
      await loadComments();
    });

    toast.promise(commentDeleteFetchRequest, {
      loading: "Deleting Comment...",
      success: "Deleted Comment!",
      error: (e) => `Error while deleting comment: ${e}`,
    });
  }
  let apiData: NikodexComment[] = $state([]);

  onMount(async () => {
    await loadComments();
  });
</script>

<div class="xl:px-8 p-4 flex flex-col gap-4">
  <GoBackButton _class="w-fit">Go Back</GoBackButton>
  <div class="flex flex-row items-center gap-4">
    <img
      src={`/api/posts/image?id=${data.id}`}
      alt="Post"
      class="max-w-32 max-h-32 border-2 border-(--theme-color)"
    />
    <h2 class="h2-txt-size">
      <em>Viewing Comments of Post with ID: {data.id}</em>
      <p class="text-xl">Total Comments: {apiData.length}</p>
    </h2>
  </div>
  <div class="overflow-x-auto w-full flex flex-col gap-4 relative">
    <table
      class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full"
    >
      <thead
        class="hidden lg:table-header-group text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th class="px-3 py-2">ID</th>
          <th class="px-3 py-2">AUTHOR</th>
          <th class="px-3 py-2">CONTENT</th>
          <th class="px-3 py-2">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {#each apiData as comment: NikodexComment, idx (idx)}
          <tr
            class="flex flex-col lg:table-row lg:flex-none text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
          >
            <td class="px-3 py-2">
              <span class="lg:hidden">Id:</span>
              <span>{comment.id}</span>
            </td>
            <td class="px-3 py-2">
              <span class="lg:hidden">Author:</span>
              <span>{comment.user.username}</span>
            </td>
            <td class="px-3 py-2">
              <span class="lg:hidden">Content:</span>
              <span>{comment.content}</span>
            </td>
            <td class="px-3 py-2">
              <span class="lg:hidden">Actions:</span>
              <button
                class="btn flex flex-row items-center group"
                onclick={async () => {
                  if (confirm("Are you sure you want to delete this comment?"))
                    await deleteComment(comment.id);
                }}
                ><img
                  src={BanHammer}
                  class="w-4 h-4 mr-2 non-pixelated group-hover:invert transition"
                  alt="Ban Hammer Icon."
                />
                Delete</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
