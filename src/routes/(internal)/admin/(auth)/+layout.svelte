<script lang="ts">
	import '../../../../app.css';

	let { children } = $props();
	import { Toaster } from "svelte-french-toast"

</script>

<Toaster />
{@render children?.()}