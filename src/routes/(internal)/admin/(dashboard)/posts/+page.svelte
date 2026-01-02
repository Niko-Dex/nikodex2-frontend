<script lang="ts">
    import PageChanger from "$lib/components/PageChanger.svelte";
    import BanHammer from "$lib/assets/images/page/account/ban_hammer.png";
    import type { Post } from "$lib/types/post";
    import { onMount } from "svelte";
    import { api, performAction } from "$lib/helper/helper";

    let currentPage = $state(1);
    let dataErr = $state(false);
    let maxPages = $state(0);
    let totalPostCount = $state(0);
    let apiData: Post[] = $state([]);

    async function getData() {
        if (currentPage < 1 || (maxPages > 0 && currentPage > maxPages)) return;

        const promise = api(`/api/posts/page?page=${currentPage}&count=10`)
            .then((jsonData) => {
                apiData = jsonData;
                dataErr = false;
            })
            .catch((e) => {
                dataErr = true;
                throw e;
            });

        await performAction(promise, {
            loading: "Loading posts...",
            success: "Loaded!",
            error: "Error while loading posts",
        });
    }

    async function deletePost(id: number) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const promise = api(`/api/posts/delete?id=${id}`, "DELETE").then(() => {
            apiData = apiData.filter((p) => p.id !== id);
            if (apiData.length === 0 && currentPage > 1) {
                currentPage--;
            }
            return getData();
        });

        await performAction(promise, {
            loading: "Deleting post...",
            success: "Deleted!",
            error: "Error while deleting post",
        });
    }
    async function getMaxPages() {
        try {
            dataErr = false;
            const res = await fetch(`/api/posts/count`);
            const data = await res.text();
            const val = Number.parseFloat(data);
            totalPostCount = val;
            maxPages = Math.ceil(val / 10.0);
        } catch (err) {
            console.log(err);
            dataErr = true;
        }
    }

    onMount(async () => {
        await getMaxPages();
        await getData();
    });
</script>

<div class="xl:px-8 p-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Community Posts</h2>
    <p>Showing {apiData.length} out of {totalPostCount} posts.</p>

    <div class="overflow-x-auto w-full flex flex-col gap-4 relative">
        <table
            class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full"
        >
            <thead
                class="hidden lg:table-header-group text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th class="px-3 py-2">ID</th>
                    <th class="px-3 py-2">AUTHOR</th>
                    <th class="px-3 py-2">TITLE</th>
                    <th class="px-3 py-2">CONTENT</th>
                    <th class="px-3 py-2">IMAGE</th>
                    <th class="px-3 py-2">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {#each apiData as postPiece, idx (idx)}
                    <tr
                        class="flex flex-col lg:table-row lg:flex-none text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                    >
                        <td class="px-3 py-2">
                            <span class="lg:hidden">ID:</span>
                            <span>{postPiece.id}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">AUTHOR:</span>
                            <span>{postPiece.user.username}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">TITLE:</span>
                            <span>{postPiece.title}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">CONTENT:</span>
                            <span>{postPiece.content}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">IMAGE:</span>
                            <img
                                src={`/api/posts/image?id=${postPiece.id}`}
                                alt={`Post with Title: ${postPiece.title}`}
                                class="max-w-32 max-h-32 border-2 border-(--theme-color)"
                            />
                        </td>
                        <td class="px-3 py-2 flex flex-col gap-4">
                            <span class="lg:hidden">ACTIONS:</span>
                            <button
                                class="btn flex flex-row items-center group w-fit"
                                onclick={async () => {
                                    await deletePost(postPiece.id);
                                }}
                                ><img
                                    src={BanHammer}
                                    class="w-4 h-4 mr-2 non-pixelated group-hover:invert transition"
                                    alt="Ban Hammer Icon."
                                />
                                Delete Post</button
                            >
                            <a
                                href="/admin/posts/comments/{postPiece.id}"
                                class="btn flex w-fit items-center group"
                            >
                                <img
                                    src={BanHammer}
                                    class="w-4 h-4 mr-2 non-pixelated group-hover:invert transition"
                                    alt="Ban Hammer Icon."
                                />
                                Moderate Comments
                            </a>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <PageChanger
        {maxPages}
        disabled={dataErr}
        onupdate={async (page: number) => {
            currentPage = page;
            await getData();
        }}
    ></PageChanger>
</div>
