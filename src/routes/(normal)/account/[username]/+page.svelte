<script lang="ts">
    import type { PageProps } from "./$types";
    import Background from "$lib/assets/images/page/user/world_machine.png";
    import { fetchNikos } from "$lib/helper/helper";
    import { onMount } from "svelte";
    import CardContainer from "$lib/components/CardContainer.svelte";
    import Card from "$lib/components/Card.svelte";
    import PostCard from "$lib/components/PostCard.svelte";
    import type { Niko } from "$lib/types/nikosona";
    import type { Post } from "$lib/types/post";
    import GoBackButton from "$lib/components/GoBackButton.svelte";
    let { data }: PageProps = $props();
    let userNoiks: Niko[] = $state([]);
    let userPosts: Post[] = $state([]);
    let page = $state("noiks");

    onMount(async () => {
        userNoiks = await fetchNikos(data.requestedInformation.id);

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

<svelte:head>
    <title>NikoDex - {data.requestedInformation.username}</title>
</svelte:head>

<section class="w-full relative flex justify-center p-4">
    <div
        style="background-image: url({Background})"
        class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"
    ></div>
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <GoBackButton _class="w-fit">Go Back</GoBackButton>

        <div
            class="h1-txt-size text-center flex flex-row gap-4 items-center p-2"
        >
            <img
                src={`/api/data/user/pfp?id=${data.requestedInformation.id}`}
                alt="Profile picture of {data.requestedInformation.username}"
                class="w-25 h-25"
                fetchpriority="high"
            />
            {data.requestedInformation.username}
        </div>
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
                                description={_apiData.full_desc}
                                abilities={_apiData.abilities}
                                short_desc={_apiData.description}
                                is_blacklisted={_apiData.is_blacklisted}
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
