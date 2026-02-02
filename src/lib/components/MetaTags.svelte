<script lang="ts">
    let {
        title = "",
        description = "",
        url = "",
        image = "",
        type = "website",
    } = $props();
</script>

<svelte:head>
    <!-- Basic Meta -->
    <title>{title}</title>
    <meta name="description" content={description} />

    <!-- Open Graph / Facebook / Discord -->
    <meta property="og:type" content={type} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:url" content={url} />
</svelte:head>
