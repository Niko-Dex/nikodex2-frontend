<script lang="ts">
    let { form } = $props();
    import Background from "$lib/assets/images/page/user/world_machine.png";
    import { onMount } from "svelte";
    import { toast } from "svelte-french-toast";
    import FileUpload from "$lib/components/FileUpload.svelte";
    import PageChanger from "$lib/components/PageChanger.svelte";
    import PostCard from "$lib/components/PostCard.svelte";
    import type { Post } from "$lib/types/post.js";

    import { page } from "$app/state";
    import { api } from "$lib/helper/helper.js";
    const currentUser = $derived(page.data.currentUser);
    let dataErr = $state(false);
    let maxPages = $state(1);
    let currentPage = $state(1);
    let apiData: Post[] = $state([]);
    let newPostModal = $state(false);
    let postTitle = $state("");
    let postContent = $state("");
    let dataLoaded = $state(false);

    if (form?.error) {
        toast.error(form.msg);
    }

    function openModal() {
        postTitle = "";
        postContent = "";
        newPostModal = true;
    }

    function closeModal() {
        newPostModal = false;
    }

    async function getData() {
        if (currentPage < 1 || (maxPages > 0 && currentPage > maxPages)) return;

        dataLoaded = false;
        dataErr = false;

        try {
            apiData = await api(`/api/posts/page?page=${currentPage}&count=10`);
            dataLoaded = true;
        } catch (err) {
            toast.error((err as Error).message);
            dataErr = true;
        }
    }

    async function getMaxPages() {
        dataErr = false;
        try {
            const res = await fetch(`/api/posts/count`);
            if (!res.ok) throw new Error("Failed to fetch count");

            const text = await res.text();
            maxPages = Math.ceil(Number.parseFloat(text) / 10.0);
        } catch (err) {
            toast.error((err as Error).message);
            dataErr = true;
        }
    }

    onMount(async () => {
        await getMaxPages();
        await getData();
    });
</script>

<svelte:head>
    <title>Posts!</title>
</svelte:head>

{#if newPostModal}
    <div
        class="transition duration-200 bg-black/75 fixed w-screen h-screen top-0 left-0 z-5 flex justify-center p-4"
    >
        <div
            class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 mx-8 my-auto md:w-fit w-full"
        >
            <div class="flex flex-col gap-2 w-full">
                <h1 class="text-3xl">New Post</h1>
                <form
                    class="md:min-w-3xl w-full"
                    method="POST"
                    enctype="multipart/form-data"
                >
                    <label>
                        <p>Name</p>
                        <input
                            name="title"
                            class="w-full"
                            type="text"
                            bind:value={postTitle}
                        />
                    </label>
                    <label>
                        <p>Content</p>
                        <textarea
                            name="content"
                            class="w-full"
                            bind:value={postContent}
                        ></textarea>
                    </label>
                    <label>
                        <p>Image</p>
                        <FileUpload
                            name="file"
                            accept="image/*"
                            required={true}
                        />
                    </label>
                    <br />
                    <input type="submit" class="btn w-full" value="Submit" />
                </form>
                <button class="btn" onclick={() => closeModal()}>
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}

<section class="w-full relative flex justify-center p-4">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
        <div class="flex flex-row justify-between items-center">
            <h1 class="h1-txt-size">Community Posts!</h1>
            {#if currentUser}
                <button class="btn" onclick={() => openModal()}
                    >Make a Post!</button
                >
            {:else}
                <p><em>You must be logged in to make posts! :o</em></p>
            {/if}
        </div>
        <p>
            <em
                >wanna share something? this is the place for you! just don't
                shitpost here :c</em
            >
        </p>
        {#if dataLoaded}
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-2">
                {#each apiData as post, idx (idx)}
                    <PostCard
                        id={post.id}
                        title={post.title}
                        username={post.user.username}
                    />
                {/each}
            </div>
        {:else if dataErr}
            <p class="text-center">woops! something has gone wrong :c</p>
        {:else}
            <p class="text-center">loading...</p>
        {/if}
    </div>
</section>
<PageChanger
    {maxPages}
    onupdate={async (page) => {
        currentPage = page;
        await getData();
    }}
    disabled={dataErr}
/>
