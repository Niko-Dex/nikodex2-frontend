<script lang="ts">
    import { onMount } from "svelte";
    import type { ChangeEventHandler } from "svelte/elements";

    interface Props {
        elm?: HTMLInputElement,
        accept?: string,
        disabled?: boolean,
        onchange?: ChangeEventHandler<HTMLInputElement>
    }

    let { elm = $bindable(), accept, disabled, onchange }: Props = $props()
    let files: FileList | null | undefined = $state(null)

    onMount(() => {
        if (elm) {
            elm.onchange = () => { files = elm?.files }
        }
    })
</script>
<div class="">
    <label class="border-4 border-sky-800 p-2 bg-black block w-full h-full min-w-[300px] {disabled ? "border-sky-800 cursor-default" : "hover:border-sky-500 hover:cursor-pointer"}">
    <input type="file" bind:this={elm} class="hidden" accept={accept} disabled={disabled} onchange={onchange}>
    {#if files && files?.length > 0}
    File selected: {files[0].name}
    {:else}
    Upload a file pls :3
    {/if}
    </label>
</div>