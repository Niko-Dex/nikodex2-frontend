<script lang="ts">
  import type { PageProps } from "./$types";
  import Background from "$lib/assets/images/page/user/world_machine.png";
  import { beforePage, returnGoBackLink } from "$lib/helper/helper";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  let { data }: PageProps = $props();
  const maximumZoom = 5;
  let totalZoom = $state(1);
  let zoomInterval = $state(0.0);

  onMount(() => {
    let intervalOfZoom = setInterval(() => {
      totalZoom = Math.max(1, Math.min(maximumZoom, totalZoom + zoomInterval));
    }, 10);
    return () => {
      clearInterval(intervalOfZoom);
    };
  });
</script>

<svelte:head>
  <title>Viewing Post</title>
</svelte:head>

<section class="w-full relative flex justify-center p-4">
  <div
    class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
    style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
  ></div>
  <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
    <div class="m-auto flex flex-col gap-4">
      <h1 class="h2-txt-size text-center">
        Viewing Post at {Math.ceil(totalZoom)}x Zoom
      </h1>
      <div class="grid grid-cols-3 gap-4">
        <a class="btn text-center" href={returnGoBackLink(page.url.pathname)}
          >Go Back</a
        >
        <button
          class="btn cursor-zoom-in"
          onmousedown={() => {
            zoomInterval = 0.01;
          }}
          onmouseup={() => {
            zoomInterval = 0.0;
          }}
          disabled={!(totalZoom < maximumZoom)}>Zoom In</button
        >
        <button
          class="btn cursor-zoom-out"
          onmousedown={() => {
            zoomInterval = -0.01;
          }}
          onmouseup={() => {
            zoomInterval = 0.0;
          }}
          disabled={totalZoom == 1.0}>Zoom Out</button
        >
      </div>
      <span
        class="w-full overflow-auto bg-black border-4 border-(--theme-color)"
      >
        <img
          src={data.imageLink}
          class="w-max h-max origin-top-left"
          style="scale: {totalZoom};"
          alt="Post you're currently viewing."
        />
      </span>
    </div>
  </div>
</section>
