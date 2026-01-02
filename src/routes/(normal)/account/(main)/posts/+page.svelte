<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import toast from "svelte-french-toast";
    import type { Post } from "$lib/types/post";
    import PostCard from "$lib/components/PostCard.svelte";
    let { data }: PageProps = $props();
    let apiData: Post[] = $state([]);
    let isLoading = $state(true);

    async function deletePost(id: number) {
        const deleteFetch = fetch(`/api/posts/delete?id=${id}`, {
            method: "DELETE",
        });
        await toast.promise(deleteFetch, {
            loading: "Deleting post...",
            success: "Deleted post!",
            error: (e) => `Encountered an error... ${e.message}`,
        });
    }
    async function getData() {
        const userPostData = fetch(`/api/posts/user?user_id=${data.id}`)
            .then((r) => r.json())
            .then((r) => {
                apiData = r;
                isLoading = false;
            });
        await toast.promise(userPostData, {
            loading: "Loading posts...",
            success: "Loaded posts!",
            error: (e) => `Whoops! Got an error: ${e.message}`,
        });
    }
    onMount(async () => {
        await getData();
    });
</script>

<div class="flex flex-col gap-4">
    <h2 class="h2-txt-size">Your Post(s)</h2>
    {#if !isLoading}
        {#each apiData as post, idx (idx)}
            <PostCard
                id={post.id}
                title={post.title}
                username={post.user.username}
                isDeletable={true}
                deleteRequested={async () => {
                    await deletePost(post.id);
                    await getData();
                }}
            ></PostCard>{/each}
    {:else}
        <p>Loading...</p>
    {/if}
</div>
