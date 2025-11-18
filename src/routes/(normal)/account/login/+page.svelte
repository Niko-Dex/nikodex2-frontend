<script lang="ts">
  import { goto, refreshAll } from "$app/navigation";
  import Background from "$lib/assets/images/page/account/library.png";
  import Logo from "$lib/assets/images/logo.png";
  import toast, { Toaster } from "svelte-french-toast";
  import { enhance } from "$app/forms";
  import type { PageProps, SubmitFunction } from "./$types";
  // added for readability
  const LOADING_TEXT = "loading...";

  let { form }: PageProps = $props();
  let isProcessing = $state(false);
</script>

<svelte:head>
  <title>Nikodex Login!</title>
</svelte:head>
<section class="w-full relative flex justify-center">
  <div
    class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
    style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
  ></div>
  <form
    onsubmit={() => {
      toast.loading(LOADING_TEXT);
    }}
    method="POST"
    class="flex flex-col max-w-[1200px] w-[1200px] p-4 gap-4 min-h-screen"
    action="?/loginRequest"
  >
    <div class="flex flex-col items-center gap-0 m-4">
      <img
        src={Logo}
        style="--shadow: 5px 5px red"
        class="scale-80 drop-shadow-(--shadow)"
        alt="Nikodex Logo"
      />
      <h1 class="h2-txt-size">Login</h1>
    </div>
    <label for="username-box">Username:</label>
    <input
      type="text"
      class="border-4 w-full"
      id="username"
      name="username"
      placeholder="Your username??"
    />
    <label for="password-box">Password:</label>
    <input
      type="password"
      class="border-4 w-full"
      id="password"
      name="password"
      placeholder="Your password!! ssh... keep it a secret :3 also, pls use something different than 123"
    />
    <h1 class="bg-red-500 text-center">{form?.error}</h1>
    <button disabled={isProcessing} type="submit" class="btn">Log In</button>
    <!-- TODO: Add Sign-Up page. -->
    <button
      disabled={isProcessing}
      formaction="?/signUpRequest"
      type="submit"
      class="btn">Sign Up (doesn't work yet)</button
    >
  </form>
</section>
