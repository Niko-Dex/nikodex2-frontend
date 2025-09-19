<script lang="ts">
    import BlogCard from "$lib/components/BlogCard.svelte";
    import Background from "$lib/assets/images/page/blog/tower.png"
    import { onMount } from "svelte";

    let apiData: {
        title: string
        author: string
        content: string
        post_datetime: string
    }[] = $state([])

    let dataLoaded = $state(false)
    let dataErr = $state(false)

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
                dataLoaded = true
            })
            .catch(err => {
                console.log(err)
                dataErr = true
            })
    })
</script>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<section class="w-full relative flex justify-center p-4">
    <div style="background-image: url({Background})" class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"></div>
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <h1 class="h1-txt-size">Blog!</h1>
        <p><em>Does anyone even read this?</em> -.-</p>
        {#if dataLoaded}
        <div class="flex flex-col gap-2">
            {#each apiData as blog}
                <BlogCard 
                title={blog.title} 
                author={blog.author}
                content={blog.content} 
                post_datetime={blog.post_datetime}></BlogCard>
            {/each}
        </div>
        {:else if dataErr}
        <p class="text-center"><em>woops! something has gone wrong while connecting to the API server :83c... check developer console for more info</em></p>
        {:else}
        <p class="text-center"><em>loading data from API, please wait...</em></p>
        {/if}
    </div>
</section>