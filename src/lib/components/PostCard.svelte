<script lang="ts">
    let { id = 0, title = "", username = "" } = $props();
</script>

<a href={`/post/${id}`} class="bg-black border-4 border-(--theme-color) p-2">
    <h2 class="h2-txt-size">{title}</h2>
    <p>
        By: <span class="bg-white text-black w-fit px-1">{username}</span>
    </p>
    <div class="flex flex-col items-center">
        <img alt={title} src={`/api/posts/image?id=${id}`} class="h-56" />
    </div>
</a>
