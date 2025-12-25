<script lang="ts">
  import LogoutIcon from "$lib/assets/images/components/LogoutIcon.svelte";

  import Link from "$lib/components/Link.svelte";
  import Background from "$lib/assets/images/page/user/world_machine.png";
  import { resolve } from "$app/paths";
  import { mobileCheck } from "$lib/helper/helper";
  import toast from "svelte-french-toast";
  import DropdownMenu from "$lib/components/DropdownMenu.svelte";

  let { data, children } = $props();
  const isMobile = $derived(mobileCheck());
</script>

<svelte:head>
  <title>Your Account!</title>
</svelte:head>

<section class="w-full relative flex justify-center">
  <div
    class="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center no-antialias bg-fixed -z-1"
    style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url({Background}); "
  ></div>
  <div class="flex flex-col max-w-[1200px] w-full p-4 gap-4 min-h-screen">
    <div class="flex justify-between items-center">
      <label
        class="relative group cursor-pointer border-4 border-(--theme-color)"
      >
        <input
          type="file"
          class="hidden"
          multiple={false}
          accept="image/*"
          onchange={async (event_trg) => {
            if (event_trg.target) {
              const file: File = event_trg.target.files[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);

              const fetchReq = fetch(`/api/user/change_pfp?id=${data.id}`, {
                method: "PUT",
                body: formData,
              }).then(async (r) => {
                if (!r.ok) throw await r.json();

                setTimeout(() => window.location.reload(), 1000);
              });

              toast.promise(fetchReq, {
                loading: "Setting profile picture...",
                success:
                  "Successfully set profile picture!\nIf it appears like it didn't change, please wait as the image is cached.",
                error: (e) => `Failed to set profile picture: ${e.error}`,
              });
            }
          }}
        />
        <img
          src={`/api/data/user/pfp?id=${data.id}`}
          alt="Profile"
          class="md:w-32 md:h-32 w-20 h-20"
          fetchpriority="high"
        />
        <p
          class="absolute top-0 m-auto bg-black {!isMobile
            ? 'group-hover:opacity-100 opacity-0'
            : 'opacity-100'} transition"
        >
          ✐ Edit
        </p>
      </label>
      <h1 class="md:h2-txt-size flex flex-row gap-4 items-center">
        Hello, {data.username}!
      </h1>
      <a
        class="btn w-fit flex flex-row items-center gap-4"
        href="/api/user/logout"
      >
        <LogoutIcon />
        Log Out
      </a>
    </div>

    <div class="flex flex-col xl:flex-row gap-2">
      <Link href={resolve("/(normal)/account/(main)")}>Home</Link>
      <DropdownMenu
        width={300}
        show_title={true}
        btn_img=""
        title="Noiks & Submissions"
      >
        <h2 class="h2-txt-size">Noiks</h2>
        <Link href={resolve("/(normal)/account/(main)/noik")}
          >Your Nikos :3</Link
        >
        <Link href={resolve("/(normal)/account/(main)/submissions")}
          >Your Submissions</Link
        >
      </DropdownMenu>

      <DropdownMenu width={300} show_title={true} btn_img="" title="Community">
        <h2 class="h2-txt-size">Community!!</h2>
        <Link href={resolve("/(normal)/account/(main)/posts")}>Your Posts</Link>
        <Link href={resolve("/(normal)/account/(main)/comments")}
          >Your Comments</Link
        >
      </DropdownMenu>
      <Link href={resolve("/(normal)/account/(main)/migrate")}
        >Migrate Nikos from Discord</Link
      >
    </div>
    {@render children?.()}
  </div>
</section>
