<script lang="ts">
    import { api, performAction } from "$lib/helper/helper";
    import type { Blog } from "$lib/types/blog";
    import { onMount } from "svelte";

    let editMode: Record<number, boolean> = $state({});
    let oldData: Record<number, Blog> = {};
    let apiData = $state<Blog[]>([]);

    async function getData() {
        const promise = api("/api/data/blogs").then((data) => (apiData = data));
        await performAction(promise, {
            loading: "Loading blog data...",
            success: "Loaded!",
            error: "Error while loading blog data",
        });
    }

    async function createData(ev: MouseEvent) {
        const btn = ev.currentTarget as HTMLButtonElement;
        btn.disabled = true;

        const data = {
            title: "placeholder",
            author: "placeholder",
            content: "placeholder",
        };
        const promise = api("/api/data/blogs", "POST", data).then(getData);

        await performAction(promise, {
            loading: "Creating blog entry...",
            success: "Created!",
            error: "Error while creating blog entry",
        });

        btn.disabled = false;
    }

    function startEdit(row: Blog) {
        editMode[row.id] = true;
        oldData[row.id] = { ...row };
    }

    async function saveEdit(row: Blog) {
        const { id, title, author, content } = row;
        const promise = api(`/api/data/blogs?id=${id}`, "PUT", {
            title,
            author,
            content,
        }).then(() => {
            delete oldData[id];
            editMode[id] = false;
        });

        await performAction(promise, {
            loading: "Updating blog entry...",
            success: "Updated!",
            error: "Error while updating blog entry",
        });
    }

    function cancelEdit(row: Blog) {
        if (oldData[row.id]) {
            const index = apiData.findIndex((b) => b.id === row.id);
            if (index !== -1) apiData[index] = { ...oldData[row.id] };
            delete oldData[row.id];
        }
        editMode[row.id] = false;
    }

    async function deleteEntry(row: Blog) {
        if (!confirm("Are you sure you want to delete this entry?")) return;

        const promise = api(`/api/data/blogs?id=${row.id}`, "DELETE").then(
            () => {
                apiData = apiData.filter((b) => b.id !== row.id);
                delete oldData[row.id];
                editMode[row.id] = false;
            },
        );

        await performAction(promise, {
            loading: "Deleting blog entry...",
            success: "Deleted!",
            error: "Error while deleting blog entry",
        });
    }

    onMount(getData);
</script>

<div class="xl:px-8 p-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Blog Entries</h2>
    <p>Database currently holding {apiData.length} entries.</p>
    <div class="flex flex-col gap-4">
        <table
            class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full"
        >
            <thead
                class="hidden lg:table-header-group text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th class="px-3 py-2">ID</th>
                    <th class="px-3 py-2">Title</th>
                    <th class="px-3 py-2">Author</th>
                    <th class="px-3 py-2">Content</th>
                    <th class="px-3 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each apiData as blog (blog.id)}
                    <tr
                        class="flex flex-col lg:table-row lg:flex-none text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                    >
                        <td class="px-3 py-2">
                            <span class="lg:hidden">ID:</span>
                            <span>{blog.id}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Title:</span>
                            <input
                                class="w-full min-w-[80px]"
                                disabled={!editMode[blog.id]}
                                bind:value={blog.title}
                            />
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Author:</span>
                            <input
                                class="w-full min-w-[80px]"
                                disabled={!editMode[blog.id]}
                                bind:value={blog.author}
                            />
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Content:</span>
                            <textarea
                                class="w-full min-w-[80px]"
                                disabled={!editMode[blog.id]}
                                bind:value={blog.content}
                            ></textarea>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Actions:</span>
                            <div class="flex flex-wrap gap-2">
                                {#if !editMode[blog.id]}
                                    <button
                                        class="btn min-w-20"
                                        onclick={() => startEdit(blog)}
                                        >Edit</button
                                    >
                                    <button
                                        class="btn min-w-20"
                                        onclick={async () => {
                                            await deleteEntry(blog);
                                        }}>Delete</button
                                    >
                                {:else}
                                    <button
                                        class="btn min-w-20"
                                        onclick={async () => {
                                            await saveEdit(blog);
                                        }}>Save</button
                                    >
                                    <button
                                        class="btn min-w-20"
                                        onclick={() => cancelEdit(blog)}
                                        >Cancel</button
                                    >
                                {/if}
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <button
            class="btn lg:w-60"
            onclick={async (e) => {
                await createData(e);
            }}>Add Entry</button
        >
    </div>
</div>
