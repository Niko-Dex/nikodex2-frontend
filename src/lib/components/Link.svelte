<script>
    import { page } from "$app/stores"
    export let href = "#";

    $: isActive = $page.url.pathname == href
</script>

<a href={href} class={`no-underline btn lg:w-60 ${isActive ? "bg-amber-600 text-black" : ""}`}>
    <slot />
</a>