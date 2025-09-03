<script lang="ts">

    interface Props {
        elm?: HTMLInputElement,
        accept?: string,
        disabled?: boolean
    }

    let { elm = $bindable(), accept, disabled }: Props = $props()
    let files: FileList | null | undefined = $state();
</script>
<div class="">
    <label class="border-4 border-sky-800 p-2 bg-black block w-full min-w-[300px] {disabled ? "border-sky-800 cursor-default" : "hover:border-sky-500 hover:cursor-pointer"}">
        <input type="file" bind:this={elm} class="hidden" accept={accept} disabled={disabled} bind:files={files}>
        {#if files && files.length > 0}
        File selected: {files[0].name}
        {:else}
        Upload a file pls :3
        {/if}
    </label>
    <button class="hover:cursor-pointer" onclick={() => { if (elm) {elm.value = ""; files = null} }}>[Clear selected]</button>
</div>