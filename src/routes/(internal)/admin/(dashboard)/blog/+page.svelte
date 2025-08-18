<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast"

    let apiData: {
        title: string
        author: string
        content: string
        post_datetime: string
    }[] = $state([])

    async function getData() {
        try {
            const res = await fetch('/api/data/blogs')
            const data = await res.json()
            for (let d of data) {
                apiData.push({
                    title: d["title"],
                    author: d["author"],
                    content: d["content"],
                    post_datetime: d["post_datetime"]
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    onMount(async () => {
        await getData()
    })

</script>

<div class="xl:px-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Blog Entries</h2>
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
                    <tr>
                        <th>{blog.title}</th>
                        <th>{blog.author}</th>
                        <th>{blog.content}</th>
                        <th>{blog.title}</th>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>