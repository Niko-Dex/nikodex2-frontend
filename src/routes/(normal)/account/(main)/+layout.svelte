<script lang="ts">
    import Link from "$lib/components/Link.svelte";
    import Background from "$lib/assets/images/page/user/world_machine.png";
    import { resolve } from "$app/paths";
    import { mobileCheck } from "$lib/helper/helper";
    import toast from "svelte-french-toast";

    let { data, children } = $props();
    const isMobile = $derived(mobileCheck());
</script>

<svelte:head>
    <title>Your Account!</title>
</svelte:head>

<section class="w-full relative flex justify-center">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <div
        class="max-w-[1200px] p-4 gap-4 min-h-screen w-full relative flex flex-col lg:grid lg:grid-cols-(--lg)"
        style="--default: 100%; --lg: 240px calc(100% - 240px);"
    >
        <div class="flex flex-col gap-2">
            <div class="flex lg:flex-col gap-4 lg:gap-2">
                <label
                    class="relative group cursor-pointer border-4 border-(--theme-color) lg:w-full w-fit"
                >
                    <input
                        type="file"
                        class="hidden"
                        multiple={false}
                        accept="image/*"
                        onchange={async (event_trg) => {
                            if (event_trg.target) {
                                const inputElm =
                                    event_trg.target as HTMLInputElement;
                                const files = inputElm.files;
                                if (!files) return;
                                const file = files[0];
                                const formData = new FormData();
                                formData.append("file", file);

                                const fetchReq = fetch(
                                    `/api/user/change_pfp?id=${data.currentUser?.id}`,
                                    {
                                        method: "PUT",
                                        body: formData,
                                    },
                                ).then(async (r) => {
                                    if (!r.ok) throw await r.json();

                                    setTimeout(
                                        () => window.location.reload(),
                                        1000,
                                    );
                                });

                                toast.promise(fetchReq, {
                                    loading: "Updating profile picture...",
                                    success:
                                        "Profile picture updated!\n (Images may take a few moments to fully update)",
                                    error: (e) =>
                                        `Failed to update profile picture: ${e.error}`,
                                });
                            }
                        }}
                    />
                    <img
                        src={`/api/data/user/pfp?id=${data.currentUser?.id}`}
                        alt="Profile"
                        class="lg:w-full lg:h-full w-20 h-20"
                    />
                    <p
                        class="absolute top-0 m-auto bg-black {!isMobile
                            ? 'group-hover:opacity-100 opacity-0'
                            : 'opacity-100'} transition"
                    >
                        ✐ Edit
                    </p>
                </label>
                <h1
                    class="h2-txt-size flex flex-row gap-4 items-center break-all"
                >
                    {data.currentUser?.username}
                </h1>
            </div>
            <Link href={resolve("/(normal)/account/(main)")}>Personal Info</Link
            >
            <Link href={resolve("/(normal)/account/(main)/noik")}>Nikos :3</Link
            >
            <Link href={resolve("/(normal)/account/(main)/submissions")}
                >Submissions</Link
            >
            <Link href={resolve("/(normal)/account/(main)/posts")}>Posts</Link>
            <Link href={resolve("/(normal)/account/(main)/comments")}
                >Comments</Link
            >
            <Link href={resolve("/(normal)/account/(main)/migrate")}
                >Migrate Nikos</Link
            >
        </div>
        <div class="lg:px-4">
            {@render children?.()}
        </div>
    </div>
</section>
