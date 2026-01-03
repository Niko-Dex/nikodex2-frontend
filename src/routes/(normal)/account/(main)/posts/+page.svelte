<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import toast from "svelte-french-toast";
    import type { Post } from "$lib/types/post";
    import PostCard from "$lib/components/PostCard.svelte";
    import { api, performAction } from "$lib/helper/helper";
    let { data }: PageProps = $props();
    let apiData: Post[] = $state([]);
    let isLoading = $state(true);

    async function getData() {
        isLoading = true;
        try {
            apiData = await api(
                `/api/posts/user?user_id=${data.currentUser?.id}`,
            );
        } catch (e) {
            toast.error((e as Error).message);
        } finally {
            isLoading = false;
        }
    }

    async function deletePost(id: number) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const promise = api(`/api/posts/delete?id=${id}`, "DELETE").then(() => {
            apiData = apiData.filter((p) => p.id !== id);
        });

        await performAction(promise, {
            loading: "Deleting post...",
            success: "Deleted!",
            error: "Error while deleting post",
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
            ></PostCard>
        {:else}
            <p><em>no posts yet...</em></p>
        {/each}
    {:else}
        <p><em>loading...</em></p>
    {/if}
</div>
