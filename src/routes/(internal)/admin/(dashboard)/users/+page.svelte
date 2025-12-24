<script lang="ts">
    import PageChanger from "$lib/components/PageChanger.svelte";
    import BanHammer from "$lib/assets/images/page/account/ban_hammer.png";
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import type { User } from "$lib/types/user";

    let totalUsersCount = $state(0);
    let maxPages = $state(1);
    let currentUsers: User[] = $state([]);
    let usernameSearch = $state("");
    let currentPage = $state(1);

    async function getMaximumPages() {
        try {
            const fetchingPromise = await fetch("/api/data/user/count");
            const res = await fetchingPromise.text();
            totalUsersCount = Number.parseInt(res);
            maxPages = Math.ceil(Number.parseFloat(res) / 14.0);
        } catch (err) {
            console.error(`error: ${err}`);
            toast.error(`error: ${err}`);
        }
    }

    async function getUsers() {
        const apiDataCurrent = fetch(
            `/api/data/user/search?username=${usernameSearch}&page=${currentPage}`,
        )
            .then((r) => r.json())
            .then((r) => {
                currentUsers = r;
            });
        await toast.promise(apiDataCurrent, {
            loading: "Loading Users..",
            success: "Loaded users!",
            error: (e) => `${e.message}`,
        });
    }

    async function deleteUser(id: number) {
        const deleteFetch = fetch(`/api/user/delete?id=${id}`, {
            method: "DELETE",
        });
        await toast.promise(deleteFetch, {
            success: "Deleted User Successfully!",
            loading: "Deleting User...",
            error: (e) => `Error when deleting user: ${e.message}`,
        });
    }

    onMount(async () => {
        await getUsers();
        await getMaximumPages();
    });
</script>

<div class="xl:px-8 p-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Users</h2>
    <p>Showing {currentUsers.length} out of {totalUsersCount} users.</p>

    <div class="overflow-x-auto w-full flex flex-col gap-4 relative">
        <table
            class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full"
        >
            <thead
                class="hidden lg:table-header-group text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th class="px-3 py-2">ID</th>
                    <th class="px-3 py-2">USERNAME</th>
                    <th class="px-3 py-2">IMAGE</th>
                    <th class="px-3 py-2">DESCRIPTION</th>
                    <th class="px-3 py-2">IS_ADMIN</th>
                    <th class="px-3 py-2">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {#each currentUsers as user (user.id)}
                    <tr
                        class="flex flex-col lg:table-row lg:flex-none text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                    >
                        <td class="px-3 py-2">
                            <span class="lg:hidden">ID:</span>
                            <span>{user.id}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">USERNAME:</span>
                            <span>{user.username}</span>
                        </td>
                        <td class="px-3 py-2 flex flex-col items-center gap-4">
                            <span class="lg:hidden">IMAGE:</span>
                            <img
                                src={`/api/data/user/pfp?id=${user.id}`}
                                class="w-16 h-16"
                                alt="Profile Of User"
                            />
                            <button
                                class="btn flex flex-row w-max group"
                                onclick={() => {
                                    if (
                                        confirm(
                                            "Are you sure you want to delete this user's profile picture?",
                                        )
                                    )
                                        fetch(
                                            `/api/user/delete/pfp?id=${user.id}`,
                                            {
                                                method: "DELETE",
                                            },
                                        );
                                }}
                            >
                                <img
                                    src={BanHammer}
                                    alt="Ban Hammer"
                                    class="w-4 h-4 mr-2 non-pixelated group-hover:invert transition"
                                />
                                Force Delete
                            </button>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">DESCRIPTION:</span>
                            <span>{user.description}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">IS_ADMIN:</span>
                            <span>{user.is_admin}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">ACTIONS:</span>
                            {#if !user.is_admin}
                                <button
                                    class="btn flex flex-row w-max items-center group"
                                    onclick={async () => {
                                        if (
                                            confirm(
                                                `Are you sure you want to delete this user: ${user.username}`,
                                            )
                                        ) {
                                            await deleteUser(user.id);
                                            await getUsers();
                                        }
                                    }}
                                >
                                    <img
                                        src={BanHammer}
                                        alt="Ban Hammer"
                                        class="w-4 h-4 mr-2 non-pixelated group-hover:invert transition"
                                    />
                                    Delete User
                                </button>
                            {:else}
                                <em>No actions to take :3</em>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <PageChanger
        {maxPages}
        onupdate={async (page) => {
            currentPage = page;
            await getUsers();
        }}
    />
</div>
