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

<nav class="bg-black sticky w-full border-b-4 border-amber-600 px-4 py-2 justify-between items-center flex flex-col gap-2 lg:flex-row">
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
