<script lang="ts">
    import EditModal from "$lib/components/EditModal.svelte";
    import NikoImage from "./NikoImage.svelte";
    const maxAbilitiesChar = 100;
    const maxAbilitiesCnt = 5;
    const viewMore = "...";
    let edit_mode = $state(false);
    let editModal: EditModal;

    let {
        name = "",
        author = "",
        short_desc = "",
        description = "",
        abilities = [] as { id: number; name: string; niko_id: number }[],
        id = 0,
        is_blacklisted = false,
        author_id,
        full_expand = false,
        edit_allow = false,
    } = $props();

    let author_link = $derived.by(() =>
        author === "nightmargin"
            ? "https://bsky.app/profile/nightmargin.bsky.social"
            : `/account/${author}`,
    );

    let shortenedAbilities = $derived.by(() => {
        let curLen = 0;
        let out: { id: number; name: string; niko_id: number }[] = [];
        for (let i of abilities.slice(0, maxAbilitiesCnt)) {
            if (curLen >= maxAbilitiesChar) {
                out.push({ name: viewMore, id: i.id, niko_id: i.niko_id });
                break;
            }
            let str = i.name.slice(0, maxAbilitiesChar - viewMore.length);
            if (i.name.length >= maxAbilitiesChar - viewMore.length)
                str += viewMore;
            out.push({ name: str, id: i.id, niko_id: i.niko_id });
            curLen += i.name.length;
        }
        return out;
    });
</script>

<EditModal
    {id}
    {name}
    description={short_desc}
    full_desc={description}
    {is_blacklisted}
    {author}
    {author_id}
    bind:open={edit_mode}
    bind:this={editModal}
/>
<div class="w-full card">
    <div
        class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 max-w-full w-full flex-col md:flex-row {!full_expand
            ? 'lg:max-w-[640px]'
            : ''}"
    >
        <div class="img flex flex-col gap-2 bg-black">
            <NikoImage {id} {name} {author} {is_blacklisted}></NikoImage>
            <a class="btn text-center" href={`/noik/${id}`}>Expand</a>
            <a class="btn text-center" href={`/twm/${id}`}>TWM View</a>
            {#if edit_allow}
                <button
                    class="btn text-center"
                    onclick={() => {
                        edit_mode = true;
                        if (editModal) {
                            editModal.setAbilities(abilities);
                        }
                    }}>Edit</button
                >
            {/if}
        </div>
        <div class="info grow relative">
            <p class="absolute right-0 bottom-0 text-gray-500">
                <em>#{id}</em>
            </p>
            <h2 class="h2-txt-size w-fit">{name}</h2>
            <p class="wrap-anywhere"><em>"{short_desc}"</em></p>
            <p>
                By:
                {#if author_id != undefined}
                    <a
                        class="bg-white text-black w-fit px-1 break-all"
                        href={author_link}>{author}</a
                    >
                {:else if author != ""}
                    <span class="bg-white text-black px-1 break-all"
                        >{author}</span
                    >
                {:else}
                    <span><em>[unknown]</em></span>
                {/if}
            </p>
            <p class="bg-white text-black w-fit px-1">Abilities:</p>
            <ul class="list-disc list-inside">
                {#each shortenedAbilities as ability, idx (idx)}
                    <li class="break-words">{ability.name}</li>
                {:else}
                    <li><em>[undetermined]</em></li>
                {/each}
            </ul>
            <p><em>[...]</em></p>
        </div>
    </div>
</div>
