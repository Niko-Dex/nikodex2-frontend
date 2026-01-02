<script lang="ts">
    import Background from "$lib/assets/images/page/account/library.png";
    import { Turnstile } from "svelte-turnstile";
    import toast from "svelte-french-toast";
    import type { PageProps } from "./$types";
    import { env } from "$env/dynamic/public";
    let { form }: PageProps = $props();
    let isProcessing = $state(false);
    let showToS = $state(false);
    let acceptedToS = $state(false);

    if (form?.error) {
        toast.error(form.error);
    }

    if (form?.success) {
        toast.success("Successfully signed up! Please log in.");
    }

    function showTerms(ev: Event) {
        if (acceptedToS) return;
        ev.preventDefault();
        showToS = true;
    }

    function answerToS(accept: boolean) {
        acceptedToS = accept;
        showToS = false;
    }
</script>

<svelte:head>
    <title>Nikodex Signup!</title>
</svelte:head>

<div
    class="fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center no-antialias {showToS
        ? ''
        : 'hidden'}"
>
    <div
        class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 max-w-[1200px] sm:mx-8 my-auto overflow-auto max-h-screen w-full flex-col"
    >
        <h1 class="h1-txt-size">The Nikodex v2's Terms of Service</h1>

        <p>
            By creating an account on The Nikodex v2 ("The Nikodex"), you ("the
            Account Holder") acknowledge and agree to the following terms,
            hereby laid out by The Maintainers and The Administrators of The
            Nikodex ("We"/"us"):
        </p>
        <ol class="list-decimal [&>li]:ml-12">
            <li>
                You may not create an account on The Nikodex using information
                (including but not limited to your username, profile
                description, or other identifying details) that is offensive,
                harmful, or otherwise inappropriate.
            </li>
            <li>
                You may not submit any content on The Nikodex (including but not
                limited to your Nikosonas, Posts, or any other forms of content
                offered by The Nikodex) that contain information which are
                offensive or harmful.
            </li>
            <li>
                You may not edit or change your existing content on The Nikodex
                in a way that introduces inappropriate, offensive, or harmful
                content.
            </li>
            <li>
                You may not abuse or cause damages to The Nikodex or the
                components related to The Nikodex, including but not limited to
                spamming submissions, constantly sending requests to The
                Nikodex's servers, or attempting to exploit bugs in The Nikodex.
            </li>
            <li>
                The Terms listed above are not exhaustive. Any behavior or
                action that is harmful, abusive, or otherwise go against the
                intended purpose of The Nikodex may be treated as a violation,
                even if not specifically listed above.
            </li>
        </ol>
        <p>
            We reserve the right to terminate your Account, along with any
            content you have created, if you violate these Terms of Service.
        </p>
        <p>
            <em>
                TL;dr: You will not make an account that has offensive contents
                like username or description. You will not make or edit
                submissions (Nikosonas, Posts, etc.), with or to have, any
                offensive contents. We will terminate your accounts if we found
                out you break the rules. Use common sense.
            </em>
        </p>
        <p>
            Being a good kbity means that you have read and understand the Terms
            of Service above.
        </p>
        <div class="flex justify-end gap-4">
            <button class="btn" onclick={() => answerToS(true)}
                >I agree :3</button
            >
            <button class="btn" onclick={() => answerToS(false)}
                >I do not agree :c</button
            >
        </div>
    </div>
</div>

<section class="w-full relative flex justify-center items-center min-h-screen">
    <div
        class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
        style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
    ></div>
    <form
        onsubmit={() => {
            toast.loading("Signing up..");
        }}
        method="POST"
        class="flex flex-col max-w-[420px] w-[420px] p-4 gap-4"
    >
        <h1 class="h1-txt-size text-center">Sign Up</h1>
        <label for="username"
            >Username
            <input
                type="text"
                class="w-full"
                id="username"
                name="username"
                autocomplete="username"
                placeholder="Your username??"
                required
            />
        </label>
        <label for="password"
            >Password
            <input
                type="password"
                class="w-full"
                id="password"
                name="password"
                autocomplete="new-password"
                placeholder="Your password!! ssh... keep it a secret :3 also, pls use something different than 123"
                required
            />
        </label>
        <label for="confirm_password"
            >Confirm Password
            <input
                type="password"
                class="w-full"
                id="confirm_password"
                name="confirm_password"
                autocomplete="new-password"
                placeholder="Your password again!"
                required
            />
        </label>

        <div>
            <span>Captcha</span>
            <Turnstile siteKey={env["PUBLIC_TURNSTILE_SITE_KEY"] ?? ""} />
        </div>

        <label class="flex items-center gap-4">
            <input
                type="checkbox"
                name="agree_tok"
                required
                onclick={showTerms}
                bind:checked={acceptedToS}
            />
            I agree to be a good kbity when using the Nikodex :3
        </label>
        <button disabled={isProcessing} type="submit" class="btn"
            >Sign up</button
        >
        <a href="/account/login">Want to log in?</a>
    </form>
</section>
