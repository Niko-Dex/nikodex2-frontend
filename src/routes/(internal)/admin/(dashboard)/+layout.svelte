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
			<Link custom_class="flex-0 lg:flex-none" hasMinSize={false} href="/admin/logout">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
			</Link>
		</div>
	</nav>
	<div class="p-4">
		{@render children?.()}
	</div>
</div>