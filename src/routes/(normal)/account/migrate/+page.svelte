<script lang="ts">
    import Background from "$lib/assets/images/page/user/world_machine.png";
    import NikoSmallCard from "$lib/components/NikoSmallCard.svelte";
    import toast, { Toaster } from "svelte-french-toast";
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
                    description: d["full_desc"],
                    short_desc: d["description"],
                    abilities: d["abilities"].map(
                        (v: { name: string }) => v.name,
                    ),
                    id: d["id"],
                    author_id: d["author_id"],
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

<Toaster />
{#if searchOpen}
    <div
        class="fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center"
    >
        <div
            class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 mx-8 my-auto"
        >
            <div class="flex flex-col gap-2 min-w-3xl">
                <h1>Add a Niko to your Request..</h1>

                <div class="w-full flex flex-row gap-4">
                    <input
                        class="w-full border-4"
                        placeholder="Search nikos by name..."
                        bind:value={searchQuery}
                    />
                    <button
                        class="btn"
                        onclick={async () => await getSearchData()}
                        >Search..</button
                    >
                </div>
                <div>
                    {#each searchList as niko (niko.id)}
                        <NikoSmallCard
                            name={niko.name}
                            id={niko.id}
                            author={niko.author}
                            btn_title="Add"
                            onclick={() => addNiko(niko)}
                        />
                    {/each}
                </div>
                <div>
                    <button class="btn w-full" onclick={() => closeSearch()}
                        >Close</button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}

<section class="w-full relative flex justify-center p-4">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <div
        class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen pt-5"
    >
        <a class="btn w-fit" href="/account">Go Back</a>
        <h1 class="h1-txt-size">Migration of Nikos</h1>
        {#if !data.authenticated}
            <p>You are currently not log in with Discord!</p>
            <a class="btn w-fit" href="/dred">Log in with Discord</a>
        {:else}
            <h1 class="text-3xl">Logged in as {data.discord_username}!</h1>
            <h1 class="text-2xl">
                Here you can request the NikoDex Dev team to move your Nikos to
                your NikoDex account!
            </h1>
            <button class="btn" onclick={() => openSearch()}>Add Niko</button>
            <div class="flex flex-col gap-2">
                {#each nikosList as niko (niko.id)}
                    <NikoSmallCard
                        name={niko.name}
                        id={niko.id}
                        author={niko.author}
                        btn_title="Remove"
                        onclick={() => removeNiko(niko)}
                    />
                {/each}
            </div>
            <button class="btn" onclick={async () => await postRequest()}
                >Submit</button
            >
        {/if}
    </div>
</section>
