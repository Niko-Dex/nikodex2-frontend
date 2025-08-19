<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Link from "$lib/components/Link.svelte";
	import logo from "$lib/assets/images/logo.png"
    import Transition from '$lib/components/Transition.svelte';

	let { children } = $props();

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
<Transition />
<nav class="bg-black sticky top-0 w-full border-b-4 border-amber-600 px-4 py-2 justify-between items-center flex flex-col gap-2 lg:flex-row z-3">
	<div class="logo">
		<img src={logo} alt="Logo" class="max-h-12">
	</div>

	<div class="link flex gap-4 flex-shrink">
		<Link href="/">Home</Link>
		<Link href="/noik">The Niko List</Link>
		<Link href="/blog">Blog</Link>
	</div>
</nav>

{@render children?.()}

<footer class="bg-white text-black p-4">
	<p>The NikoDex v2 is a project created by the contributors of <a class="underline" href="https://github.com/Niko-Dex">Niko-Dex</a>, which are fans of OneShot, and are part of the OSDS server.</p>
	<p>Unless explicitly stated under Acknowledgements, all assets and codes are created by the Niko-Dex contributors.</p>

	<details>
		<summary>Acknowledgements</summary>
		<p>Background for the Home page, the Niko List page, the Blog page, and the Error page, along with the Niko sprites are taken from the game OneShot and OneShot WME. All rights for these media belongs to nightmargin.</p>
		<p>All Nikosonas belongs to their respective owners and artists.</p>
		<p>Terminus TTF font used in the website are licensed under the SIL Open Font License, downloaded from <a class="underline" href="https://files.ax86.net/terminus-ttf/">https://files.ax86.net/terminus-ttf/</a></p>
		<p>Svelte, TailwindCSS, along with a few dependecies, were used in the creation of the front-end.</p>
	</details>
</footer>