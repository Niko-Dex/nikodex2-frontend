<script>
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/state";
    let { href, custom_class = "", hasMinSize = true } = $props();

    let isActive = $state(false);
    afterNavigate(() => {
        isActive = page.url.pathname == href;
    });
</script>

<a
    {href}
    class={`no-underline btn ${hasMinSize ? "lg:min-w-30" : ""} whitespace-nowrap flex items-center ${isActive ? "active" : ""} ${custom_class}`}
>
    <slot />
</a>
