<script lang="ts">
    import Background from "$lib/assets/images/twm_page/bg.png"
    import BaseTV from "$lib/assets/images/twm_page/base-tv.png"
    import Entity from "$lib/assets/images/twm_page/en.png"
    import Dialogue from "$lib/assets/images/twm_page/niko-background.png"
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

<div style="background-image: url({Background});" class="w-screen h-screen">
    <h1>Coming soon..</h1>
    <div class="fixed top-[80px] w-screen flex flex-col items-center">
        <img alt="The World Machine's screen" src={BaseTV} class="no-antialias w-2xs">
    </div>
    <div class="fixed top-[224px] w-screen flex flex-col items-center">
        <img alt="The Entity (TWM)" src={Entity} class="no-antialias w-4xs">
    </div>
    <div class="z-2 fixed top-[350px] w-screen flex flex-col items-center">
        <img alt="Dialogue Balloon" src={Dialogue} class="absolute top-8 no-antialias w-4xs" 
        bind:clientWidth={ballon_w} bind:clientHeight={ballon_h}>
        <div class="absolute z-3">
            <p class="text-left" style="min-width: {ballon_w}px;">{apiData.name}</p>
        </div>
        {#if ballon_w > 0}
            <div class="relative z-3 top-10 inline-block overflow-scroll" 
            style="overflow: auto; max-width: calc({ballon_w}px - {ballon_h}px - 22px); max-height: calc({ballon_h}px - 20px);
            left: calc((-{ballon_h}px / 2))">
                <text class="text-leftl overflow-auto">{apiData.description}.</text>
            </div>
            <img src={apiData.img_link} alt="Nikosona"
            class="absolute z-3 max-w-[96px] max-h-[96px]" style="max-height: 96px; top: 48px; right: calc(({ballon_w}px / 2) + {ballon_h}px - 22px);">
        {/if}
        <div class="absolute z-5 top-40">
            <p class="text-left" style="min-width: {ballon_w}px;">Created by {apiData.author}</p>
        </div>
    </div>
</div>