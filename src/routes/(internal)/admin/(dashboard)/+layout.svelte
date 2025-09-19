<script lang="ts">
    import Link from '$lib/components/Link.svelte';
    import Transition from '$lib/components/Transition.svelte';
	import '../../../../app.css';

	let { children } = $props();
	import { Toaster } from "svelte-french-toast"

</script>

<svelte:head>
    <title>Admin Dashboard :3</title>
</svelte:head>

<Toaster />
<Transition />
<div class="w-full relative flex justify-center flex-col">
	<nav class="bg-black sticky top-0 w-full border-b-4 border-(--theme-color) px-4 py-2 justify-between items-center flex flex-col gap-2 lg:flex-row z-3">
		<h2 class="h2-txt-size">Admin Dashboard</h2>
		<div class="link flex gap-4 flex-shrink w-full overflow-auto lg:w-auto">
			<Link custom_class="flex-1 lg:flex-none" href="/admin">Main</Link>
			<Link custom_class="flex-1 lg:flex-none" href="/admin/noik">Noik</Link>
			<Link custom_class="flex-1 lg:flex-none" href="/admin/blog">Blog</Link>
			<Link custom_class="flex-1 lg:flex-none" href="/admin/logout">Logout</Link>
		</div>
	</nav>
	<div class="p-4">
		{@render children?.()}
	</div>
</div>