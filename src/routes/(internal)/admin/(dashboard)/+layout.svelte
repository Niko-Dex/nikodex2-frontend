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
<div
    class="w-full relative grid md:grid-cols-(--md) grid-cols-(--default)"
    style="--default: 100%; --md: 240px calc(100% - 240px);"
>
    <nav
        class="bg-black md:sticky transition duration-200 fixed top-0 left-0 w-[240px] h-screen border-(--theme-color) border-r-4 px-4 py-2 flex flex-col gap-2 z-3 {navBarOpen
            ? 'translate-x-0'
            : 'translate-x-[-240px] md:translate-x-0'}"
    >
        <h2 class="h2-txt-size hidden md:inline">Admin Dashboard</h2>
        <div class="link gap-2 md:gap-4 w-full overflow-auto flex-col flex">
            <Link href="/admin">Home</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/posts">Posts</Link>
            <Link href="/admin/noik">Noik</Link>
            <Link href="/admin/blog">Blog</Link>
            <Link href="/admin/submissions">Submissions</Link>
            <Link
                custom_class="items-center gap-2"
                hasMinSize={false}
                href="/admin/logout"
            >
                <LogoutIcon />
                <span>Log out</span>
            </Link>
        </div>
    </nav>
    <div>
        <div
            class="md:hidden border-(--theme-color) border-b-4 flex flex-row justify-between p-4 sticky top-0 bg-black"
        >
            <h2 class="h2-txt-size">Admin Dashboard</h2>
            <button
                aria-label="Menu"
                class="hover:cursor-pointer"
                onclick={() => (navBarOpen = !navBarOpen)}
            >
                <svg
                    class="md:hidden"
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
        {@render children?.()}
    </div>
</div>
