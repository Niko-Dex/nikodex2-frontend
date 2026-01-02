<script lang="ts">
    import { afterNavigate, invalidate } from "$app/navigation";
    let { children } = $props();
    import { onMount } from "svelte";
    onMount(async () => {
        const color = localStorage.getItem("color");
        if (color && color != "") {
            document.body.style.setProperty("--theme-color", color);
        }
    });
    afterNavigate(() => {
        invalidate("app:auth");
    });
</script>

{@render children?.()}
