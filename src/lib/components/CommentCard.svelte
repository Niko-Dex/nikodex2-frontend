<script lang="ts">
    import toast from "svelte-french-toast";

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
        <img
            src={`/api/data/user/pfp?id=${author_id}`}
            class="w-16 h-16"
            alt={`Profile picture of ${username}`}
        />
        <div class="flex flex-col">
            <a href={`/account/${username}`}>{username}</a>
            <span class="small-txt-size">{date}</span>
        </div>
        {#if deletable}
            <button class="ml-auto btn" onclick={async () => deleteComment()}
                >Delete</button
            >
        {/if}
    </div>

    <em>{content}</em>
</div>
