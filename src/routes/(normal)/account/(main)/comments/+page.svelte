<script lang="ts">
    import type { NikodexComment } from "$lib/types/comment";
    import toast from "svelte-french-toast";
    import type { PageProps } from "./$types";
    import { onMount } from "svelte";
    import CommentCard from "$lib/components/CommentCard.svelte";
    import { dateFormatter } from "$lib/helper/helper";
    let { data }: PageProps = $props();

    let isLoading = $state(false);
    let apiData: NikodexComment[] = $state([]);
    async function getData() {
        isLoading = false;
        const userPostData = fetch(
            `/api/data/comments/userid?user_id=${data.id}`,
        )
            .then((r) => r.json())
            .then((r) => {
                isLoading = false;
                apiData = r;
            });
        await toast.promise(userPostData, {
            loading: "Loading comments...",
            success: "Loaded comments!",
            error: (e) => `Whoops! Got an error: ${e.message}`,
        });
    }
    onMount(async () => {
        await getData();
    });
</script>

<div class="flex flex-col gap-4">
    <h2 class="h2-txt-size">Your comment on Posts</h2>
    {#if !isLoading}
        {#each apiData as comment, idx (idx)}
            <CommentCard
                id={comment.id}
                username={comment.user.username}
                date={dateFormatter(comment.post_date)}
                author_id={comment.author_id}
                content={comment.content}
                original_poster={true}
                deletable={true}
                on_comment_delete={async () => await getData()}
            ></CommentCard>
        {/each}
    {:else}
        <p>Loading...</p>
    {/if}
</div>
