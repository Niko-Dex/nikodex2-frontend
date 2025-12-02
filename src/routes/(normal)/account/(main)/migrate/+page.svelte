<script lang="ts">
    import NikoSmallCard from "$lib/components/NikoSmallCard.svelte";
    import type { Niko } from "$lib/types/nikosona.js";
    import toast from "svelte-french-toast";
    let { data } = $props();
    let nikosList: Niko[] = $state([]);
    let searchOpen = $state(false);
    let searchQuery: string = $state("");
    let searchList: Niko[] = $state([]);

    function addNiko(item: Niko) {
        searchOpen = false;
        nikosList.push(item);
    }

    function removeNiko(item: Niko) {
        const index = nikosList.indexOf(item, 0);
        if (index > -1) {
            nikosList.splice(index, 1);
        }
    }

    function openSearch() {
        searchOpen = true;
    }

    function closeSearch() {
        searchOpen = false;
        searchList = [];
        searchQuery = "";
    }

    async function getSearchData() {
        if (searchQuery.length === 0) return;
        searchList = [];
        try {
            const res = await fetch(`/api/data/name?name=${searchQuery}`);
            const data = await res.json();

            for (let d of data) {
                searchList.push({
                    name: d["name"],
                    author: d["author_name"],
                    full_desc: d["full_desc"],
                    description: d["description"],
                    abilities: d["abilities"].map(
                        (v: { name: string }) => v.name,
                    ),
                    id: d["id"],
                    author_id: d["author_id"],
                    is_blacklisted: d["is_blacklisted"],
                });
            }
        } catch (e) {
            console.log(`getSearchData() error! ${e}`);
        }
    }

    async function postRequest() {
        let formData = new FormData();
        formData.append("user_id", data.user_id.toString());
        formData.append("username", data.user_username);
        formData.append("discord_id", data.discord_id);
        formData.append("discord_username", data.discord_username);
        formData.append("nikos", nikosList.map((n) => n.id).join("|"));

        const req = fetch(`/api/migrate`, {
            method: "POST",
            body: formData,
        }).then(async (v) => {
            if (!v.ok) throw new Error((await v.json())["error"]);
        });

        toast.promise(req, {
            loading: "Submitting..",
            error: (e) => `${e}`,
            success: "Thanks for submitting!",
        });
    }
</script>

{#if searchOpen}
    <div
        class="fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center"
    >
        <div
            class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 mx-8 my-auto max-h-full overflow-y-auto relative"
        >
            <div class="flex flex-col gap-2 md:min-w-3xl">
                <h1>Add a Niko to your Request..</h1>
                <div class="w-full flex flex-row gap-4">
                    <input
                        class="w-full border-4"
                        placeholder="Search nikos by name..."
                        onchange={async () => await getSearchData()}
                        bind:value={searchQuery}
                    />
                    <button
                        class="btn"
                        onclick={async () => await getSearchData()}
                        >Search..</button
                    >
                </div>
                <div class="flex flex-col gap-2">
                    {#each searchList as niko}
                        <NikoSmallCard
                            name={niko.name}
                            id={niko.id}
                            author={niko.author}
                            btn_title="Add"
                            onclick={() => addNiko(niko)}
                        />
                    {/each}
                </div>
                <div class="sticky bottom-0">
                    <button class="btn w-full" onclick={() => closeSearch()}
                        >Close</button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}

<div class="flex flex-col gap-4">
    {#if !data.authenticated}
        <p>You are currently not log in with Discord!</p>
        <a class="btn w-fit" href="/dred">Log in with Discord</a>
    {:else}
        <div class="flex justify-between items-center gap-4">
            <h2 class="h2-txt-size">Migrate from Discord Form</h2>
            <a
                class="btn w-fit flex flex-row items-center gap-4"
                href="/api/discord_auth/logout"
            >
                Sign out of Discord
            </a>
        </div>
        <p>
            Logged in as <em>{data.discord_username}</em> on Discord
        </p>
        <p>
            Make a request the NikoDex Dev team to move your Nikos to your
            Nikodex account here!
        </p>
        <div class="flex flex-col gap-2">
            {#each nikosList as niko}
                <NikoSmallCard
                    name={niko.name}
                    id={niko.id}
                    author={niko.author}
                    btn_title="Remove"
                    onclick={() => removeNiko(niko)}
                />
            {:else}
                <p class="text-center"><em>No Nikosona selected yet :c</em></p>
            {/each}
        </div>
        <div>
            <button class="btn" onclick={() => openSearch()}>Add Niko</button>
        </div>
        <button class="btn" onclick={async () => await postRequest()}
            >Submit!</button
        >
    {/if}
</div>
