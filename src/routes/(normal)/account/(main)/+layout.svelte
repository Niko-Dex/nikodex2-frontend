<script lang="ts">
    import LogoutIcon from "$lib/assets/images/components/LogoutIcon.svelte";

    import Link from "$lib/components/Link.svelte";
    import Background from "$lib/assets/images/page/user/world_machine.png";
    import { resolve } from "$app/paths";

    let { data, children } = $props();
</script>

<svelte:head>
    <title>Your Account!</title>
</svelte:head>

<section class="w-full relative flex justify-center">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <div class="flex flex-col max-w-[1200px] w-full p-4 gap-4 min-h-screen">
        <div class="flex justify-between items-center">
            <h1 class="h2-txt-size">
                Hello, {data.username}!
            </h1>
            <a
                class="btn w-fit flex flex-row items-center gap-4"
                href="/api/user/logout"
            >
                <LogoutIcon />
                Log Out
            </a>
        </div>

        <div class="flex flex-col sm:flex-row gap-2">
            <Link href={resolve("/(normal)/account/(main)")}>Home</Link>
            <Link href={resolve("/(normal)/account/(main)/noik")}>Nikos</Link>
            <Link href={resolve("/(normal)/account/(main)/posts")}>Posts</Link>
            <Link href={resolve("/(normal)/account/(main)/submissions")}
                >Submissions</Link
            >
            <Link href={resolve("/(normal)/account/(main)/migrate")}
                >Migrate Nikos from Discord</Link
            >
        </div>
        {@render children?.()}
    </div>
</section>
