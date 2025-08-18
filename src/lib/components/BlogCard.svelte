<script lang="ts">
    import { format } from 'date-fns'
    let expanded = $state(false)

    let {
        title = "",
        author = "",
        content = "",
        post_datetime = ""
    } = $props()
</script>

<div class={expanded ? "transition duration-200 bg-black/75 fixed w-screen h-screen top-0 left-0 z-5 flex justify-center items-center" : "w-full"}>
    <div class={`border-4 border-amber-600 bg-black flex flex-col p-4 gap-4 ${expanded ? "w-3xl" : ""}`}>
        <div class="main-info flex flex-col">
            <h2 class="h2-txt-size w-fit">{title}</h2>
            <p class="w-fit px-1 bg-white text-black">by {author}</p>
            <p class="w-fit px-1">Posted on {format(Date.parse(post_datetime), 'dd MMM yyyy')}</p>
        </div>
        {#if expanded}
            <div>
                <p>{content}</p>
            </div>
        {/if}
        <div>
            <button class="btn border-amber-600" onclick={() => expanded = !expanded}>{expanded ? "Close" : "Read"}</button>
        </div>
    </div>
</div>