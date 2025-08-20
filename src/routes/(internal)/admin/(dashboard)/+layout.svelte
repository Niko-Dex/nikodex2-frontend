<script lang="ts">
    import Link from '$lib/components/Link.svelte';
	import '../../../../app.css';

	let { children } = $props();
	import { Toaster } from "svelte-french-toast"

</script>

<Toaster />
<div class="w-full relative flex justify-center p-4 flex-col">
	<nav class="justify-between flex items-center border-b-4 pb-4 mb-4 gap-4">
		<h2 class="h2-txt-size">Nikodex V2's Admin Dashboard</h2>
		<div class="flex gap-4">
			<a class="btn" href="/admin">Main</a>
			<a class="btn" href="/admin/noik">Noik</a>
			<a class="btn" href="/admin/blog">Blog</a>
			<a class="btn" href="/admin/logout">Logout</a>
		</div>
	</nav>
	{@render children?.()}
</div>