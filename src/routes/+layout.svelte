<script>
    import { beforeNavigate } from "$app/navigation";
    import { beforePage } from "$lib/helper/noikHelper";
    let { children } = $props();
    import { onMount } from "svelte";
    onMount(() => {
        const color = localStorage.getItem("color");
        if (color && color != "") {
            document.body.style.setProperty("--theme-color", color);
        }
    });
    beforeNavigate((navi) => {
        if (navi.from) $beforePage = navi.from.url.pathname;
    });
</script>

{@render children?.()}
