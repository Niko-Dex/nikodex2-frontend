<script lang="ts">
    import "../../app.css";
    import favicon from "$lib/assets/favicon.png";
    import Link from "$lib/components/Link.svelte";
    import logo from "$lib/assets/images/logo.png";
    import Transition from "$lib/components/Transition.svelte";
    import { onMount } from "svelte";
    import { afterNavigate } from "$app/navigation";
    import ProfilePictureIcon from "$lib/assets/images/page/account/oneshotprofilepicture.png";

    import Baa from "$lib/assets/images/baaaaaa.png";

    import ThemeBtn from "$lib/assets/images/components/theme.png";
    import Theme from "$lib/assets/data/theme.json";
    import DropdownMenu from "$lib/components/DropdownMenu.svelte";
    import { Toaster } from "svelte-french-toast";
    import DiscordLogo from "$lib/assets/images/components/DiscordLogo.svelte";

    let { children } = $props();
    let errorContactingAPI = $state(false);

    async function checkAPI() {
        try {
            const res = await fetch("/api/ping");
            errorContactingAPI = !res.ok;
        } catch {
            errorContactingAPI = true;
        }
    }

    onMount(async () => {
        await checkAPI();
    });

    afterNavigate(async () => {
        await checkAPI();
    });

    let navBarOpen = $state(false);
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
{#if errorContactingAPI}
    <div
        class="fixed top-0 left-0 w-full h-full z-100 bg-red-800 flex justify-center items-center"
    >
        <div class="max-w-[1200px] mx-8">
            <h1 class="h1-txt-size mb-4">
                unable to contact backend or frontend API server
            </h1>
            <p>
                if you're the <u>user</u>: try and contact the website
                host/admin or the dev, and/or do a refresh after sometimes.
            </p>
            <p>
                if you're the <u>website host/admin</u>: try and see if you have
                setup the website incorrectly. check the output of the backend
                and frontend to look for 500 errors, and in the developer
                console to look for error. if you can't figure out the issue,
                contact the developer.
            </p>
            <p>
                if you're the <u>developer</u>: ... why the fuck are you reading
                this? go and fix the website!!!
            </p>
        </div>
    </div>
{:else}
    <Transition />
    <Toaster />
    <nav
        class="bg-black sticky top-0 w-full border-b-4 border-(--theme-color) px-4 py-2 justify-between items-center flex flex-col gap-2 lg:flex-row z-3"
    >
        <div class="logo flex items-center w-full lg:w-max justify-between">
            <a href="/">
                <img
                    src={logo}
                    alt="Logo"
                    style="--shadow: 2px 2px red"
                    class="max-h-12 hover:drop-shadow-(--shadow) transition duration-100 non-pixelated"
                />
            </a>
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
        </div>

        <div
            class="link gap-2 md:gap-4 px-4 sm:px-0 flex-shrink w-full lg:w-auto flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-end {navBarOpen
                ? 'flex'
                : 'hidden lg:flex'}"
        >
            <Link
                custom_class="flex-1 lg:flex-none border-(--theme-color)"
                href="/noik">The Niko List</Link
            >
            <Link custom_class="flex-1 lg:flex-none" href="/blog">Blog</Link>
            <Link custom_class="flex-1 lg:flex-none" href="/posts">Posts</Link>
            <DropdownMenu
                title="Accounts"
                btn_img={ProfilePictureIcon}
                width={320}
            >
                <h1 class="h2-txt-size text-white items-center">Accounts</h1>
                <a
                    class="btn text-white w-full items-center flex flex-row"
                    href="/account"
                >
                    <p class="text-center w-full">My account!</p>
                </a>
                <a
                    class="btn text-white w-full items-center flex flex-row"
                    href="/account/search"
                >
                    <p class="text-center w-full">Search for accounts</p>
                </a>
            </DropdownMenu>
            <Link
                custom_class="sm:p-1 gap-2"
                href="/discord"
                hasMinSize={false}
            >
                <DiscordLogo />
                <span class="sm:hidden">Nikodex's Discord Server</span>
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
                            class="btn p-2 min-[360px]:max-w-[120px] w-full flex justify-center items-center flex-col"
                            onclick={() => {
                                document.body.style.setProperty(
                                    "--theme-color",
                                    color.color,
                                );
                                localStorage.setItem("color", color.color);
                            }}
                        >
                            <div
                                class="w-16 h-16 no-antialias"
                                style="mask: url({ThemeBtn}) no-repeat center; -webkit-mask: url({ThemeBtn}) no-repeat center; -webkit-mask-size: contain; mask-size: contain; background-color: {color.color}"
                            ></div>
                            <p>{color.name}</p>
                        </button>
                    {/each}
                </div>
            </DropdownMenu>
        </div>
    </nav>
    {@render children?.()}

    <footer
        class="bg-white text-black p-4 flex justify-between items-center gap-4"
    >
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
                            Background for the Home page, the Niko List page,
                            the Blog page, the Submit page, and the Error page,
                            along with the Niko sprites, are taken from the game
                            OneShot and OneShot WME. All rights for these media
                            belong to Nightmargin.
                        </li>
                        <li>
                            All Nikosonas belong to their respective owners and
                            artists. We, the Nikodex team, are very grateful to
                            be able to document all of the Nikosonas listed on
                            the website. All Nikosonas are, and will be fully
                            credited when you submit one. If you'd like to edit
                            or remove an entry, you can do so through Nikodex's
                            Discord server, located at the top.
                        </li>
                        <li>
                            Terminus TTF font used in the website is licensed
                            under the SIL Open Font License, downloaded from <a
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
{/if}
