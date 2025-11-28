<script lang="ts">
    import Background from "$lib/assets/images/page/home/bg.png";

    import Img1 from "$lib/assets/images/page/home/niko_83c.png";
    import Img2 from "$lib/assets/images/page/home/niko_pancakes.png";
    import Img3 from "$lib/assets/images/page/home/en.png";

    import Pat1 from "$lib/assets/images/page/home/petpet1.gif";
    import Pat2 from "$lib/assets/images/page/home/petpet2.gif";
    import Pat3 from "$lib/assets/images/page/home/petpet3.gif";

    import { onMount } from "svelte";
    import Card from "$lib/components/Card.svelte";
    import { version } from "$app/environment";
    import { parseISO, differenceInHours } from "date-fns";

    let bg1Y = $state(0);
    function bg1Scroll() {
        bg1Y = scrollY;
    }

    onMount(() => {
        addEventListener("scroll", bg1Scroll);
        bg1Scroll();
    });

    function replace_img(
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) {
        const elm = ev.target as HTMLImageElement;
        elm.src = elm.getAttribute("data-secsrc") ?? elm.src;
    }

    let data: { cnt: string | null } = $state({
        cnt: null,
    });

    let notd = $state({
        abilities: [] as { id: number; name: string; niko_id: number }[],
        author: "",
        description: "",
        id: 0,
        name: "",
        short_desc: "",
    });

    let ping_proxy = $state("");
    let ping_backend = $state("");

    let refresh_at: string = $state("");
    let whenRefresh = $derived(differenceInHours(refresh_at, new Date()));

    onMount(async () => {
        fetch(`/api/data/count`)
            .then((v) => v.text())
            .then((v) => (data.cnt = v));

        fetch("/api/data/random_notd")
            .then((v) => {
                refresh_at = v.headers.get("x-refreshat") ?? "";
                console.log(parseISO(refresh_at));
                return v.json();
            })
            .then((d) => {
                notd.name = d["name"];
                notd.author = d["author_name"];
                notd.description = d["full_desc"];
                notd.short_desc = d["description"];
                notd.abilities = d["abilities"];
                notd.id = d["id"];
            });

        const begin = performance.now();
        const res = await fetch("/api/ping");
        const end = performance.now();
        ping_backend = Number(await res.text()).toFixed(2);
        ping_proxy = (end - begin).toFixed(2);
    });
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<section
    class="w-full h-screen relative flex flex-col justify-center items-center gap-4"
>
    <div
        style="background-image: url({Background}); background-position-y: {bg1Y *
            0.5}px"
        class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias"
    ></div>
    <h1 class="text-center bg-black h1-txt-size px-2">
        Welcome to Nikodex v2!
    </h1>
    <h1 class="h0-txt-size bg-black w-fit p-2 mx-4 text-center">
        Explore the World of Nikosonas!
    </h1>
    <p class="bg-black px-2 mx-4">
        Like a PokeDex for Nikos (Gotta Catch 'Em All!)
    </p>
</section>
<section class="w-full relative flex justify-center p-4">
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4">
        <h1 class="h1-txt-size">What <em>is</em> the Nikodex?</h1>
        <p>
            Nikodex is a website documenting the custom Nikos (more known as
            Nikosona's) that users in the OneShot Discord Server have created.
            This website aims to explains each Nikosona, their backstory, lore,
            creation, and abilities. Depending on the user, each ability might
            be different.
        </p>
        <div class="flex gap-4 justify-end items-center">
            <p>Here are some Noiks. Click to pat them!</p>
            <button onclick={replace_img} class="hover:cursor-grab">
                <img
                    src={Img1}
                    data-secsrc={Pat1}
                    alt="niko_83c"
                    class="no-antialias w-[96px]"
                />
            </button>
            <button onclick={replace_img} class="hover:cursor-grab">
                <img
                    src={Img2}
                    data-secsrc={Pat2}
                    alt="niko_pancakes"
                    class="no-antialias w-[96px]"
                />
            </button>
            <button onclick={replace_img} class="hover:cursor-grab">
                <img
                    src={Img3}
                    data-secsrc={Pat3}
                    alt="en"
                    class="no-antialias w-[96px]"
                />
            </button>
        </div>
        <h1 class="h1-txt-size">
            So, why <em>version 2</em>? Where is version 1?
        </h1>
        <p>
            This version of the website was created to be the successor to the
            previous Nikodex hosted on Wixsite. This new version offers a
            cleaner design and an enhanced user experience for all users. You
            can visit the Nikodex version 1 (Now left here for archival
            purposes) at <a href="https://nikodex.wixsite.com/nikodex"
                >https://nikodex.wixsite.com/nikodex</a
            >
        </p>
    </div>
</section>

<section class="w-full relative flex justify-center p-4 bg-yellow-600">
    <div class="flex flex-col gap-4 max-w-[1200px] w-[1200px]">
        <h1 class="h1-txt-size">So what you're waiting for?!</h1>
        <p>
            Explore all the Noiks the OSDS community has to offer at <em
                >The Niko List</em
            >
            on the navigation bar above! You can read on the latest updates about
            the Nikodex in <em>Blogs</em>, and join our Discord server at the
            <em>Discord link</em> above.
        </p>
        <p>
            Oh yeah! Did you know that the Nikodex now has <em>accounts</em>? A
            Nikodex account grants you the ability to make a submission, edit
            your current Nikosonas, and much more!
        </p>
    </div>
</section>

<section class="w-full relative flex justify-center p-4 bg-violet-600">
    <div class="flex flex-col gap-4 max-w-[1200px] w-[1200px]">
        <h1 class="h1-txt-size">Noik of The Day</h1>
        <p>
            A random Noik is selected each day to be featured here. If your Noik
            show up here, then be proud i guess lol :3
        </p>
        <p>New NoTD will be picked after {whenRefresh} hours.</p>
        <Card
            name={notd?.name}
            id={notd?.id}
            abilities={notd?.abilities}
            author={notd?.author}
            description={notd?.description}
            short_desc={notd?.short_desc}
            full_expand
        />
    </div>
</section>

<section class="w-full relative flex justify-center p-4 bg-blue-800">
    <div class="flex flex-col gap-4 max-w-[1200px] w-[1200px]">
        <h1 class="h1-txt-size">Current Status</h1>
        <div
            style="--md: repeat(auto-fit, minmax(240px, 1fr)); --normal: repeat(auto-fit, minmax(120px, 1fr));"
            class="grid gap-4 text-center md:grid-cols-(--md) grid-cols-(--normal)"
        >
            <div class="flex flex-col justify-center items-center">
                <h1 class="h1-txt-size">
                    {data.cnt?.padStart(3, "0") ?? "[unknown]"}
                </h1>
                <p>Nikosona(s) catalogged</p>
            </div>
            <div class="flex flex-col justify-center items-center">
                <h1 class="h1-txt-size">
                    <a
                        href="https://github.com/Niko-Dex/nikodex2-frontend/commit/{version}"
                        >[{version.substring(0, 6)}]</a
                    >
                </h1>
                <p>Front-end version</p>
            </div>
            <div class="flex flex-col justify-center items-center">
                <h1 class="h1-txt-size">{ping_backend}ms</h1>
                <p>Internal server Ping</p>
            </div>
            <div class="flex flex-col justify-center items-center">
                <h1 class="h1-txt-size">{ping_proxy}ms</h1>
                <p>Ping</p>
            </div>
        </div>
    </div>
</section>
