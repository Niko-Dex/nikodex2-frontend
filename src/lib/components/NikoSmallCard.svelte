<script lang="ts">
    let {
        id = 0,
        name = "",
        author = "",
        btn_title = "",
        onclick = () => {},
    } = $props();
</script>

<div
    class="p-4 bg-black border-4 border-(--theme-color) w-full flex flex-row gap-2 justify-between"
>
    <div class="flex flex-row">
        <div class="img w-24 h-3xs">
            <img
                alt={`Image of ${name}`}
                src={`/api/image?id=${id}`}
                class="no-antialias object-contain size-full"
            />
        </div>
        <div class="flex flex-col">
            <h1 class="text-3xl">{name}</h1>
            <p>by {author}</p>
        </div>
    </div>
    <div class="flex flex-row items-center">
        <button class="btn" onclick={() => onclick()}>{btn_title}</button>
    </div>
</div>
