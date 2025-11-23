<script lang="ts">
  import Background from "$lib/assets/images/page/account/library.png";
  import toast from "svelte-french-toast";
  import type { PageProps } from "./$types";
  import { env } from "$env/dynamic/public";
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  let { form, data }: PageProps = $props();
  let isProcessing = $state(false);

  if (form?.error) {
    toast.error(form.error);
  }

  if (form?.sign_up_success) {
    toast.success("Created account successfully!");
  }
</script>

<svelte:head>
  <title>Nikodex Login!</title>
  <script src="https://js.hcaptcha.com/1/api.js" async defer>
  </script>
</svelte:head>

<!-- TODO: Seperate the sign-up page from the main login page. -->
<section class="w-full relative flex justify-center items-center min-h-screen">
  <div
    class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
    style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
  ></div>
  <form
    onsubmit={() => {
      toast.loading("Logging in");
    }}
    method="POST"
    class="flex flex-col max-w-[420px] w-[420px] p-4 gap-4"
    action="?/loginRequest"
  >
    <label for="username"
      >Username
      <input
        type="text"
        class="border-4 w-full"
        id="username"
        name="username"
        placeholder="Your username??"
        required
      />
    </label>
    <label for="password"
      >Password
      <input
        type="password"
        class="border-4 w-full"
        id="password"
        name="password"
        placeholder="Your password!! ssh... keep it a secret :3 also, pls use something different than 123"
        required
      />
    </label>

    <div>
      <h1>Captcha</h1>
      <div
        id="hcaptcha"
        class="h-captcha"
        data-theme="dark"
        data-sitekey={env.PUBLIC_HCAPTCHA_SITE_KEY}
      ></div>
    </div>
    <button disabled={isProcessing} type="submit" class="btn">Log In</button>
    <button
      disabled={isProcessing}
      formaction="?/signUpRequest"
      type="submit"
      class="btn">Sign Up</button
    >
  </form>
</section>
