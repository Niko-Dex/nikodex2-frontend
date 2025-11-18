<script>
  import { beforeNavigate } from "$app/navigation";
  import { beforePage } from "$lib/assets/noikHelper";
  let { children } = $props();
  import { onMount } from "svelte";
  onMount(() => {
    const color = localStorage.getItem("color");
    if (color && color != "") {
      document.body.style.setProperty("--theme-color", color);
    }
  });
  // twm doesn't launch you back to /noik only anymore yay
  beforeNavigate((navi) => {
    if (navi.from) $beforePage = navi.from.url.pathname;
  });
</script>

{@render children?.()}
