<script lang="ts">
    import Background from "$lib/assets/images/page/twm/bg.png"
    import BaseTV from "$lib/assets/images/page/twm/base-tv.png"
    import Entity from "$lib/assets/images/page/twm/en.png"
    import Static3 from "$lib/assets/images/page/twm/static-3.png"
    import Dialogue from "$lib/assets/images/page/twm/niko-background.png"
    import { onMount } from "svelte";
    let { data } = $props();

    let ballon_w = $state(0)
    let ballon_h = $state(0)
    let apiData: {
        name: string
        description: string
        author: string
        img_link: string
    } = $state({
        name: "Loading..",
        description: "Loading..",
        author: "Loading..",
        img_link: ``
    })

    async function getData() {
        fetch(`/api/data/niko/?id=${data.id}`)
            .then(res => res.json())
            .then(d => {
                apiData.name = d["name"]
                apiData.description = d["full_desc"]
                apiData.author = d["author"]
                apiData.img_link = `/api/image?id=${data.id}`
            })
    }

    onMount(async () => {
        await getData()
    })
</script>

<style>
    .bg {
        background-repeat: repeat-x;
        background-size: cover;
        /* animation: scroll 5s linear infinite; */
    }

    @keyframes scroll {
        from {
            background-position: 0%;
        }
        to {
            background-position: 100%;
        }
    }
</style>

<svelte:head>
    <title>TWM View: {apiData.name}</title>
</svelte:head>

<div style="background-image: url({Background});" class="w-screen h-screen flex justify-center items-center bg no-antialias">
    <div class="w-[640px] h-[480px] relative">
        <div class="absolute z-2 top-[0px] w-full flex flex-col items-center">
            <img alt="The World Machine's screen" src={BaseTV} class="no-antialias w-[280px]">
        </div>
        <div class="absolute z-1 top-[0px] w-full flex flex-col items-center">
            <img alt="static" src={Static3} class="no-antialias w-2xs opacity-75 h-[248px]">
        </div>
        <div class="absolute z-0 top-[140px] w-full flex flex-col items-center">
            <img alt="The Entity (TWM)" src={Entity} class="no-antialias w-4xs brightness-300">
        </div>
        <div class="z-2 absolute top-[270px] w-full flex flex-col items-center">
            <img alt="Dialogue Balloon" src={Dialogue} class="absolute top-[32px] no-antialias" bind:clientWidth={ballon_w} bind:clientHeight={ballon_h}>
            <div class="absolute z-3">
                <p class="text-left" style="min-width: {ballon_w}px;">{apiData.name}</p>
            </div>
            <!-- <div class="hidden absolute z-10 bg-gray top-11" style="min-height: {ballon_h - 24}px; min-width: {ballon_h - 24}px;">
                <img alt="Nikosona" src={apiData.img_link} style="max-height: {ballon_h - 24}px; max-width: {ballon_h - 24}px;">
            </div> -->
            <div class="relative z-3 top-[42px] flex flex-row"
            style="overflow: auto; width: calc({ballon_w}px - 22px); height: calc({ballon_h}px - 20px);">
                <text class="text-left w-[75%] shrink overflow-y-scroll!">{apiData.description}.</text>
                <div class="w-[25%] h-[100%] max-h-[100%] flex justify-end items-center">
                    <img class="relative no-antialias w-auto h-full" style="" alt="Nikosona" src={apiData.img_link}>
                </div>
            </div>
            <div class="absolute z-5 top-[160px]">
                <p class="text-left" style="min-width: {ballon_w}px;">Created by {apiData.author}</p>
            </div>
        </div>
    </div>
    <div class="fixed top-2 left-2">
        <a class="btn" href="/noik">Go Back</a>
    </div>
</div>