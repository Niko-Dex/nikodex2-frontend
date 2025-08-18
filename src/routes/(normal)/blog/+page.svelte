<script lang="ts">
    import BlogCard from "$lib/components/BlogCard.svelte";
    import { onMount } from "svelte";

    let apiData: {
        title: string
        author: string
        content: string
        post_datetime: string
    }[] = $state([])

    onMount(() => {
        fetch('/api/data/blogs')
            .then(res => res.json())
            .then(data => {
                for (let d of data) {
                    apiData.push({
                        title: d["title"],
                        author: d["author"],
                        content: d["content"],
                        post_datetime: d["post_datetime"]
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    })
</script>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<section class="w-full relative flex justify-center p-4">
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <h1 class="h1-txt-size">Blog!</h1>
        <div class="flex flex-col gap-2">
            {#each apiData as blog}
                <BlogCard 
                title={blog.title} 
                author={blog.author}
                content={blog.content} 
                post_datetime={blog.post_datetime}></BlogCard>
            {/each}
        </div>
    </div>
</section>