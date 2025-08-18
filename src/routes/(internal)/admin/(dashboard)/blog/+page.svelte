<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast"

    let editMode: { [id: number]: boolean } = $state({})
    let oldData: { [id: number]: (typeof apiData)[number] } = {}
    let apiData: {
        id: number,
        title: string
        author: string
        content: string
        post_datetime: string
    }[] = $state([])

    async function getData() {
        apiData = []
        try {
            const res = await fetch('/api/data/blogs')
            const data = await res.json()
            for (let d of data) {
                apiData.push({
                    id: d["id"],
                    title: d["title"],
                    author: d["author"],
                    content: d["content"],
                    post_datetime: d["post_datetime"]
                })
            }
        }
        catch (e) {
            console.log(e)
            toast.error(`Something has gone wrong while trying to get data! ${e}`)
        }
    }

    async function createData(ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        const btn = ev.target as HTMLButtonElement
        btn.disabled = true
        const data = {
            title: "placeholder",
            author: "placeholder",
            content: "placeholder"
        }
        
        try {
            const out = await fetch("/api/data/blogs", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (out.status == 401) location.reload()
            if (out.status != 200) throw new Error(await out.text());

            toast.success("Successfully created a new entry!")
            await getData()
        }
        catch (e) {
            console.log(e)
            toast.error(`Something has gone wrong while trying to create data! ${e}`)
        }
        btn.disabled = false
    }

    function startEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = true
        oldData[row.id] = {...row}
    }

    async function saveEdit(row: (typeof apiData)[number]) {
        try {
            const out = await fetch(`/api/data/blogs?id=${row.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    "title": row.title,
                    "author": row.author,
                    "content": row.content
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (out.status == 401) location.reload()
            if (out.status != 200) throw Error(await out.text())

            toast.success("Blog was successfully updated.")
            delete oldData[row.id]
            editMode[row.id] = false
        }
        catch (e) {
            console.log(e)
            toast.error(`Something has gone wrong while trying to update data! ${e}`)
        }
    }

    function cancelEdit(row: (typeof apiData)[number]) {
        editMode[row.id] = false
        const old = oldData[row.id]
        if (old) {
            for (let key in row) {
                //@ts-ignore
                row[key] = oldData[row.id][key]
            }
        }
        delete oldData[row.id]
    }

    async function deleteEntry(row: (typeof apiData)[number]) {
        if (!confirm("Are you sure you wanna delete this blog?")) return
        try {
            const res = await fetch(`/api/data/blogs?id=${row.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.status == 401) location.reload()
            if (res.status != 200) throw Error(await res.text())

            toast.success("Blog was successfully deleted")
            delete oldData[row.id]
            apiData = apiData.filter((b) => b.id != row.id)
            editMode[row.id] = false
        }
        catch (e) {
            console.log(e)
            toast.error(`Something has gone wrong while trying to delete data! ${e}`)
        }
    }

    onMount(async () => {
        await getData()
    })

</script>

<div class="xl:px-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Blog Entries</h2>
    <button class="btn" onclick={async (e) => {await createData(e)}}>Add Entry</button>
    <div>
        <table class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full">
            <thead class="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th class="px-3 py-2">Title</th>
                    <th class="px-3 py-2">Author</th>
                    <th class="px-3 py-2">Content</th>
                    <th class="px-3 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each apiData as blog}
                    <tr class="text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <td class="px-3 py-2">
                            <input class="w-full min-w-[80px]" disabled={!editMode[blog.id]} bind:value={blog.title}>
                        </td>
                        <td class="px-3 py-2">
                            <input class="w-full min-w-[80px]" disabled={!editMode[blog.id]} bind:value={blog.author}>
                        </td>
                        <td class="px-3 py-2">
                            <textarea class="w-full min-w-[80px]" disabled={!editMode[blog.id]} bind:value={blog.content}></textarea>
                        </td>
                        <td class="px-3 py-2">
                            {#if !editMode[blog.id]}
                                <button class="hover:cursor-pointer hover:text-white" onclick={() => startEdit(blog)}>[Edit]</button>
                                <button class="hover:cursor-pointer hover:text-red-500" onclick={async() => { await deleteEntry(blog) }}>[Delete]</button>
                            {:else}
                                <button class="hover:cursor-pointer hover:text-green-500" onclick={async() => { await saveEdit(blog) }}>[Save]</button>
                                <button class="hover:cursor-pointer hover:text-red-500" onclick={() => cancelEdit(blog)}>[Cancel]</button>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>