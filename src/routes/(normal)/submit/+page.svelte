<script lang="ts">
    import { goto } from "$app/navigation";
    import Background from "$lib/assets/images/page/submit/library.png"
    import FileUpload from "$lib/components/FileUpload.svelte";
    import { onMount } from "svelte";
    import toast, { Toaster } from "svelte-french-toast";
    let { data } = $props();

    let name = $state("")
    let desc = $state("")
    let full_desc = $state("")
    let abilities: string[] = $state([])
    const abilitiesMaxLimit = 20
    let fileInput: HTMLInputElement | undefined = $state()

    let discord_acc_status: "logging_in" | "unauthenticated" | "authenticated" = $state("logging_in")
    let discord_username: string = $state("")
    let discord_id: string = $state("")

    function addAbilitiy() {
        if (abilities.length > abilitiesMaxLimit) return
        abilities.push("Ability..")
    }

    async function submitData() {
        console.log(fileInput)
        if (name.length == 0) {toast.error("You are missing a name!"); return}
        if (desc.length == 0) {toast.error("You are missing a description!"); return}
        if (full_desc.length == 0) {toast.error("You are missing a full description!"); return}
        if (fileInput == null || fileInput.files == null) {toast.error("You are missing an image!"); return}
        if (fileInput.files.length === 0) {toast.error("You are missing an image!"); return}

        const body = new FormData()
        body.append("name", name)
        body.append("description", desc)
        body.append("full_desc", full_desc)
        body.append("abilities", abilities.join('|||'))
        if (fileInput != null && fileInput.files != null)
            body.append("files[0]", fileInput.files[0])

        const fetchSubmit = fetch(`/api/submit`, {
            method: 'POST',
            body: body
        })
        .then(async v => {
            const jsonData = await v.json()
            if (!v.ok) throw new Error(jsonData["error"])
            name = ""
            desc = ""
            full_desc = ""
            abilities = []
        })

        await toast.promise(fetchSubmit, {
            success: "Your Niko's submission has been sent!",
            loading: "Sending your submission",
            error: (e) => `Error while submitting: ${e.message}`
        })
    }

    async function discordLogOut() {
        const fetchLogout = fetch('/api/discord_auth/logout', {
            method: 'POST'
        })
        .then(async res => {
            if (res.ok) {
                discord_acc_status = "unauthenticated";
                discord_username = '';
                discord_id = '';
            } else {
                const jsonData = await res.json()
                if (!res.ok) throw new Error(jsonData["error"])
            }
        })

        await toast.promise(fetchLogout, {
            success: "Logged out!",
            loading: "Logging out of Discord",
            error: (e) => `Error while logging out: ${e.message}`
        })
    }

    onMount(async () => {
        if (data.authenticated) {
            discord_username = data.discord_username
            discord_id = data.discord_id
            discord_acc_status = "authenticated"
        } else {
            discord_acc_status = "unauthenticated";
        }
    })
</script>

<svelte:head>
    <title>Submit a Niko!</title>
</svelte:head>

<Toaster></Toaster>
<section class="w-full relative flex justify-center">
    <div class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "></div>
    <div class="flex flex-col max-w-[1200px] w-[1200px] p-4 gap-4 min-h-screen">
        <h1 class="h1-txt-size">Submit a Niko!</h1>
        {#if discord_acc_status == "authenticated"}
            <div class="flex flex-row gap-4 items-center justify-between">
                <p>You are currently logged in as <em title={discord_id}>{discord_username}</em></p>
                <button class="btn" onclick={async() => await discordLogOut()}>Logout</button>
            </div>
            <div class="flex flex-col p-0.5">
                <label class="w-full">
                    <p>Name <em>(max 120 bytes/ASCII characters)</em></p>
                    <input bind:value={name} type="text" class="w-full" maxlength="120" placeholder="Name for your Nikosonas...">
                </label>
            </div>
            <div class="flex flex-col p-0.5">
                <label class="w-full">
                    <p>Short Description <em>(max 250 bytes/ASCII characters)</em></p>
                    <input bind:value={desc} type="text" class="w-full"  maxlength="250" placeholder="A short description for your Nikosonas...">
                </label>
            </div>
            <div class="flex flex-col p-0.5">
                <label class="w-full">
                    <p>Long Description <em>(max 1000 bytes/ASCII characters)</em></p>
                    <textarea bind:value={full_desc} class="w-full" maxlength="1000" placeholder="A loooooong description for your Nikosonas..."></textarea>
                </label>
            </div>
            <div class="flex flex-col p-0.5 gap-2">
                <div class="flex flex-row justify-between items-center gap-4">
                    <p>Abilities <em>(max 20 abilities, max 500 bytes/ASCII characters across all abilities in total)</em></p>
                    <button class="btn" onclick={() => addAbilitiy()}>Insert</button>
                </div>
                {#each abilities as item, key}
                    <div class="flex flex-row max-w-full gap-2">
                        <input class="grow" bind:value={abilities[key]} aria-label="Abitility number {key}" maxlength="500">
                        <button class="btn" onclick={() => {
                            abilities.splice(key, 1)
                        }}>Remove</button>
                    </div>
                {/each}
            </div>
            <div class="flex flex-col p-0.5">
                <p>Image <em>(max 2MB, max image size of 256x256, jpeg/png/webp/bmp only!)</em></p>
                <FileUpload bind:elm={fileInput} accept="image/jpeg,image/png,image/webp,image/bmp" />
            </div>
            <button class="btn" onclick={async() => await submitData()}>Submit!</button>
        {:else if discord_acc_status == "unauthenticated"}
            <div class="flex gap-4 flex-col items-center">
                <p>You are curently not logged in with Discord! Please login to submit a Nikosona.</p>
                <a class="btn" href="/dred">Login with Discord</a>
                <p class="w-full text-left">NOTICE:</p>
                <p class="w-full text-left"><em>By logging in with Discord and submitting a Nikosona, you agree to share with us <u>your username and your user ID</u> for the purpose of identifying and crediting your entry, as well to make sure you are not abusing our service.</em></p>
                <p class="w-full text-left"><em>We will only be able to get your <u>public information about your Discord account</u> (ones that everyone can see). No other information from your Discord account will be used or collected, and absolutely no information will be shared to any third-party.</em></p>
            </div>
        {:else}
            <div>
                <p class="text-center"><em>logging in with Discord...</em></p>
            </div>
        {/if}
    </div>
</section>