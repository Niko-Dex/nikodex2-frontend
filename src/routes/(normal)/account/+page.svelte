<script lang="ts">
    import PendingSubmissionCard from "./../../../lib/components/PendingSubmissionCard.svelte";
    import Background from "$lib/assets/images/page/user/world_machine.png";
    import Card from "$lib/components/Card.svelte";
    import CardContainer from "$lib/components/CardContainer.svelte";
    import { goto } from "$app/navigation";
    import type { PageProps } from "./$types";
    import toast from "svelte-french-toast";
    import { onMount } from "svelte";
    import { fetchNikos } from "$lib/helper/noikHelper";
    import LogoutIcon from "$lib/assets/images/components/LogoutIcon.svelte";
        let { data }: PageProps = $props();

    let loaded = $state(true);
    let new_username = $state("");
    let new_description = $state("");
    let new_password = $state("");
    let new_password2 = $state("");

    let pageOpt = $state("main");
    let apiData: Niko[] = $state([]);
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
    async function updateUser(redirect: boolean) {
        const fetchUser = fetch(`/api/user/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                new_username,
                new_password,
                new_description,
            }),
        }).then(async (v) => {
            if (!v.ok) throw new Error((await v.json())["error"]);
            else {
                if (redirect) {
                    await fetch(`/api/user/logout`);
                    await goto("/account/login");
                }
            }
        });

        await toast.promise(fetchUser, {
            success: redirect
                ? "User updated! Please log back in."
                : "User updated!",
            loading: "Updating user",
            error: (e) => `Problem while updating user! ${e}`,
        });
    }

    onMount(async () => {
        new_username = data.username;
        new_description = data.description;
        loaded = true;
    });
</script>

<svelte:head>
    <title>Your Account!</title>
</svelte:head>

<section class="w-full relative flex justify-center">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <div class="flex flex-col max-w-[1200px] w-[1200px] p-4 gap-4 min-h-screen">
        <div class="flex justify-between items-center">
            <h1 class="h2-txt-size">
                Hello, {data.username}!
            </h1>
            <a
                class="btn w-fit flex flex-row items-center gap-4"
                href="/api/user/logout"
            >
                <LogoutIcon />
                Log Out
            </a>
        </div>

        <div class="flex flex-col sm:flex-row gap-2">
            <button
                class={pageOpt == "main" ? "btn active" : "btn"}
                onclick={() => {pageOpt = "main"}}>General Info</button
            >
            <button
                class={pageOpt == "noiks" ? "btn active" : "btn"}
                onclick={async () => {pageOpt = "noiks"; apiData = []; await fetchNikos(data.id, apiData);}}>Nikos</button
            >
            <button
                class={pageOpt == "submissions" ? "btn active" : "btn"}
                onclick={async () => {pageOpt = "submissions"; await getPendingSubmissions();}}>Submissions</button
            >
            <a class="btn sm:w-fit text-center" href="/account/migrate"
                >Migrate Nikos from Discord</a
            >
        </div>
        {#if pageOpt == "main"}
            <p>Your user ID is: {data.id}</p>
            {#if data.is_admin}
                <p>You are an admin!</p>
            {/if}
            <div class="flex flex-col gap-2">
                <h1 class="text-3xl">Bio/About Me</h1>
                <div class="min-w-full">
                    <textarea class="w-full" bind:value={new_description}
                    ></textarea>
                </div>
                <button
                    class="btn"
                    onclick={async () => await updateUser(false)}
                    >Update Info</button
                >
            </div>
            <div class="flex flex-col gap-2">
                <h1 class="text-3xl">Login info</h1>

                <div class="min-w-full">
                    <p>New Username:</p>
                    <input
                        class="w-full"
                        type="text"
                        bind:value={new_username}
                    />
                </div>

                <div class="min-w-full">
                    <p>New Password</p>
                    <input
                        class="w-full"
                        type="password"
                        bind:value={new_password}
                    />
                </div>

                <div class="min-w-full">
                    <p>Confirm New Password</p>
                    <input
                        class="w-full"
                        type="password"
                        bind:value={new_password2}
                    />
                </div>

                <button class="btn" onclick={async () => await updateUser(true)}
                    >Update Info</button
                >
            </div>
        {:else if pageOpt == "noiks"}
            <h1 class="text-3xl">Your Noiks! ({apiData.length})</h1>
            {#if loaded}
                <CardContainer>
                    {#each apiData as data (data.id)}
                        <Card
                            abilities={data.abilities}
                            author={data.author}
                            description={data.description}
                            name={data.name}
                            short_desc={data.short_desc}
                            id={data.id}
                            author_id={data.author_id}
                            edit_allow={true}
                        />
                    {/each}
                </CardContainer>
            {:else}
                <p>Loading..</p>
            {/if}
        {:else}
            {#each currentSubmissions as submissionPiece (submissionPiece.id)}
                <PendingSubmissionCard
                    id={submissionPiece.id}
                    name={submissionPiece.name}
                    description={submissionPiece.description}
                    full_desc={submissionPiece.full_desc}
                    image={`/api/data/submissions/img?id=${submissionPiece.id}`}
                />
            {:else}
            <p><em>you currently don't have any submissons!</em></p>
            {/each}
            <a class="btn w-fit" href="/account/submit">Submit a Niko</a>
        {/if}
    </div>
</section>
