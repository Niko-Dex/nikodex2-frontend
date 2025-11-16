<script lang="ts">
	import { page } from '$app/state';
    import type { PageProps } from './$types';
    import Background from "$lib/assets/images/page/account/library.png"
  import toast from 'svelte-french-toast';
  import { onMount } from 'svelte';
    let { data }: PageProps = $props();
    /*
        TODO:
        Add Noik uploading
        Show the amount of Noiks the user has made
        Make the page a bit better, it's currently only a test-page.
    */
</script>

<svelte:head>
    <title>Your Account!</title>
</svelte:head>
<section class="w-full relative flex justify-center">
    <div class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "></div>
    <div class="flex flex-col max-w-[1200px] w-[1200px] p-4 gap-4 min-h-screen">
        <h1 class="h2-txt-size">Login!!!! (This is a test to make sure it works!)</h1>
        <p>current login: {data.username}</p>
        <p>current ID: {data.id}</p>
        <p>current is admin?: {data.is_admin}</p>
        <a class="btn" href={"/api/user/logout"}>Log Out</a>
    </div>
</section>