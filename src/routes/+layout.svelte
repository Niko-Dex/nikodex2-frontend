<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { beforePage, origRedirects } from "$lib/helper/helper";
  let { children } = $props();
  import { onMount } from "svelte";
  onMount(() => {
    const color = localStorage.getItem("color");
    if (color && color != "") {
      document.body.style.setProperty("--theme-color", color);
    }
  });

  beforeNavigate(({ to }) => {
    const pathName = to?.url.pathname || "";
    let finalCheckedValue = false;
    origRedirects.forEach((v) => {
      if (pathName.includes(v)) finalCheckedValue = true;
    });
    if (!finalCheckedValue) $beforePage.push(pathName);
  });
</script>

{@render children?.()}
