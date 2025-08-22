<script>
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/state"
    let { href } = $props();

    let isActive = $state(false)
    afterNavigate(() => {
        isActive = page.url.pathname == href
    })
</script>

<a href={href} class={`no-underline btn lg:min-w-40 whitespace-nowrap ${isActive ? "active" : ""}`}>
    <slot />
</a>