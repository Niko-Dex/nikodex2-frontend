<script lang="ts">
    import type { PageData, ActionData } from "./$types";
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

<div class="flex flex-col gap-4">
    <h2 class="h2-txt-size">Submit a Nikosona Form</h2>

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
