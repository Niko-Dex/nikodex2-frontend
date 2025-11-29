<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import type { PageProps } from "./$types";
    import { sub } from "date-fns";
    let currentSubmissions: Submission[] = $state([]);
    let editMode: { [n: string]: any } = $state({});

    async function getAllPendingSubmissions() {
        const fetchData = fetch("/api/data/submissions", {
            method: "GET",
        }).then(async (r) => {
            const jsonData = await r.json();
            currentSubmissions = jsonData;
        });
        await toast.promise(fetchData, {
            loading: "Loading Submissions...",
            success: "Loaded Submissions!",
            error: "Failed to load Submissions!",
        });
    }

    async function removeSubmission(id: number) {
        const removalRequest = fetch(`/api/data/submissions?id=${id}`, {
            method: "DELETE",
        }).then(async () => await getAllPendingSubmissions());
        await toast.promise(removalRequest, {
            loading: "Please wait... Deleting Submission...",
            success: `Successfully deleted id: ${id}`,
            error: (e) => `buh i got an error: ${e.message}`,
        });
    }

    async function acceptSubmission(submission: Submission) {
        const createFetch = fetch(
            `/api/data/user/userid?id=${submission.user_id}`,
        )
            .then(async (r) => {
                const jsonData = await r.json();
                if (!r.ok) throw new Error(jsonData["error"]);
                await fetch("/api/data/submissions/accept", {
                    method: "POST",
                    body: JSON.stringify({
                        submission_id: submission.id,
                        name: submission.name,
                        description: submission.description,
                        author: jsonData["username"],
                        full_desc: submission.full_desc,
                        author_id: submission.user_id,
                        is_blacklisted: submission.is_blacklisted,
                    }),
                }).then(async (r) => {
                    if (!r.ok) throw new Error((await r.json())["error"]);
                });
            })
            .then(async () => await getAllPendingSubmissions());
        await toast.promise(createFetch, {
            loading: "Accepting submission...",
            success: "Accepted!",
            error: (e) => `${e.message}`,
        });
    }
    onMount(() => {
        getAllPendingSubmissions();
    });
</script>

<div class="xl:px-8 p-4 flex flex-col gap-4">
    <h2 class="h2-txt-size">Submissions</h2>
    <p>We currently have {currentSubmissions.length} submissions.</p>
    <div class="overflow-x-auto w-full flex flex-col gap-4 relative">
        <table
            class="table-auto text-left rtl:text-right bg-slate-800 text-gray-500 dark:text-gray-400 w-full"
        >
            <thead
                class="hidden lg:table-header-group text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th class="px-3 py-2">ID</th>
                    <th class="px-3 py-2">USER ID</th>
                    <th class="px-3 py-2">IMAGE</th>
                    <th class="px-3 py-2">IS PATTABLE</th>
                    <th class="px-3 py-2">NAME</th>
                    <th class="px-3 py-2">DESCRIPTION</th>
                    <th class="px-3 py-2">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {#each currentSubmissions as currentSubmission, idx (idx)}
                    <tr
                        class="flex flex-col lg:table-row lg:flex-none text-[16px] odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                    >
                        <td class="px-3 py-2">
                            <span class="lg:hidden">ID:</span>
                            <span>{currentSubmission.id}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">USER ID:</span>
                            <span>{currentSubmission.user_id}</span>
                        </td>
                        <td class="px-3 py-2">
                            <img
                                src="/api/data/submissions/img?id={currentSubmission.id}"
                                alt="Noik"
                                width="100"
                                height="100"
                            />
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">IS PATTABLE:</span>
                            <span>{!currentSubmission.is_blacklisted}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">NAME:</span>
                            <span>{currentSubmission.name}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">DESCRIPTION:</span>
                            <span>{currentSubmission.description}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">ACTIONS:</span>
                            <button
                                class="hover:text-red-500 cursor-pointer"
                                onclick={async () => {
                                    if (
                                        confirm(
                                            "Are you sure you want to delete this submission?",
                                        )
                                    ) {
                                        await removeSubmission(
                                            currentSubmission.id,
                                        );
                                    }
                                }}>[Delete]</button
                            >
                            /
                            <button
                                class="hover:text-green-500 cursor-pointer"
                                onclick={async () =>
                                    await acceptSubmission(currentSubmission)}
                                >[Accept]</button
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
