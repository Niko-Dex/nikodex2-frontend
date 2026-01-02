<script lang="ts">
    import { currentUser } from "$lib/helper/helper";
    import type { User } from "$lib/types/user";
    let { children } = $props();
    import { onMount } from "svelte";
    onMount(async () => {
        const color = localStorage.getItem("color");
        if (color && color != "") {
            document.body.style.setProperty("--theme-color", color);
        }

        const authorizationMessage = await fetch(`/api/user/me`);
        if (authorizationMessage.ok) {
            const userInfo: User = await authorizationMessage.json();
            $currentUser = userInfo;
        } else {
            $currentUser = undefined;
        }
    });
</script>

{@render children?.()}
