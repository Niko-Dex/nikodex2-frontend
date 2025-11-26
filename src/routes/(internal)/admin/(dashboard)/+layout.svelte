<script lang="ts">
    import LogoutIcon from "$lib/assets/images/components/LogoutIcon.svelte";
    import Link from "$lib/components/Link.svelte";
    import Transition from "$lib/components/Transition.svelte";
    import "../../../../app.css";

    let { children } = $props();
    let navBarOpen = $state(false);
    import { Toaster } from "svelte-french-toast";
</script>

<svelte:head>
    <title>Admin Dashboard :3</title>
</svelte:head>

<Toaster />
<Transition />
<div class="w-full relative flex justify-center flex-col">
    <nav
        class="bg-black sticky top-0 w-full border-b-4 border-(--theme-color) px-4 py-2 justify-between items-center flex flex-col gap-2 xl:flex-row z-3"
    >
        <div class="flex items-center w-full xl:w-max justify-between">
            <h2 class="h2-txt-size">Admin Dashboard</h2>
            <button
                aria-label="Menu"
                class="hover:cursor-pointer"
                onclick={() => (navBarOpen = !navBarOpen)}
            >
                <svg
                    class="xl:hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    height="32px"
                    viewBox="0 -960 960 960"
                    width="32px"
                    fill="#e3e3e3"
                    ><path
                        d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
                    /></svg
                >
            </button>
        </div>
        <div
            class="link gap-2 md:gap-4 flex-shrink w-full overflow-auto xl:w-auto flex-col sm:flex-row flex-wrap xl:flex-nowrap justify-end {navBarOpen
                ? 'flex'
                : 'hidden xl:flex'}"
        >
            <Link custom_class="flex-1 xl:flex-none" href="/admin">Home</Link>
            <Link custom_class="flex-1 xl:flex-none" href="/admin/users"
                >Users</Link
            >
            <Link custom_class="flex-1 xl:flex-none" href="/admin/noik"
                >Noik</Link
            >
            <Link custom_class="flex-1 xl:flex-none" href="/admin/blog"
                >Blog</Link
            >
            <Link custom_class="flex-1 xl:flex-none" href="/admin/submissions"
                >Submissions</Link
            >
            <Link
                custom_class="flex-0 xl:flex-none items-center gap-2"
                hasMinSize={false}
                href="/admin/logout"
            >
                <LogoutIcon />
                <span class="sm:hidden">Log out</span>
            </Link>
        </div>
    </nav>
    {@render children?.()}
</div>
