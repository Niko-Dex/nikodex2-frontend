<script lang="ts">
    import type { PageProps } from "./$types";
    import Background from "$lib/assets/images/page/noik/bg1.png";
    import GoBackButton from "$lib/components/GoBackButton.svelte";
    import toast from "svelte-french-toast";
    import { page } from "$app/state";
    import UserProfileComponent from "$lib/components/UserProfileComponent.svelte";
    import Copy from "$lib/assets/images/page/noik/Copy.svelte";
    import NikoImage from "$lib/components/NikoImage.svelte";
    import { resolve } from "$app/paths";
    import MetaTags from "$lib/components/MetaTags.svelte";
    let { data }: PageProps = $props();

    function absolute(path: string) {
        return `${data.origin}${path.startsWith("/") ? path : "/" + path}`;
    }
</script>

<MetaTags
    description="A creation of {data.noikData.author_name}!"
    title="The Nikodex // {data.noikData.name}"
    image={absolute(resolve(`/api/embed/nikosonas/${data.noikData.id}`))}
    type="website"
    url="https://nikodex.net/noik/{data.noikData.id}"
/>
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
            <NikoImage
                author={data.noikData.author_name}
                id={data.noikData.id}
                is_blacklisted={data.noikData.is_blacklisted}
                name={data.noikData.name}
            ></NikoImage>
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
