<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Link from "$lib/components/Link.svelte";
	import logo from "$lib/assets/images/logo.png"

	let { children } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

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
	<p>Unless explicitly stated, all assets and codes are created by the Niko-Dex contributors.</p>

	<details>
		<summary>Acknowledgements</summary>
		<p>Background in the Home page, along with the Niko sprites are taken from OneShot and OneShot WME.</p>
		<p>All Nikosonas belongs to their respective owners.</p>
		<p>Terminus TTF font used in the website are licensed under the SIL Open Font License, downloaded from <a class="underline" href="https://files.ax86.net/terminus-ttf/">https://files.ax86.net/terminus-ttf/</a></p>
	</details>
</footer>