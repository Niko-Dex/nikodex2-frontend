<script lang="ts">
  let {
    id,
    name,
    description,
    full_desc,
    image,
  }: {
    id: number;
    name: string;
    description: string;
    full_desc: string;
    image: string;
  } = $props();
</script>

<section class="border-4 border-(--theme-color) p-5 bg-black flex flex-row gap-8">
  <img src={image} class="w-32 h-32" alt="waiting noik :3" />
  <div class="w-full flex flex-col gap-4">
    <h2 class="h2-txt-size">Submission: <span class="bg-white text-black px-1">{name}</span></h2>
    <p>Description: <em>"{description}"</em></p>
    <p>Full description: <em>"{full_desc}"</em></p>
    <p class="text-right">
      <em>This submission is waiting for moderator approval. :o</em>
    </p>
  </div>
</section>
