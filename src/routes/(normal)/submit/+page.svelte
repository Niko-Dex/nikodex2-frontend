<script lang="ts">
    import Background from "$lib/assets/images/noik_page/bg1.png"
    import toast, { Toaster } from "svelte-french-toast";

    let name = $state("")
    let author = $state("")
    let desc = $state("")
    let full_desc = $state("")
    let abilities: string[] = $state([])

    function addAbilitiy() {
        abilities.push("Ability..")
    }

    async function submitData() {
        if (name.length == 0) {toast.error("You are missing a name!"); return}
        if (author.length == 0) {toast.error("You are missing an author!"); return}
        if (desc.length == 0) {toast.error("You are missing a description!"); return}
        if (full_desc.length == 0) {toast.error("You are missing a full description!"); return}

        const body = JSON.stringify({
                "name": name,
                "author": author,
                "description": desc,
                "full_desc": full_desc,
                "abilities": abilities
            })
        console.log(body)

        fetch(`/api/submit`, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.json())
        .then(r => {
            console.log(r)
            toast.success("Your niko was sent for submission!")
            name = ""
            author = ""
            desc = ""
            full_desc = ""
            abilities = []
        })
        .catch(e => {
            console.log(e)
        }) 
    }
</script>

<Toaster></Toaster>
<section class="w-full relative flex justify-center">
    <div class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1" style="background-image: url({Background});"></div>
    <div class="flex flex-col w-full max-w-3/5 justify-center p-4 gap-4">
        <h1 class="h1-txt-size">Submit a Niko!</h1>
        <div class="flex flex-col p-0.5">
            <p>Name</p>
            <input bind:value={name} type="text">
        </div>
        <div class="flex flex-col p-0.5">
            <p>Author</p>
            <input bind:value={author} type="text">
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
                <div class="flex flex-row">
                    <input class="grow" bind:value={abilities[key]}>
                    <button class="btn">Remove</button>
                </div>
            {/each}
        </div>
        <button class="btn" onclick={async() => await submitData()}>Submit!</button>
    </div>
</section>