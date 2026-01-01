<script lang="ts">
    import { beforeNavigate, afterNavigate } from "$app/navigation";
    let progress = $state(0);
    let opacity = $state(1);

    let lastTimestamp = $state(0);
    let nowTimestamp = $state(0);
    let initProgress = 0.1;
    let maxProgress = 0.98;
    let updateInterval = 0.5;
    let passedInterval = 0;
    let delta = $derived.by(() => nowTimestamp - lastTimestamp);

    let animFrameNum = 0;

    function timerRun(now: number) {
        if (passedInterval > updateInterval) {
            progress = Math.max(
                Math.min(
                    progFunc(initProgress, 0.12, delta / 1000),
                    maxProgress,
                ),
                initProgress,
            );
            passedInterval = 0;
        }
        passedInterval += (now - nowTimestamp) / 1000;
        nowTimestamp = now;
        animFrameNum = requestAnimationFrame(timerRun);
    }

    function progFunc(y0: number, k: number, x: number) {
        // modified Sigmoid curve
        return y0 + (1 - y0) * (1 - Math.exp(-k * x));
    }

    beforeNavigate(() => {
        progress = initProgress;
        opacity = 1;
        animFrameNum = requestAnimationFrame(timerRun);
        lastTimestamp = performance.now();
    });

    afterNavigate(() => {
        progress = 1;
        setTimeout(() => {
            opacity = 0;
        }, 100);
        cancelAnimationFrame(animFrameNum);
        setTimeout(() => {
            progress = 0;
        }, 200);
        console.log("done");
    });
</script>

<div
    class="h-[3px] fixed top-0 z-100 transition-[clip-path, opacity] duration-200 ease-out loading-bar pointer-events-none"
    style="width: 100%; opacity: {opacity}; clip-path: polygon(0 0, {progress *
        100}% 0, {progress * 100}% 100%, 0% 100%);"
></div>

<style>
    @keyframes slide {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -100% 0;
        }
    }

    .loading-bar {
        animation: slide 1s linear infinite;
        background: linear-gradient(
            90deg,
            rgba(247, 45, 45, 1) 0%,
            rgba(61, 230, 46, 1) 25%,
            rgba(247, 45, 45, 1) 50%,
            rgba(61, 230, 46, 1) 75%,
            rgba(247, 45, 45, 1) 100%
        );

        background-size: 200% 100%;
    }
</style>
