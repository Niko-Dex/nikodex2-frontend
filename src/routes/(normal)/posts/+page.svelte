<script lang="ts">
    import type { PageProps } from "./$types";
    let { data, form } = $props();
    import Background from "$lib/assets/images/page/user/world_machine.png";
    import { onMount } from "svelte";
    import { toast, Toaster } from "svelte-french-toast";
    import FileUpload from "$lib/components/FileUpload.svelte";

    let apiData: Post[] = $state([]);
    let newPostModal = $state(false);
    let postTitle = $state("");
    let postContent = $state("");

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

    onMount(() => {
        const req = fetch(`/api/posts`).then(async (res) => {
            if (!res.ok) {
                throw new Error((await res.json())["error"]);
            } else {
                apiData = await res.json();
            }
        });

        toast.promise(req, {
            loading: "Loading posts..",
            error: (e) => `Error! ${e}`,
            success: "Loaded posts!",
        });
    });
</script>

<svelte:head>
    <title>Posts!</title>
</svelte:head>

<Toaster />

{#if newPostModal}
    <div
        class="transition duration-200 bg-black/75 fixed w-screen h-screen top-0 left-0 z-5 flex justify-center"
    >
        <div
            class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 mx-8 my-auto"
        >
            <div class="flex flex-col gap-2">
                <h1 class="text-3xl">New Post..</h1>
                <form
                    class="min-w-3xl"
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

<section class="w-full relative flex justify-center">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <div
        class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen pt-5"
    >
        <div class="flex flex-row justify-between">
            <h1 class="h1-txt-size">Community Posts!</h1>
            {#if data?.authenticated}
                <button class="btn" onclick={() => openModal()}
                    >Make a Post!</button
                >
            {/if}
        </div>
        <div class="grid grid-cols-2 gap-2">
            {#each apiData as post}
                <a
                    href={`/post/${post.id}`}
                    class="bg-black border-4 border-(--theme-color) p-2"
                >
                    <p>{post.title}</p>
                    <p>
                        By: <span class="bg-white text-black w-fit px-1"
                            >{post.user.username}</span
                        >
                    </p>
                    <div class="flex flex-col items-center">
                        <img
                            alt={post.title}
                            src={`/api/posts/image?id=${post.id}`}
                            class="h-56"
                        />
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>
