<script lang="ts">
    let firstLoad = $state(true)
    let visible = $state(false)
    let lastTimestamp = $state(0)
    let nowTimestamp = $state(0)

    let animFrameNum = 0;

    import { beforeNavigate, afterNavigate, goto } from "$app/navigation"

    function timerRun(now: number) {
        nowTimestamp = now
        requestAnimationFrame(timerRun)
    }

    beforeNavigate((nav) => {
        if (nav.willUnload) return
        if (nav.to?.url.searchParams.has("go")) {
            nav.to?.url.searchParams.delete("go")
            return
        }
        visible = true
        animFrameNum = requestAnimationFrame(timerRun)
        lastTimestamp = performance.now()
        nav.cancel()

        setTimeout(async () => {
            nav.to?.url.searchParams.append("go", "")
            await goto(nav.to?.url ?? "")
        }, 200)
    })

    afterNavigate((nav) => {
        visible = false
        firstLoad = false
        cancelAnimationFrame(animFrameNum)
    })
</script>

<style>
    @keyframes slidein {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0%);
        }
    }

    @keyframes slideout {
        from {
            transform: translateX(0%);
        }
        to {
            transform: translateX(100%);
        }
    }

    .slide-in {
        animation: slidein 0.2s forwards;
    }

    .slide-out {
        animation: slideout 0.2s forwards;
    }
</style>

<div class="overlay bg-indigo-900 fixed top-0 left-0 w-screen h-screen z-10 {visible ? "slide-in" : "slide-out"} flex justify-center items-center">
    {#if firstLoad}
    <h1><em>loading... :3</em></h1>
    {:else}
    <h1><em>loading ({((nowTimestamp - lastTimestamp) / 1000).toFixed(1)}s)... :3</em></h1>
    {/if}
</div>
