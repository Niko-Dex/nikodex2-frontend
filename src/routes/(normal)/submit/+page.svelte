<script lang="ts">
    import type { PageData, ActionData } from "./$types";
    import Background from "$lib/assets/images/page/user/world_machine.png";
    let { data, form }: { data: PageData; form: ActionData } = $props();
    import toast, { Toaster } from "svelte-french-toast";
    import FileUpload from "$lib/components/FileUpload.svelte";

    let name = $state("");
    let desc = $state("");
    let full_desc = $state("");

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

<Toaster />
<section class="w-full relative flex justify-center">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <div
        class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen pt-5"
    >
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
                />
            </div>
            <div>
                <label for="full_desc">Full Description</label>
                <textarea
                    title="Full Description"
                    class="min-w-full"
                    name="full_desc"
                    bind:value={full_desc}
                ></textarea>
            </div>
            <FileUpload name="file" />
            <input class="min-w-full btn" type="submit" value="Submit!" />
        </form>
    </div>
</section>
