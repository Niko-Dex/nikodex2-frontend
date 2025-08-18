<script lang="ts">
    import { onMount } from 'svelte';
	import '../../../../app.css';

	let { children } = $props();
	import { Toaster } from "svelte-french-toast"
	let username = $state("")

	onMount(async() => {
		const userRes = await fetch("/api/admin/user")
		const userData = await userRes.json()
		username = userData["username"]

		if (userRes.status == 401) location.reload()
	})

</script>

<Toaster />
<div class="w-full relative flex justify-center p-4 flex-col">
	<nav class="justify-between flex items-center border-b-4 pb-4 mb-4">
		<h1 class="h1-txt-size">Nikodex V2's Admin Dashboard</h1>
		<div class="flex flex-col">
			<p>Welcome, {username}</p>
			<a href="/admin/logout">[Logout]</a>
		</div>
	</nav>
	{@render children?.()}
</div>