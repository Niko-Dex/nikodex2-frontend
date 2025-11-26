<script lang="ts">
    import { onMount } from "svelte";
    let pageSelectAtBottom = $state(false);
    let pageSelectDetect = $state() as HTMLDivElement;
    let currentPage = $state(1);
    onMount(async () => {
        const observer = new IntersectionObserver(
            (data) => {
                pageSelectAtBottom = data[0].isIntersecting;
            },
            {
                root: null,
                threshold: 1,
            },
        );

        observer.observe(pageSelectDetect);
    });

    async function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            await onupdate(currentPage);
        }
    }

    async function nextPage() {
        if (currentPage + 1 <= maxPages) {
            currentPage++;
            await onupdate(currentPage);
        }
    }

    let {
        maxPages,
        disabled = false,
        onupdate = async () => {},
    }: {
        maxPages: number;
        disabled?: boolean;
        onupdate: (page: number) => Promise<void>;
    } = $props();
</script>

<div bind:this={pageSelectDetect}></div>
<div
    class="bg-gray-700 flex justify-center gap-4 p-2 {pageSelectAtBottom
        ? 'w-full'
        : 'p-4 w-fit mx-auto sticky bottom-4'}"
>
    <button
        class="transition duration-100 hover:bg-white hover:text-black hover:cursor-pointer border-2 border-white px-4 py-1 disabled:opacity-50 disabled:pointer-events-none"
        onclick={prevPage}
        disabled={currentPage <= 1 || disabled}>Prev</button
    >
    <input
        class="text-center border-2 border-white min-w-20"
        type="number"
        min={1}
        max={maxPages}
        bind:value={currentPage}
        aria-label="Page number"
        {disabled}
        onchange={async () => {
            if (
                isNaN(Number(currentPage)) ||
                currentPage < 1 ||
                currentPage > maxPages
            ) {
                currentPage = 1;
            }
            await onupdate(currentPage);
        }}
    />
    <button
        class="transition duration-100 hover:bg-white hover:text-black hover:cursor-pointer border-2 border-white px-4 py-1 disabled:opacity-50 disabled:pointer-events-none"
        onclick={nextPage}
        disabled={currentPage >= maxPages || disabled}>Next</button
    >
</div>
