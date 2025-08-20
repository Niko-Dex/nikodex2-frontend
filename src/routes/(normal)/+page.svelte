<script lang="ts">
    import Background from "$lib/assets/images/home_page/bg.png"

    import Img1 from "$lib/assets/images/home_page/niko_83c.png"
    import Img2 from "$lib/assets/images/home_page/niko_pancakes.png"
    import Img3 from "$lib/assets/images/home_page/en.png"

    import Pat1 from "$lib/assets/images/home_page/petpet1.gif"
    import Pat2 from "$lib/assets/images/home_page/petpet2.gif"
    import Pat3 from "$lib/assets/images/home_page/petpet3.gif"

    import { onMount, onDestroy } from "svelte"
    import TwmWindow from "$lib/components/TWMWindow.svelte";

    let bg1Y = $state(0)
    function bg1Scroll() {
        bg1Y = scrollY
    }

    onMount(() => {
        addEventListener("scroll", bg1Scroll)
        bg1Scroll()
    })

    function replace_img(ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        const elm = ev.target as HTMLImageElement
        elm.src = elm.getAttribute("data-secsrc") ?? elm.src
    }

    // onDestroy(() => {
    //     if (window) {
    //         window.removeEventListener("scroll", bg1Scroll)
    //     }
    // })

    let data: { cnt: string | null } = $state({
        "cnt": null
    })

    onMount(() => {
        fetch(`/api/data/count`)
            .then(v => v.text())
            .then(v => data.cnt = v)
    })
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<section class="w-full h-screen relative flex flex-col justify-center items-center gap-4">
    <div style="background-image: url({Background}); background-position-y: {bg1Y * 0.5}px" class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias"></div>
    <h1 class="text-center bg-black h1-txt-size">Welcome to Nikodex (v2)!</h1>
    <h1 class="h0-txt-size bg-black w-fit p-2 mx-4 text-center">Explore the World of Nikosonas!</h1>
</section>
<section class="w-full relative flex justify-center p-4">
    <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4">
        <h1 class="h1-txt-size">What <em>is</em> the Nikodex?</h1>
        <p>Nikodex is a website documenting the custom Nikos (more known as Nikosona's) that users in the OneShot Discord Server have created. This website aims to explains each Nikosona, their backstory, lore, creation, and abilities. Depending on the user, each ability might be different.</p>
        <div class="flex gap-4 justify-end items-center">
            <p>Here are some Noiks. Click to pat them!</p>
            <button onclick={replace_img} class="hover:cursor-grab">
                <img src={Img1} data-secsrc={Pat1} alt="niko_83c" class="no-antialias w-[96px]">
            </button>
            <button onclick={replace_img} class="hover:cursor-grab">
                <img src={Img2} data-secsrc={Pat2} alt="niko_pancakes" class="no-antialias w-[96px]">
            </button>
            <button onclick={replace_img} class="hover:cursor-grab">
                <img src={Img3} data-secsrc={Pat3} alt="en" class="no-antialias w-[96px]">
            </button>
        </div>
        <h1 class="h1-txt-size">So, why <em>version 2</em>? Where is version 1?</h1>
        <p>This version of the website was created to hopefully be the successor for the previous Nikodex hosted over on Wixsite. This new version aims to bring a cleaner design and a better user experience to everyone. You can visit the Nikodex version 1 at <a class="underline" href="https://nikodex.wixsite.com/nikodex">https://nikodex.wixsite.com/nikodex</a></p>
    </div>
</section>

<section class="w-full relative flex justify-center p-4 bg-violet-800">
    <div class="flex flex-col gap-4 max-w-[1200px] w-[1200px]">
        <h1 class="h1-txt-size">Current Status</h1>
        <p>We currently have {data.cnt ?? "[unknown]"} Nikosona(s) catalogged.</p>
    </div>
</section>

<section class="w-full relative flex justify-center p-4 bg-yellow-600">
    <div class="flex flex-col gap-4 max-w-[1200px] w-[1200px]">
        <h1 class="h1-txt-size">So what you're waiting for?!</h1>
        <p>Explore all the Noiks the OSDS community has to offer at <em>The Niko List</em> on the navbar!</p>
    </div>
</section>