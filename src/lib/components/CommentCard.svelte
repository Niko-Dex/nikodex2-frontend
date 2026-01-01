<script lang="ts">
    import toast from "svelte-french-toast";
    import UserProfileComponent from "./UserProfileComponent.svelte";

    let {
        id,
        username,
        content,
        author_id,
        date,
        original_poster,
        deletable = false,
        on_comment_delete,
    }: {
        id: number;
        username: string;
        content: string;
        author_id: number;
        date: string;
        original_poster: boolean;
        deletable: boolean;
        on_comment_delete?: () => void;
    } = $props();

    async function deleteComment() {
        const fetchRequest = fetch(`/api/comments/delete?id=${id}`, {
            method: "DELETE",
        }).then(async (r) => {
            if (!r.ok) throw await r.text();
            on_comment_delete?.();
        });

        toast.promise(fetchRequest, {
            loading: "Deleting comment...",
            success: "Deleted comment!",
            error: (e) => `Error while deleting: ${e.msg}`,
        });
    }
</script>

<div
    class="bg-black border-4 border-(--theme-color) p-2 flex flex-col gap-4 relative"
>
    <div class="flex flex-row items-center gap-4 overflow-auto">
        <UserProfileComponent id={author_id} {username} subtext={date}
        ></UserProfileComponent>
        {#if deletable}
            <button class="ml-auto btn" onclick={async () => deleteComment()}
                >Delete</button
            >
        {/if}
    </div>

    <em>{content}</em>
</div>
