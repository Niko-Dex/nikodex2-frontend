<script>
    let { children } = $props();
    import { onMount } from "svelte";
    onMount(() => {
        const color = localStorage.getItem("color")
        if (color && color != "") {
            document.body.style.setProperty("--theme-color", color)
        }
	})
</script>

{@render children?.()}