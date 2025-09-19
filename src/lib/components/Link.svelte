<script>
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/state"
    let { href, custom_class = "" } = $props();

    let isActive = $state(false)
    afterNavigate(() => {
        isActive = page.url.pathname == href
    })
</script>

<a href={href} class={`no-underline btn lg:min-w-40 whitespace-nowrap flex items-center ${isActive ? "active" : ""} ${custom_class}`}>
    <slot />
</a>