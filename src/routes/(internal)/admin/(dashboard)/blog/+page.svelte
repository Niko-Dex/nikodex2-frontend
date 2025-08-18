<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast"

    let editMode: { [id: number]: boolean } = $state({})
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
                    <tr class="text-[16px]">
                        <td class="px-3 py-2">
                            <input class="w-full min-w-[80px]" disabled={!editMode[blog.id]} bind:value={blog.title}>
                        </td>
                        <td class="px-3 py-2">
                            <input class="w-full min-w-[80px]" disabled={!editMode[blog.id]} bind:value={blog.author}>
                        </td>
                        <td class="px-3 py-2">
                            <input class="w-full min-w-[80px]" disabled={!editMode[blog.id]} bind:value={blog.content}>
                        </td>
                        <td class="px-3 py-2">
                            <p>Actions..</p>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>