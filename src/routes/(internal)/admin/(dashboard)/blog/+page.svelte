<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";

    let editMode: { [id: number]: boolean } = $state({});
    let oldData: { [id: number]: (typeof apiData)[number] } = {};
    let apiData: {
        id: number;
        title: string;
        author: string;
        content: string;
        post_datetime: string;
    }[] = $state([]);

    async function getData() {
        apiData = [];
        const fetchBlogs = fetch("/api/data/blogs").then(async (v) => {
            const jsonData = await v.json();
            if (!v.ok) throw new Error(jsonData["error"]);
            for (let d of jsonData) {
                apiData.push({
                    id: d["id"],
                    title: d["title"],
                    author: d["author"],
                    content: d["content"],
                    post_datetime: d["post_datetime"],
                });
            }
        });

        await toast.promise(fetchBlogs, {
            success: "Fetched blogs data!",
            loading: "Fetching blogs",
            error: (e) => `Error while fetching blogs: ${e.message}`,
        });
    }

    async function createData(
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) {
        const btn = ev.target as HTMLButtonElement;
        btn.disabled = true;
        const data = {
            title: "placeholder",
            author: "placeholder",
            content: "placeholder",
        };

        const fetchBlogs = fetch("/api/data/blogs", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (v) => {
            if (v.status == 401) location.reload();
            const jsonData = await v.json();
            if (!v.ok) throw new Error(jsonData["error"]);
            await getData();
            return null;
        });

        await toast.promise(fetchBlogs, {
            success: "New entry created!",
            loading: "Creating blog entry",
            error: (e) => `Error while creating entry: ${e.message}`,
        });

        btn.disabled = false;
    }

    function startEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = true;
        oldData[row.id] = { ...row };
    }

    async function saveEdit(row: (typeof apiData)[number]) {
        const fetchBlogs = fetch(`/api/data/blogs?id=${row.id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: row.title,
                author: row.author,
                content: row.content,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (v) => {
            if (v.status == 401) location.reload();
            const jsonData = await v.json();
            if (!v.ok) throw new Error(jsonData["error"]);
            delete oldData[row.id];
            editMode[row.id] = false;
            return null;
        });

        await toast.promise(fetchBlogs, {
            success: "Blog updated!",
            loading: "Updating blog",
            error: (e) => `Error while updating blog: ${e.message}`,
        });
    }

    function cancelEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = false;
        const old = oldData[row.id];
        if (old) {
            for (let key in row) {
                //@ts-ignore
                row[key] = oldData[row.id][key];
            }
        }
        delete oldData[row.id];
    }

    async function deleteEntry(row: (typeof apiData)[number]) {
        if (!confirm("Are you sure you wanna delete this blog?")) return;
        const fetchBlogs = fetch(`/api/data/blogs?id=${row.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (v) => {
            if (v.status == 401) location.reload();
            const jsonData = await v.json();
            if (!v.ok) throw new Error(jsonData["error"]);
            delete oldData[row.id];
            apiData = apiData.filter((b) => b.id != row.id);
            editMode[row.id] = false;
            return null;
        });

        await toast.promise(fetchBlogs, {
            success: "Blog deleted!",
            loading: "Deleting blog",
            error: (e) => `Error while deleting blog: ${e.message}`,
        });
    }

    onMount(async () => {
        await getData();
    });
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
