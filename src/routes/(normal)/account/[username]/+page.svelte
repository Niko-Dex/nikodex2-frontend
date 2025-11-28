<script lang="ts">
    import type { PageProps } from "./$types";
    import Background from "$lib/assets/images/page/user/world_machine.png";
    import { beforePage, fetchNikos } from "$lib/helper/noikHelper";
    import { onMount } from "svelte";
    import CardContainer from "$lib/components/CardContainer.svelte";
    import Card from "$lib/components/Card.svelte";
    import PostCard from "$lib/components/PostCard.svelte";
    let { data }: PageProps = $props();
    let userNoiks: Niko[] = $state([]);
    let userPosts: Post[] = $state([]);
    let page = $state("noiks");

    onMount(async () => {
        await fetchNikos(data.requestedInformation.id, userNoiks);

        await fetch(
            `/api/posts/user?user_id=${data.requestedInformation.id}`,
        ).then(async (e) => {
            if (e.ok) {
                userPosts = await e.json();
            } else {
                console.log(await e.text());
            }
        });
    });
</script>

<section class="w-full relative flex justify-center p-4">
    <div
        style="background-image: url({Background})"
        class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"
    ></div>
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <a class="btn w-fit" href={$beforePage}>Go Back</a>
        <h1 class="h1-txt-size text-center p-2">
            {data.requestedInformation.username}
        </h1>
        {#if data.requestedInformation.is_admin}
            <p class="bg-yellow-500 p-2 text-black w-fit">Administrator</p>
        {/if}
        <section class="flex flex-col gap-4">
            <h2 class="h2-txt-size">Bio / About Me:</h2>
            <div class="ring-2 p-5 ring-(--theme-color) bg-black">
                {#if data.requestedInformation.description.trim().length == 0}
                    <p><em>user has no description... 3:</em></p>
                {:else}
                    <p>{data.requestedInformation.description}</p>
                {/if}
            </div>
            <div class="flex flex-row gap-2 items-stretch">
                <button
                    class={page == "noiks" ? "active btn w-full" : "btn w-full"}
                    onclick={() => (page = "noiks")}>Noiks</button
                >
                <button
                    class={page == "posts" ? "active btn w-full" : "btn w-full"}
                    onclick={() => (page = "posts")}>Posts</button
                >
            </div>

            {#if page == "noiks"}
                {#if userNoiks.length == 0}
                    <p class="text-center h2-txt-size">no noiks! 3:</p>
                {:else}
                    <h2 class="h2-txt-size">Noiks ({userNoiks.length}):</h2>
                    <CardContainer>
                        {#each userNoiks as _apiData (_apiData.id)}
                            <Card
                                id={_apiData.id}
                                author={_apiData.author}
                                name={_apiData.name}
                                description={_apiData.description}
                                abilities={_apiData.abilities}
                                short_desc={_apiData.short_desc}
                            />
                        {/each}
                    </CardContainer>
                {/if}
            {/if}
            {#if page == "posts"}
                {#if userPosts.length == 0}
                    <p class="text-center h2-txt-size">no posts! 3:</p>
                {:else}
                    <h2 class="h2-txt-size">Posts ({userPosts.length})</h2>
                    <div class="grid grid-cols-2 gap-2">
                        {#each userPosts as _post (_post.id)}
                            <PostCard
                                id={_post.id}
                                title={_post.title}
                                username={_post.user.username}
                            />
                        {/each}
                    </div>
                {/if}
            {/if}
        </section>
    </div>
</section>
