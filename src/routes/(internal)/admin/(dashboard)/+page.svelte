<script lang="ts">
    import { onMount } from "svelte";

    let username = $state("")

    onMount(async() => {
		const userRes = await fetch("/api/admin/user")
		const userData = await userRes.json()
		username = userData["username"]

		if (userRes.status == 401) location.reload()
	})
</script>

<div class="xl:px-4 flex flex-col gap-4">
    <h1 class="h1-txt-size text-center">Welcome, {username}!</h1>
    <p class="text-center">Edit the Noiksona at the Noik link above, along with the Blog at the Blog link.</p>
    <p class="text-center">and uhh... that is lol. kbity :3</p>
</div>