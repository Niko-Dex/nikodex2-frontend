<script lang="ts">
    interface Props {
        elm?: HTMLInputElement;
        accept?: string;
        disabled?: boolean;
        name?: string;
        required?: boolean;
        min_width?: number;
    }

    let {
        elm = $bindable(),
        accept,
        disabled,
        name,
        required,
        min_width = 300,
    }: Props = $props();
    let files: FileList | null | undefined = $state();
</script>

<div class="flex gap-2 fill-(--theme-color)">
    <label
        style="--min-w: {min_width}px"
        class="transition duration-200 border-4 border-(--theme-color) p-2 bg-black block w-full md:min-w-(--min-w) hover:bg-(--theme-color) hover:text-black hover:fill-black {disabled
            ? 'pointer-events-none cursor-default brightness-70 disabled:bg-gray-900'
            : 'hover:cursor-pointer'}"
    >
        <input
            type="file"
            bind:this={elm}
            class="hidden"
            {accept}
            {disabled}
            {name}
            bind:files
            {required}
        />
        <div class="flex items-center gap-2 break-all">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                ><path
                    d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
                /></svg
            >
            {#if files && files.length > 0}
                File selected: {files[0].name}
            {:else if disabled}
                No uploading! :c
            {:else}
                Upload a file pls :3
            {/if}
        </div>
    </label>
    <button
        class="hover:cursor-pointer btn p-2 hover:bg-(--theme-color) hover:fill-black"
        {disabled}
        onclick={() => {
            if (elm) {
                elm.value = "";
                files = null;
            }
        }}
        aria-label="Clear"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            ><path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
            /></svg
        >
    </button>
</div>
