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
    let fileInput: HTMLInputElement | undefined = $state()

    let discord_acc_status: "logging_in" | "unauthenticated" | "authenticated" = $state("logging_in")
    let discord_username: string = $state("")
    let discord_id: string = $state("")

    function addAbilitiy() {
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

        fetch(`/api/submit`, {
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

    async function discordLogOut() {
        try {
            const res = await fetch('/api/discord_auth/logout', {
                method: 'POST'
            })

            if (res.ok) {
                discord_acc_status = "unauthenticated";
                discord_username = '';
                discord_id = '';
            }
            else {
                const resJson = await res.json();
                console.log(`discordLogOut: HTTP Error ${res.status}! ${resJson.msg}`);
                toast.error(`HTTP Error ${res.status}! ${resJson.msg}`);
            }
        } catch (error) {
            console.log(`discordLogOut Error! ${error}`);
            toast.error(`Error! ${error}`);
        }
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
    <div class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1" style="background-image: url({Background});"></div>
    <div class="flex flex-col max-w-[1200px] w-[1200px] p-4 gap-4 min-h-screen">
        <h1 class="h1-txt-size">Submit a Niko!</h1>
        {#if discord_acc_status == "authenticated"}
            <div class="flex flex-row gap-4 items-center justify-between">
                <p>You are currently logged in as <em title={discord_id}>{discord_username}</em></p>
                <button class="btn" onclick={async() => await discordLogOut()}>Logout</button>
            </div>
            <div class="flex flex-col p-0.5">
                <label class="w-full">
                    <p>Name</p>
                    <input bind:value={name} type="text" class="w-full">
                </label>
            </div>
            <div class="flex flex-col p-0.5">
                <label class="w-full">
                    <p>Description</p>
                    <input bind:value={desc} type="text" class="w-full">
                </label>
            </div>
            <div class="flex flex-col p-0.5">
                <label class="w-full">
                    <p>Long Description</p>
                    <textarea bind:value={full_desc} class="w-full"></textarea>
                </label>
            </div>
            <div class="flex flex-col p-0.5 gap-2">
                <div class="flex flex-row justify-between items-center">
                    <p>Abilities</p>
                    <button class="btn" onclick={() => addAbilitiy()}>Add..</button>
                </div>
                {#each abilities as item, key}
                    <div class="flex flex-row max-w-full gap-2">
                        <input class="grow" bind:value={abilities[key]} aria-label="Abitility number {key}">
                        <button class="btn" onclick={() => {
                            abilities.splice(key, 1)
                        }}>Remove</button>
                    </div>
                {/each}
            </div>
            <div class="flex flex-col p-0.5">
                <p>Image..</p>
                <FileUpload bind:elm={fileInput} accept="image/*" />
            </div>
            <button class="btn" onclick={async() => await submitData()}>Submit!</button>
        {:else if discord_acc_status == "unauthenticated"}
            <div class="flex gap-4 flex-col items-center">
                <p>You are curently not logged in with Discord! Please login to submit a Niko.</p>
                <button class="btn" onclick={() => goto('/dred')}>Login with Discord</button>
            </div>
        {:else}
            <div>
                <p class="text-center"><em>logging in with Discord...</em></p>
            </div>
        {/if}
    </div>
</section>