<script>
    import "../app.css"

    import { page } from '$app/state';
    import Logo from "$lib/assets/images/logo.png"
    import Background from "$lib/assets/images/page/error/cg_dream4_4.png"
    let a = $state()
</script>

<svelte:head>
    <title>{page.status} ({page.error?.message}) :3c</title>
</svelte:head>

<div class="w-screen h-screen fixed flex justify-center items-center">
    <div style="background-image: url({Background})" class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed brightness-40"></div>
    <div class="container max-w-[640px] p-4 flex items-center flex-col">
        <img src={Logo} alt="Nikodex's logo">
        <h1 class="h1-txt-size">ERR {page.status}: {page.error?.message}</h1>
        <p>That's all we know. <em>patpat~</em></p>
    </div>
</div>