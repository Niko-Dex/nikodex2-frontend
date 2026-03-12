<script lang="ts">
    import EditModal from "$lib/components/EditModal.svelte";
    import NikoImage from "./NikoImage.svelte";
    import TrashCanIcon from "$lib/assets/images/page/account/trash_icon.png";
    import Squares from "$lib/assets/images/components/nohand.png";
    import toast from "svelte-french-toast";
    import PopupBox from "./PopupBox.svelte";

    const maxAbilitiesChar = 100;
    const maxAbilitiesCnt = 5;

    const viewMore = "...";
    let editModal: EditModal;
    let editMode = $state(false);

    // Deletion Panel.
    let deleteRequested = $state(false);
    let deleteInput = $state("");
    let deleteAnimation = $state({ x: 0, y: 0 });
    let shakeOffset = 10;

    let lastDuration = 0.0;
    let ticks = 0.0;

    let {
        name = "",
        author = "",
        short_desc = "",
        description = "",
        abilities = [] as { id: number; name: string; niko_id: number }[],
        id = 0,
        is_blacklisted = false,
        author_id = undefined,
        full_expand = false,
        edit_allow = false,
        on_delete = () => {},
    } = $props();

    let author_link = $derived.by(() =>
        author === "nightmargin"
            ? "https://bsky.app/profile/nightmargin.bsky.social"
            : `/account/${author}`
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
            if (i.name.length >= maxAbilitiesChar - viewMore.length) str += viewMore;
            out.push({ name: str, id: i.id, niko_id: i.niko_id });
            curLen += i.name.length;
        }
        return out;
    });

    function retrieveRandom() {
        return Math.random() * shakeOffset;
    }

    function getRandomRange() {
        return retrieveRandom() - retrieveRandom();
    }

    function shakeFrame(callback: number) {
        const deltaTime = (callback - lastDuration) / 100;
        ticks += deltaTime;

        if (ticks > 1) {
            deleteAnimation = {
                x: getRandomRange(),
                y: getRandomRange(),
            };
            ticks = 0.0;
        }

        lastDuration = callback;
        if (deleteRequested) requestAnimationFrame(shakeFrame);
    }
</script>

{#if deleteRequested}
    <PopupBox>
        <div class="items-center flex md:flex-row flex-col gap-4">
            <div
                class="relative"
                style="transform: translate({deleteAnimation.x}px, {deleteAnimation.y}px);"
            >
                <div
                    class="transition w-30 absolute h-30 bg-(image:--bg) top-0 left-0 z-1 animate-[square_0.5s_infinite_forwards_linear]"
                    style="--bg: url({Squares}); transition-timing-function: cubic-bezier(0.260, 0.010, 0.310, 0.990);"
                ></div>
                <img src={`/api/image?id=${id}`} class="w-30 h-30" alt={name} />
            </div>

            <div class="flex flex-col gap-4">
                <h1 class="h1-txt-size bg-red-500">Hold up!</h1>

                <span>
                    <p>"{name}" will be gone.. <em>forever!</em></p>
                    <p class="font-extrabold">You will never see them again...</p>
                </span>

                <label class="flex flex-col gap-2">
                    To confirm, type their name:
                    <input
                        type="text"
                        bind:value={deleteInput}
                        placeholder="type: {name} here to confirm..."
                    />
                </label>

                <div class="grid md:grid-cols-2 gap-4 mt-auto">
                    <button
                        class="btn"
                        disabled={deleteInput.toLowerCase() != name.toLowerCase()}
                        onclick={() => {
                            let deletionFetch = fetch(`/api/data?id=${id}`, {
                                method: "DELETE",
                            }).then(async (r) => {
                                if (!r.ok) throw await r.json();

                                on_delete();
                            });

                            toast.promise(deletionFetch, {
                                loading: "Deleting this Noik...",
                                success: "Your Noik is gone... 3:",
                                error: (e) => `Failure while deleting Noik! ${e.error}`,
                            });
                        }}>Yes</button
                    >
                    <button class="btn" onclick={() => (deleteRequested = false)}>No</button>
                </div>
            </div>
        </div>
    </PopupBox>
{/if}

<EditModal
    {id}
    {name}
    description={short_desc}
    full_desc={description}
    {is_blacklisted}
    {author}
    {author_id}
    bind:open={editMode}
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
                <div class="grid grid-cols-2 gap-2">
                    <button
                        class="btn text-center"
                        onclick={() => {
                            editMode = true;
                            if (editModal) {
                                editModal.setAbilities(abilities);
                            }
                        }}>✐ Edit</button
                    >
                    <button
                        class="btn text-center group flex flex-row justify-center gap-2 items-center"
                        onclick={() => {
                            deleteRequested = true;
                            requestAnimationFrame(shakeFrame);
                        }}
                    >
                        <img
                            src={TrashCanIcon}
                            class="min-w-5 min-h-5 group-hover:invert transition"
                            alt="Trashcan Icon"
                        />Delete
                    </button>
                </div>
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
                    <a class="bg-white text-black w-fit px-1 break-all" href={author_link}
                        >{author}</a
                    >
                {:else if author != ""}
                    <span class="bg-white text-black px-1 break-all">{author}</span>
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
