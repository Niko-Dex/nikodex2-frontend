<script lang="ts">
    import toast, { Toaster } from "svelte-french-toast";
    let {
        open = $bindable(false),
        id = 0,
        name = "",
        description = "",
        full_desc = "",
        author = "",
        author_id = 0,
    } = $props();

    function close() {
        open = false;
    }

    async function submitEdit() {
        const reqBody = JSON.stringify({
            name: name,
            description: description,
            author: author,
            full_desc: full_desc,
            author_id: author_id,
        });

        const req = fetch(`/api/data?id=${id}`, {
            method: "PUT",
            body: reqBody,
        }).then(async (r) => {
            if (!r.ok) throw new Error(await r.text());
        });

        await toast.promise(req, {
            loading: "Submitting..",
            error: (e) => `Error submitting! ${e}`,
            success: "Successful edit!",
        });
    }
</script>

<Toaster />
{#if open}
    <div
        class="fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center"
    >
        <div
            class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 mx-8 my-auto"
        >
            <div class="flex flex-col gap-2 min-w-3xl">
                <h1>Editing {name}..</h1>
                <input type="text" bind:value={name} />
                <input type="text" bind:value={description} />
                <textarea bind:value={full_desc}></textarea>
                <button class="btn" onclick={async () => await submitEdit()}
                    >Submit</button
                >
                <button class="btn" onclick={() => close()}>Close</button>
            </div>
        </div>
    </div>
{/if}
