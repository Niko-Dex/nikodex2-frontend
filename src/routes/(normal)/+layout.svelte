<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.png';
	import Link from "$lib/components/Link.svelte";
	import logo from "$lib/assets/images/logo.png"
    import Transition from '$lib/components/Transition.svelte';
    import { onMount } from 'svelte';
    import { afterNavigate } from '$app/navigation';

	let { children } = $props();
	let errorContactingAPI = $state(false)

	async function checkAPI() {
		try {
			const res = await fetch("/api/ping")
			errorContactingAPI = !res.ok
		} catch (_) {
			errorContactingAPI = true
		}
	}

	onMount(async () => {
		await checkAPI()
	})

	afterNavigate(async () => {
		await checkAPI()
	})

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Primary Meta Tags -->
	<meta name="title" content="The Nikodex Version 2!" />
	<meta name="description" content="Nikodex is a fan-made project aims to document all the Nikosonas that users in the OneShot Discord Server have created!" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="The Nikodex Version 2!" />
	<meta property="og:description" content="Nikodex is a fan-made project aims to document all the Nikosonas that users in the OneShot Discord Server have created!" />
	<meta property="og:image" content="https://github.com/Niko-Dex/nikodex2-frontend/blob/main/src/lib/assets/images/logo.png?raw=true" />
	<meta property="og:image:alt" content="Nikodex V2's logo" />
	<meta property="theme-color" content="#e17100" />

	<!-- X (Twitter) -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://nikodex.net/" />
	<meta property="twitter:title" content="The Nikodex Version 2!" />
	<meta property="twitter:description" content="Nikodex is a fan-made project aims to document all the Nikosonas that users in the OneShot Discord Server have created!" />
	<meta property="twitter:image" content="https://github.com/Niko-Dex/nikodex2-frontend/blob/main/src/lib/assets/images/logo.png?raw=true" />
</svelte:head>
{#if errorContactingAPI}
<div class="fixed top-0 left-0 w-full h-full z-100 bg-red-800 flex justify-center items-center">
	<div class="max-w-[1200px] mx-8">
		<h1 class="h1-txt-size mb-4">unable to contact backend or frontend API server</h1>
		<p>if you're the <u>user</u>: try and contact the website host/admin or the dev, and/or do a refresh after sometimes.</p>
		<p>if you're the <u>website host/admin</u>: try and see if you have setup the website incorrectly. check the output of the backend and frontend to look for 500 errors, and in the developer console to look for error. if you can't figure out the issue, contact the developer.</p>
		<p>if you're the <u>developer</u>: ... why the fuck are you reading this? go and fix the website!!!</p>
	</div>
</div>
{:else}
<Transition />
<nav class="bg-black sticky top-0 w-full border-b-4 border-amber-600 px-4 py-2 justify-between items-center flex flex-col gap-2 lg:flex-row z-3">
	<div class="logo">
		<a href="/">
			<img src={logo} alt="Logo" style="--shadow: 2px 2px red" class="max-h-12 hover:drop-shadow-(--shadow) transition duration-100">
		</a>
	</div>

	<div class="link flex gap-4 flex-shrink w-full overflow-auto lg:w-auto">
		<Link custom_class="flex-1 lg:flex-none" href="/noik">The Niko List</Link>
		<Link custom_class="flex-1 lg:flex-none" href="/submit">Submit a Niko</Link>
		<Link custom_class="flex-1 lg:flex-none" href="/blog">Blog</Link>
	</div>
</nav>

{@render children?.()}

<footer class="bg-white text-black p-4">
	<p>The NikoDex v2 is a project created by the contributors of <a class="underline" href="https://github.com/Niko-Dex">Niko-Dex</a>, which are fans of OneShot, and are part of the OSDS server.</p>
	<p>Unless explicitly stated under Acknowledgements, all assets and codes are created by the Niko-Dex contributors.</p>

	<details>
		<summary>Acknowledgements</summary>
		<p>Background for the Home page, the Niko List page, the Blog page, the Submit page, and the Error page, along with the Niko sprites are taken from the game OneShot and OneShot WME. All rights for these media belongs to nightmargin.</p>
		<p>All Nikosonas belongs to their respective owners and artists.</p>
		<p>Terminus TTF font used in the website are licensed under the SIL Open Font License, downloaded from <a class="underline" href="https://files.ax86.net/terminus-ttf/">https://files.ax86.net/terminus-ttf/</a></p>
		<p>Svelte, TailwindCSS, along with a few dependecies, were used in the creation of the front-end.</p>
	</details>
</footer>
{/if}