<script lang="ts">
    import { afterNavigate, invalidate } from "$app/navigation";
    let { children } = $props();
    let errAPI = $state(false);
    import { onMount } from "svelte";
    onMount(async () => {
        const color = localStorage.getItem("color");
        if (color && color != "") {
            document.body.style.setProperty("--theme-color", color);
        }
    });

    async function checkAPI() {
        try {
            const res = await fetch("/api/ping");
            errAPI = !res.ok;
        } catch {
            errAPI = true;
        }
    }
    afterNavigate(() => {
        checkAPI();
        invalidate("app:auth");
    });
</script>

{#if errAPI}
    <div
        class="fixed top-0 left-0 w-full h-full z-100 bg-red-800 flex justify-center items-center"
    >
        <div class="max-w-[1200px] mx-8">
            <h1 class="h1-txt-size mb-4">
                unable to contact backend or frontend API server
            </h1>
            <p>
                if you are the <u>user</u>: contact the website host/admin or
                the site's developer, and/or do a refresh after a few moments.
            </p>
            <p>
                if you are the <u>website host/admin</u>: check if you have
                setup the website incorrectly (make sure that both the frontend,
                backend and the bot components are running, and that their
                connections are not blocked). check the output of the backend
                and frontend to look for 500 errors, and look for errors in the
                developer console. if you can't figure out the problem, contact
                the developer.
            </p>
            <p>
                if you are the <u>developer</u>: ... why the fuck are you
                reading this? go and fix the website!!!
            </p>
        </div>
    </div>
{:else}
    {@render children?.()}
{/if}
