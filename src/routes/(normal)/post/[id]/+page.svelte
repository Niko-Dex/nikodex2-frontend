<script lang="ts">
  import type { PageProps } from "./$types";
  import Background from "$lib/assets/images/page/user/world_machine.png";
  let { data }: PageProps = $props();
  import { format } from "date-fns";
  import { beforePage, returnGoBackLink } from "$lib/helper/helper";
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>NikoDex - {data.postData.title}</title>
</svelte:head>

<section class="w-full relative flex justify-center p-4">
  <div
    class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
    style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
  ></div>
  <div class="max-w-[1200px] w-[1200px] flex flex-col gap-4 min-h-screen">
    <a class="btn w-fit" href={returnGoBackLink(page.url.pathname)}>Go Back</a>
    <div class="flex flex-col gap-0.5">
      <h1 class="h1-txt-size">{data.postData.title}</h1>
      <p>
        By: <a
          class="bg-white text-black w-fit px-1"
          href="/account/{data.postData.user.username}"
          >{data.postData.user.username}</a
        >
      </p>
      <p>
        Posted on {format(
          Date.parse(data.postData.post_datetime),
          "dd MMM yyyy - HH:mm:ss"
        )}
      </p>
    </div>
    <p>{data.postData.content}</p>

    <div class="w-full flex flex-col items-center gap-4">
      <div
        class="lg:max-w-[70%] max-w-full p-4 border-2 border-(--theme-color)"
      >
        <img
          class="non-pixelated"
          alt={`Image of ${data.postData.title}`}
          src="/api/posts/image?id={data.postData.id}"
        />
      </div>
      <a href="/post/img_viewer/{data.postData.id}" class="btn">Preview Image</a
      >
    </div>
    <br />
  </div>
</section>
