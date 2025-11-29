<script lang="ts">
    import type { PageData, ActionData } from "./$types";
    import Background from "$lib/assets/images/page/user/world_machine.png";
    let { form }: { data: PageData; form: ActionData } = $props();
    import toast from "svelte-french-toast";
    import FileUpload from "$lib/components/FileUpload.svelte";
    import AllowPatsComponent from "$lib/components/AllowPatsComponent.svelte";

    let name = $state("");
    let desc = $state("");
    let full_desc = $state("");
    let is_blacklisted = $state(false);

    if (form?.error) {
        toast.error(form.msg);
    }
    if (form?.success) {
        toast.success("Submitted!");
    }
</script>

<svelte:head>
    <title>Submit a Niko!!</title>
</svelte:head>

<section class="w-full relative flex justify-center">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <div
        class="max-w-[1200px] w-[1200px] flex flex-col p-4 gap-4 min-h-screen pt-5"
    >
        <a class="btn w-fit" href="/account">Go Back</a>
        <h1 class="h1-txt-size">Submit a Niko!</h1>

        <form
            class="min-w-full flex flex-col gap-2"
            enctype="multipart/form-data"
            method="POST"
        >
            <div>
                <label for="name">Name</label>
                <input
                    title="Name"
                    class="min-w-full"
                    name="name"
                    type="text"
                    bind:value={name}
                    required
                />
            </div>
            <div>
                <label for="description">Description</label>
                <input
                    title="Description"
                    class="min-w-full"
                    name="description"
                    type="text"
                    bind:value={desc}
                    required
                />
            </div>
            <div>
                <label for="full_desc">Full Description</label>
                <textarea
                    title="Full Description"
                    class="min-w-full"
                    name="full_desc"
                    bind:value={full_desc}
                    required
                ></textarea>
            </div>
            <AllowPatsComponent bind:is_blacklisted />
            <div>
                <span>Image of Nikosona</span>
                <FileUpload name="file" accept="image/*" required={true} />
            </div>
            <input class="min-w-full btn" type="submit" value="Submit!" />
        </form>
    </div>
</section>
