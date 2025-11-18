<script lang="ts">
  import Background from "$lib/assets/images/page/user/world_machine.png";
  import Card from "$lib/components/Card.svelte";
  import CardContainer from "$lib/components/CardContainer.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { PageProps } from "./$types";
  import toast, { Toaster } from "svelte-french-toast";
  import { onMount } from "svelte";
  import { fetchNikos } from "$lib/assets/noikHelper";
  let { data }: PageProps = $props();

  let loaded = $state(true);
  let new_username = $state("");
  let new_description = $state("");
  let new_password = $state("");
  let new_password2 = $state("");

  let pageOpt = $state("main");
  let apiData: Niko[] = $state([]);

  async function updateUser(redirect: boolean) {
    const fetchUser = fetch(`/api/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_username,
        new_password,
        new_description,
      }),
    }).then(async (v) => {
      if (!v.ok) throw new Error((await v.json())["error"]);
      else {
        if (redirect) {
          await fetch(`/api/user/logout`);
          await goto("/account/login");
        }
      }
    });

    await toast.promise(fetchUser, {
      success: redirect ? "User updated! Please log back in." : "User updated!",
      loading: "Updating user",
      error: (e) => `Problem while updating user! ${e}`,
    });
  }

  onMount(async () => {
    new_username = data.username;
    new_description = data.description;
    loaded = true;

    await fetchNikos(data.id, apiData);
  });
  /*
        TODO:
        Add Noik uploading
        Show the amount of Noiks the user has made
        Make the page a bit better, it's currently only a test-page.
    */
</script>

<svelte:head>
  <title>Your Account!</title>
</svelte:head>

<section class="w-full relative flex justify-center">
  <div
    class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
    style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
  ></div>
  <div class="flex flex-col max-w-[1200px] w-[1200px] p-4 gap-4 min-h-screen">
    <h1 class="h2-txt-size">
      Hello, {data.username}! (This is a test to make sure it works!)
    </h1>
    <p class="text-sm">Your ID is: {data.id}</p>
    {#if data.is_admin}
      <p class="text-sm">You are an admin!</p>
    {/if}

    <div
      class="border-4 border-(--theme-color) bg-black flex flex-col p-4 gap-2"
    >
      <select bind:value={pageOpt} aria-label="Current page">
        <option selected value="main">General Info</option>
        <option value="noiks">Noiks</option>
      </select>
    </div>
    {#if pageOpt == "main"}
      <div
        class="border-4 border-(--theme-color) bg-black flex flex-col p-4 gap-2"
      >
        <h1 class="text-3xl">Bio/About Me</h1>
        <div class="min-w-full">
          <textarea class="w-full" bind:value={new_description}></textarea>
        </div>
        <button class="btn" onclick={async () => await updateUser(false)}
          >Update Info</button
        >
      </div>
      <div
        class="border-4 border-(--theme-color) bg-black flex flex-col p-4 gap-2"
      >
        <h1 class="text-xl">Login info</h1>

        <div class="min-w-full">
          <p>New Username:</p>
          <input class="w-full" type="text" bind:value={new_username} />
        </div>

        <div class="min-w-full">
          <p>New Password</p>
          <input class="w-full" type="password" bind:value={new_password} />
        </div>

        <div class="min-w-full">
          <p>Confirm New Password</p>
          <input class="w-full" type="password" bind:value={new_password2} />
        </div>

        <button class="btn" onclick={async () => await updateUser(true)}
          >Update Info</button
        >
      </div>
    {:else}
      <h1>Your Noiks! ({apiData.length})</h1>
      {#if loaded}
        <CardContainer>
          {#each apiData as data (data.id)}
            <Card
              abilities={data.abilities}
              author={data.author}
              description={data.description}
              name={data.name}
              short_desc={data.short_desc}
              id={data.id}
            />
          {/each}
        </CardContainer>
      {:else}
        <p>Loading..</p>
      {/if}
    {/if}
    <a class="btn" href="/api/user/logout">Log Out</a>
  </div>
</section>
