<script lang="ts">
    import { api, performAction } from "$lib/helper/helper";
    import type { Submission } from "$lib/types/submission";
    import { onMount } from "svelte";
    let currentSubmissions = $state<Submission[]>([]);

    async function getAllPendingSubmissions() {
        const promise = api("/api/data/submissions").then(
            (data) => (currentSubmissions = data),
        );

        await performAction(promise, {
            loading: "Loading Submissions...",
            success: "Loaded!",
            error: "Failed to load Submissions!",
        });
    }

    async function removeSubmission(id: number) {
        const promise = api(`/api/data/submissions?id=${id}`, "DELETE").then(
            getAllPendingSubmissions,
        );

        await performAction(promise, {
            loading: "Deleting Submission...",
            success: `Deleted!`,
            error: "Error while deleting submission",
        });
    }

    async function acceptSubmission(submission: Submission) {
        const action = async () => {
            const userData = await api(
                `/api/data/user/userid?id=${submission.user_id}`,
            );

            await api("/api/data/submissions/accept", "POST", {
                submission_id: submission.id,
                name: submission.name,
                description: submission.description,
                author: userData.username,
                full_desc: submission.full_desc,
                author_id: submission.user_id,
                is_blacklisted: submission.is_blacklisted,
            });

            await getAllPendingSubmissions();
        };

        await performAction(action(), {
            loading: "Accepting submission...",
            success: "Accepted!",
            error: "Failed to accept submission",
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
                    <th class="px-3 py-2">FULL DESCRIPTION</th>
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
                            <span class="lg:hidden">User ID:</span>
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
                            <span class="lg:hidden">Is pattable:</span>
                            <span>{!currentSubmission.is_blacklisted}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Name:</span>
                            <span>{currentSubmission.name}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Description:</span>
                            <span>{currentSubmission.description}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Full description:</span>
                            <span>{currentSubmission.full_desc}</span>
                        </td>
                        <td class="px-3 py-2">
                            <span class="lg:hidden">Actions:</span>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    class="btn min-w-20"
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
                                    }}>Delete</button
                                >
                                <button
                                    class="btn min-w-20"
                                    onclick={async () =>
                                        await acceptSubmission(
                                            currentSubmission,
                                        )}>Accept</button
                                >
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
