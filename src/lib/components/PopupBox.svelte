<script>
    let { expanded = false } = $props();
</script>

<div class="fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center no-antialias">
    <div
        class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 max-w-[1200px] sm:mx-8 my-auto overflow-auto max-h-screen flex-col {expanded
            ? 'w-full'
            : ''}"
    >
        <slot></slot>
    </div>
</div>
