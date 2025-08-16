<script>
    import { page } from "$app/stores"
    export let href = "#";

    $: isActive = $page.url.pathname == href
</script>

<a href={href} class={`no-underline border-4 border-amber-600 px-2 py-1 lg:w-60 transition duration-200 hover:bg-amber-600 hover:text-black ${isActive ? "bg-amber-600 text-black" : ""}`}>
    <slot />
</a>