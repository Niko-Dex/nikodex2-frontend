<script lang="ts">
    import { goto } from "$app/navigation";
    import Background from "$lib/assets/images/page/noik/bg1.png"
    import { onMount } from "svelte";
    import toast, { Toaster } from "svelte-french-toast";
    let { data } = $props();
    import { env } from "$env/dynamic/public";

    let name = $state("")
    let desc = $state("")
    let full_desc = $state("")
    let abilities: string[] = $state([])
    let fileInput: HTMLInputElement | undefined = $state()

    let discord_logged: boolean = $state(false)
    let discord_username: string = $state("")
    let discord_id: string = $state("")

    function addAbilitiy() {
        abilities.push("Ability..")
    }

    async function submitData() {
        if (name.length == 0) {toast.error("You are missing a name!"); return}
        if (desc.length == 0) {toast.error("You are missing a description!"); return}
        if (full_desc.length == 0) {toast.error("You are missing a full description!"); return}
        if (fileInput == null || fileInput.files == null) {toast.error("You are missing an image!"); return}
        if (fileInput.files.length === 0) {toast.error("You are missing an image!"); return}

        const body = new FormData()
        body.append("name", name)
        body.append("author", discord_username)
        body.append("author_id", discord_id)
        body.append("description", desc)
        body.append("full_desc", full_desc)
        body.append("abilities", abilities.join('|||'))
        if (fileInput != null && fileInput.files != null)
            body.append("files[0]", fileInput.files[0])

        fetch(`${env.PUBLIC_BOT_SERVER_URL}/upload`, {
            method: 'POST',
            body: body
        })
        .then(r => r.json())
        .then(r => {
            console.log(r);

            toast.success("Your niko was sent for submission!")
            name = ""
            desc = ""
            full_desc = ""
            abilities = []
        })
        .catch(e => {
            console.log(e)
            toast.error(`Error! ${e}`)
        })
    }

    async function fetchDiscordUser(discord_token: string) {
        const disc = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${discord_token}`
            }
        })
        const discJson = await disc.json();

        discord_logged = true;
        discord_username = discJson['username'];
        discord_id = discJson['id']
    }

    onMount(async () => {
        if (data.discord_token) {
            await fetchDiscordUser(data.discord_token);
        }
    })
</script>

<svelte:head>
    <title>Submit a Niko!</title>
</svelte:head>

<Toaster></Toaster>
<section class="w-full relative flex justify-center">
    <div class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1" style="background-image: url({Background});"></div>
    <div class="flex flex-col w-full lg:max-w-3/5 md:max-w-full justify-center p-4 gap-4">
        {#if discord_logged}
            <h1 class="h1-txt-size">Submit a Niko!</h1>
            <p>You are currently logged in as <em>{discord_username}</em></p>
            <div class="flex flex-col p-0.5">
                <p>Name</p>
                <input bind:value={name} type="text">
            </div>
            <div class="flex flex-col p-0.5">
                <p>Description</p>
                <input bind:value={desc} type="text">
            </div>
            <div class="flex flex-col p-0.5">
                <p>Long Description</p>
                <textarea bind:value={full_desc}></textarea>
            </div>
            <div class="flex flex-col p-0.5 gap-2">
                <div class="flex flex-row justify-between items-center">
                    <p>Abilities</p>
                    <button class="btn" onclick={() => addAbilitiy()}>Add..</button>
                </div>
                {#each abilities as item, key}
                    <div class="flex flex-row max-w-full">
                        <input class="grow" bind:value={abilities[key]}>
                        <button class="btn" onclick={() => {
                            abilities.splice(key, 1)
                        }}>Remove</button>
                    </div>
                {/each}
            </div>
            <div class="flex flex-col p-0.5">
                <p>Image..</p>
                <input type="file" bind:this={fileInput}>
            </div>
            <button class="btn" onclick={async() => await submitData()}>Submit!</button>
        {:else}
            <div>
                <h1 class="h1-txt-size">Submit a Niko!</h1>
                <p>You are not logged in Discord!</p>
                <button class="btn" onclick={() => goto('/dred')}>Log in Discord</button>
            </div>
        {/if}
    </div>
</section>