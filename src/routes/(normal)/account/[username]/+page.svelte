<script lang="ts">
  import type { PageProps } from "./$types";

  import Background from "$lib/assets/images/page/user/world_machine.png";
  import UserCard from "$lib/components/UserViewport.svelte";
  import UserViewport from "$lib/components/UserViewport.svelte";
  import { beforePage } from "$lib/assets/noikHelper";
  let { data }: PageProps = $props();
</script>

<!-- still very experimental ui -->
<section class="w-full relative flex justify-center p-4">
  <div
    style="background-image: url({Background})"
    class="absolute -z-1 top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed"
  ></div>
  <div class="w-screen flex flex-col gap-4 min-h-screen">
    {#if !data.isOk}
      <section class="gap-3 flex flex-col">
        <h1 class="text-center h1-txt-size bg-red-500">Whoops!</h1>
        <p class="text-center h2-txt-size">
          {data.requestedInformation["error"]}
        </p>
        <p class="text-center">
          <em>Maybe, search for another one?</em>
        </p>
      </section>
    {:else}
      <a class="btn w-fit" href={$beforePage}>Go Back</a>
      <UserViewport userData={data.requestedInformation} />
    {/if}
  </div>
</section>
