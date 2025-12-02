<script lang="ts">
    import toast from "svelte-french-toast";
    let { data }: PageProps = $props();
    import type { PageProps } from "./$types";
    import { onMount } from "svelte";
    let currentSubmissions: {
        id: number;
        name: string;
        description: string;
        full_desc: string;
        image: string;
        user_id: number;
    }[] = $state([]);

    async function getPendingSubmissions() {
        const fetchPendingSubmissions = fetch(
            `/api/data/submissions/userid?userid=${data.id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then((r) => r.json())
            .then((r) => {
                currentSubmissions = r;
                console.log(r);
            });

        await toast.promise(fetchPendingSubmissions, {
            loading: "Getting submissions...",
            success: "Fetched submissions data!",
            error: (e) => `buh i got an error: ${e.message}`,
        });
    }

    onMount(async () => {
        await getPendingSubmissions();
    });
</script>

<div class="flex flex-col gap-4">
    <div class="flex justify-between items-center gap-4">
        <h2 class="h2-txt-size">Your current submissions</h2>
        <a class="btn w-fit" href="/account/submit">Submit a Niko</a>
    </div>
    {#each currentSubmissions as submissionPiece (submissionPiece.id)}
        <section
            class="border-4 border-(--theme-color) p-5 bg-black flex flex-row gap-8"
        >
            <img
                src={`/api/data/submissions/img?id=${submissionPiece.id}`}
                class="w-32 h-32"
                alt="waiting noik :3"
            />
            <div class="w-full flex flex-col gap-4">
                <h2 class="h2-txt-size">
                    Submission: <span class="bg-white text-black px-1">
                        {submissionPiece.name}
                    </span>
                </h2>
                <p>
                    Description: <em>"{submissionPiece.description}"</em>
                </p>
                <p>
                    Full description: <em>"{submissionPiece.full_desc}"</em>
                </p>
                <p class="text-right">
                    <em
                        >This submission is waiting for moderator approval. :o</em
                    >
                </p>
            </div>
        </section>
    {:else}
        <p><em>you currently don't have any submissons!</em></p>
    {/each}
</div>
