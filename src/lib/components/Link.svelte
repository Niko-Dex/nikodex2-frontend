<script>
    import { page } from "$app/stores"
    export let href = "#";

    $: isActive = $page.url.pathname == href
</script>

<a href={href} class={`border-4 border-amber-600 px-2 py-1 w-60 ${isActive ? "bg-amber-600 text-black" : ""}`}>
    <slot />
</a>