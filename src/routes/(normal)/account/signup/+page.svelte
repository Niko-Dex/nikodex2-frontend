<script lang="ts">
    import Background from "$lib/assets/images/page/account/library.png";
    import { Turnstile } from "svelte-turnstile";
    import toast from "svelte-french-toast";
    import type { PageProps } from "./$types";
    import { env } from "$env/dynamic/public";
    let { form, data }: PageProps = $props();
    let isProcessing = $state(false);

    if (form?.error) {
        toast.error(form.error);
    }

    if (form?.success) {
        toast.success("Successfully signed up! Please log in.");
    }
</script>

<svelte:head>
    <title>Nikodex Login!</title>
</svelte:head>

<!-- TODO: Seperate the sign-up page from the main login page. -->
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
        <h2 class="h2-txt-size text-center">Sign up for Nikodex</h2>
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
            <h1>Captcha</h1>
            <Turnstile siteKey={env["PUBLIC_TURNSTILE_SITE_KEY"] ?? ""} />
        </div>
        <button disabled={isProcessing} type="submit" class="btn"
            >Sign up</button
        >
        <a href="/account/login">Want to log in?</a>
    </form>
</section>
