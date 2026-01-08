<script lang="ts">
    import "../../app.css";
    import favicon from "$lib/assets/favicon.png";
    import Link from "$lib/components/Link.svelte";
    import logo from "$lib/assets/images/logo2.png";
    import Transition from "$lib/components/Transition.svelte";
    import { beforeNavigate } from "$app/navigation";
    import ProfilePictureIcon from "$lib/assets/images/page/account/oneshotprofilepicture.png";
    import LogoutIcon from "$lib/assets/images/components/LogoutIcon.svelte";
    import { resolve } from "$app/paths";
    import Baa from "$lib/assets/images/baaaaaa.png";

    import ThemeBtn from "$lib/assets/images/components/theme.png";
    import Theme from "$lib/assets/data/theme.json";
    import DropdownMenu from "$lib/components/DropdownMenu.svelte";
    import { Toaster } from "svelte-french-toast";
    import DiscordLogo from "$lib/assets/images/components/DiscordLogo.svelte";
    import { page } from "$app/state";
    import type { LayoutProps } from "./$types";
    const currentUser = $derived(page.data.currentUser);
    import type { Banner } from "$lib/types/banner";
    import CloseIcon from "$lib/assets/images/components/close.png";
    import { onMount } from "svelte";

    let { children, data }: LayoutProps = $props();
    //@ts-expect-errors banner does exists!!!
    let banner: Banner = data.banner;

    beforeNavigate(() => {
        navBarOpen = false;
    });

    let navBarOpen = $state(false);
    let bannerOpen = $state(false);
    let dismissedBanner: string | null = $state(null);
    let shouldLoadBanner = $state(false);

    onMount(() => {
        dismissedBanner = localStorage.getItem("seen_banner");
        shouldLoadBanner = true;
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <!-- Primary Meta Tags -->
    <meta name="title" content="The Nikodex Version 2!" />
    <meta
        name="description"
        content="Nikodex is a fan-made project aims to document all the Nikosonas that users in the OneShot Discord Server have created!"
    />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="The Nikodex Version 2!" />
    <meta
        property="og:description"
        content="Nikodex is a fan-made project aims to document all the Nikosonas that users in the OneShot Discord Server have created!"
    />
    <meta
        property="og:image"
        content="https://github.com/Niko-Dex/nikodex2-frontend/blob/main/src/lib/assets/images/logo.png?raw=true"
    />
    <meta property="og:image:alt" content="Nikodex V2's logo" />
    <meta property="theme-color" content="#e17100" />

    <!-- X (Twitter) -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://nikodex.net/" />
    <meta property="twitter:title" content="The Nikodex Version 2!" />
    <meta
        property="twitter:description"
        content="Nikodex is a fan-made project aims to document all the Nikosonas that users in the OneShot Discord Server have created!"
    />
    <meta
        property="twitter:image"
        content="https://github.com/Niko-Dex/nikodex2-frontend/blob/main/src/lib/assets/images/logo.png?raw=true"
    />
</svelte:head>

{#snippet nav(showTitle = true)}
    <button
        aria-label="Menu"
        class="hover:cursor-pointer"
        onclick={() => (navBarOpen = !navBarOpen)}
    >
        <svg
            class="lg:hidden"
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
    {#if showTitle}
        <div class="logo flex items-center w-[240px] max-w-full">
            <a href="/">
                <img
                    src={logo}
                    alt="Logo"
                    style="--shadow: 2px 2px red"
                    class="max-w-full w-[240px] hover:drop-shadow-(--shadow) transition duration-100 non-pixelated"
                />
            </a>
        </div>
    {/if}
{/snippet}

<Transition />
<Toaster />
{#if shouldLoadBanner && banner.title != "" && banner.banner_identifier != dismissedBanner}
    <div class="bg-red-800 px-4 py-1 flex sticky gap-4">
        <div class="flex justify-center w-full">
            <p class="text-center">
                <b>{banner.title}</b>
                <a href="#o" onclick={() => (bannerOpen = true)}
                    ><b>[Learn more]</b></a
                >
            </p>
        </div>
        {#if banner.is_dismissable}
            <a
                href="#c"
                class="flex justify-center items-center"
                onclick={() => {
                    localStorage.setItem(
                        "seen_banner",
                        banner.banner_identifier,
                    );
                    dismissedBanner = banner.banner_identifier;
                }}><img src={CloseIcon} alt="close" class="w-4 h-4" /></a
            >
        {/if}
    </div>
{/if}
{#if bannerOpen}
    <div
        class="transition duration-200 bg-black/75 fixed w-screen h-screen top-0 left-0 z-5 flex justify-center"
    >
        <div
            class="border-4 border-(--theme-color) bg-black flex flex-col p-4 gap-4 w-3xl my-auto overflow-auto max-h-screen"
        >
            <div class="main-info flex flex-col">
                <h2 class="h2-txt-size w-fit">{banner.title}</h2>
            </div>
            <div>
                <p class="whitespace-pre-line">{banner.content}</p>
            </div>
            <div>
                <button
                    class="btn border-(--theme-color)"
                    onclick={() => (bannerOpen = !bannerOpen)}>Close</button
                >
            </div>
        </div>
    </div>
{/if}
<nav
    class="bg-black lg:sticky transition duration-200 overflow-auto lg:overflow-visible fixed top-0 left-0 w-[320px] max-w-full h-screen border-(--theme-color) border-r-4 p-4 pr-6 flex flex-col gap-4 z-3 lg:w-full lg:h-auto lg:justify-between lg:flex-row lg:px-4 lg:py-2 lg:border-b-4 lg:border-r-0 {navBarOpen
        ? 'translate-x-0'
        : 'translate-x-[-100%] lg:translate-x-0'}"
>
    <div class="flex flex-row gap-4">
        {@render nav()}
    </div>
    <div
        class="link gap-2 lg:gap-4 flex-shrink w-full flex-col lg:flex-row lg:justify-end flex lg:overflow-visible"
    >
        <Link
            custom_class="flex-1 lg:flex-none border-(--theme-color)"
            href="/noik">The Niko List</Link
        >
        <Link custom_class="flex-1 lg:flex-none" href="/blog">Blog</Link>
        <Link custom_class="flex-1 lg:flex-none" href="/posts">Posts</Link>
        <hr class="lg:hidden" />
        <Link custom_class="sm:p-1 gap-2" href="/discord" hasMinSize={false}>
            <div class="w-4 h-4 sm:w-8 sm:h-8">
                <DiscordLogo />
            </div>
            <span class="lg:hidden">Discord</span>
        </Link>
        <DropdownMenu
            title="Change Theme"
            btn_img={ThemeBtn}
            width={480}
            height={360}
        >
            <h1 class="h2-txt-size">Select a color!</h1>
            <div class="flex flex-wrap gap-4 justify-center overflow-auto">
                {#each Theme.colors as color (color.name)}
                    <button
                        class="btn p-2 lg:max-w-[120px] w-full flex justify-center items-center flex-col"
                        onclick={() => {
                            document.body.style.setProperty(
                                "--theme-color",
                                color.color,
                            );
                            localStorage.setItem("color", color.color);
                        }}
                    >
                        <div
                            class="w-8 h-8 lg:w-16 lg:h-16 no-antialias"
                            style="mask: url({ThemeBtn}) no-repeat center; -webkit-mask: url({ThemeBtn}) no-repeat center; -webkit-mask-size: contain; mask-size: contain; background-color: {color.color}"
                        ></div>
                        <p>{color.name}</p>
                    </button>
                {/each}
            </div>
        </DropdownMenu>

        <hr class="lg:hidden" />
        <DropdownMenu
            custom_class="justify-between"
            title={currentUser?.username || "Accounts"}
            btn_img={ProfilePictureIcon}
            width={320}
        >
            <div class="flex flex-row items-center gap-2 md:gap-4">
                {#if currentUser}
                    <img
                        src="/api/data/user/pfp?id={currentUser.id}"
                        alt="User profile for {currentUser.username}"
                        class="w-8 h-8"
                    />
                {:else}
                    <img
                        src={ProfilePictureIcon}
                        alt="Default user profile"
                        class="w-8 h-8"
                    />
                {/if}
                <h1 class="h2-txt-size items-center break-all">
                    {currentUser?.username || "User"}
                </h1>
            </div>
            {#if currentUser}
                <a class="btn w-full" href="/account/{currentUser.username}">
                    <p class="w-full">Profile</p>
                </a>
                <a class="btn w-full" href="/account/">
                    <p class="w-full">Manage Account</p>
                </a>
            {:else}
                <a class="btn w-full" href="/account/login">
                    <p class="w-full">Login</p>
                </a>
                <a class="btn w-full" href="/account/signup">
                    <p class="w-full">Signup</p>
                </a>
            {/if}
            <hr />
            {#if currentUser?.is_admin}
                <a class="btn w-full" href="/admin/">
                    <p class="w-full">Admin Dashboard</p>
                </a>
            {/if}
            <a class="btn w-full" href="/account/search">
                <p class="w-full">Search for Accounts</p>
            </a>
            {#if currentUser}
                <hr />
                <Link href={resolve("/api/user/logout")} custom_class="gap-4">
                    <LogoutIcon />
                    Log Out
                </Link>
            {/if}
        </DropdownMenu>
    </div>
</nav>
<div
    class="lg:hidden border-(--theme-color) border-b-4 flex flex-row justify-left p-4 sticky top-0 bg-black z-1 gap-4"
>
    {@render nav()}
</div>
{@render children?.()}

<footer class="bg-white text-black p-4 flex justify-between items-center gap-4">
    <div>
        <p>
            The Nikodex v2 - A project created by the <a
                href="https://github.com/Niko-Dex">Nikodex contributors</a
            > on GitHub. Est. 2025
        </p>

        <details>
            <summary
                >Acknowledgements (for assets not created by the Nikodex
                contributors)</summary
            >
            <div class="pl-8">
                <ul class="list-disc">
                    <li>
                        Background for the Home page, the Niko List page, the
                        Blog page, the Submit page, and the Error page, along
                        with the Niko sprites, are taken from the game OneShot
                        and OneShot WME. All rights for these media belong to
                        Nightmargin.
                    </li>
                    <li>
                        All Nikosonas belong to their respective owners and
                        artists. We, the Nikodex team, are very grateful to be
                        able to document all of the Nikosonas listed on the
                        website. All Nikosonas are, and will be fully credited
                        when you submit one. If you'd like to edit or remove an
                        entry, you can do so through Nikodex's Discord server,
                        located at the top.
                    </li>
                    <li>
                        Terminus TTF font used in the website is licensed under
                        the SIL Open Font License, downloaded from <a
                            href="https://files.ax86.net/terminus-ttf/"
                            >https://files.ax86.net/terminus-ttf/</a
                        >
                    </li>
                    <li>
                        Svelte, TailwindCSS, along with a few libraries and
                        dependencies, were used in the creation of the
                        front-end.
                    </li>
                </ul>
            </div>
        </details>
    </div>
    <div>
        <a href="/ramsweeper" class="block w-[64px] h-[64px]">
            <img
                src={Baa}
                alt="Baaaaa"
                width="64"
                height="64"
                class="no-antialias"
            />
        </a>
    </div>
</footer>
