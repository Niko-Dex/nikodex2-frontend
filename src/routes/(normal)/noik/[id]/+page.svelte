<script lang="ts">
    import type { PageData, PageProps } from "./$types";
    import Background from "$lib/assets/images/page/noik/bg1.png";
    import type { Niko } from "$lib/types/nikosona";
    import GoBackButton from "$lib/components/GoBackButton.svelte";
    import toast from "svelte-french-toast";
    import { page } from "$app/state";
    import UserProfileComponent from "$lib/components/UserProfileComponent.svelte";
    import Copy from "$lib/assets/images/page/noik/Copy.svelte";
    let { data }: PageProps = $props();
</script>

<svelte:head>
    <title>Noik - {data.noikData.name}</title>
</svelte:head>
<section class="w-full relative flex flex-col items-center p-4">
    <div
        style="background-image: url({Background})"
        class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"
    ></div>
    <div
        class="max-w-full w-[800px] flex flex-col gap-4 min-h-screen bg-black border-4 border-(--theme-color) p-4"
    >
        <div class="flex flex-row gap-4 items-center">
            <GoBackButton>Go Back</GoBackButton>
            <button
                class="btn h-fit flex flex-row gap-2 items-center"
                onclick={() => {
                    navigator.clipboard.writeText(page.url.href);
                    toast.success("Copied to clipboard!");
                }}
            >
                <Copy></Copy>Copy Link</button
            >
        </div>
        <div
            class="flex flex-col md:flex-row flex-wrap h-full gap-4 overflow-auto"
        >
            <button class="w-[256px] h-fit">
                <img
                    src={`/api/image?id=${data.noikData.id}`}
                    class="w-full max-h-fit"
                    alt="Nikosona by {data.noikData.author}"
                />
            </button>
            <span class="flex flex-col gap-2 h-fit overflow-auto">
                <h1 class="h1-txt-size">{data.noikData.name}</h1>
                <em>"{data.noikData.description}"</em>
                <UserProfileComponent
                    username={data.noikData.author_name}
                    id={data.noikData.author_id}
                    subtext="Creator of this Nikosona"
                ></UserProfileComponent>
            </span>
        </div>

        <div>
            {#if data.noikData.abilities.length > 0}
                <h2 class="h2-txt-size mb-2">Abilities</h2>
            {/if}
            <ul class="list-disc ml-8">
                {#each data.noikData.abilities as ability (ability.id)}
                    <li>
                        {ability.name}
                    </li>
                {/each}
            </ul>
        </div>
        <div>
            <h2 class="h2-txt-size mb-2">Description</h2>
            <p class="mx-4">{data.noikData.full_desc}</p>
        </div>
    </div>
</section>
