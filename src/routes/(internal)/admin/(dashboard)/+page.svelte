<script lang="ts">
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  let username = $state("");
  let description = $state("");
  import { page } from "$app/state";
  const currentUser = $derived(page.data.currentUser);

  let { data, form } = $props();

  function displayTime(date: number) {
    var s = Math.floor(date / 1000),
      m = Math.floor(s / 60),
      h = Math.floor(m / 60),
      d = Math.floor(h / 24);

    var result = "",
      result_arr = [
        `${d} days`,
        `${h % 24} hours`,
        `${m % 60} minutes`,
        `${s % 60} seconds`,
      ];

    result =
      result_arr.slice(0, result_arr.length - 1).join(", ") +
      (result_arr.length > 1 ? " and " : "") +
      result_arr[result_arr.length - 1];

    return result;
  }

  onMount(async () => {
    if (form?.error) {
      toast.error("Error! " + form.error);
    }
    username = currentUser?.username ?? "";
    description = currentUser?.description ?? "";
  });
</script>

<div
  class="xl:px-8 p-4 w-full flex flex-col gap-2 lg:gap-4 max-w-[1200px] m-auto"
>
  <h1 class="h1-txt-size">Welcome, {username}!</h1>
  <p><em>[{description}]</em></p>
  <p>
    Noik tab to edit the Nikosonas, Users tab to manage current accounts, and
    Blog tab to edit the blogs. Check Submissions tab for new Nikosonas to
    accept.
  </p>
  <p>And uhh... that is lol. Happy editing, kbity :3</p>

  <div class="flex flex-col gap-2">
    <h2 class="h2-txt-size bg-white text-black">Current Status</h2>
    <p>
      Frontend running on NodeJS v{data.server_info.frontend_nodejs_ver} (module
      version
      {data.server_info.frontend_nodejs_module})
    </p>
    <p>Uptime:</p>
    <ul class="list-disc pl-8">
      <li>
        Frontend process: {displayTime(
          data.server_info.frontend_running_for * 1000,
        )}
      </li>
      <li>
        Server: {displayTime(data.server_info.server_uptime * 1000)}
      </li>
    </ul>
    <p>Memory usage:</p>
    <ul class="list-disc pl-8">
      <li>Frontend: {data.server_info.frontend_mem_usage} MB</li>
      <li>
        Server: {data.server_info.server_mem_usage} MB/{data.server_info
          .server_mem_total} MB
      </li>
    </ul>
  </div>

  <form method="POST" class="flex flex-col gap-2">
    <h2 class="h2-txt-size bg-white text-black">Manage Banner</h2>
    <p>
      Make changes to the banner, which will appear on the top of the navbar.
    </p>
    <p><i>Leave Title field blank to remove banner.</i></p>
    <label>
      Title (max 120 chars):
      <input
        name="title"
        type="text"
        class="w-full"
        placeholder="Title here..."
        maxlength="120"
        value={data.banner.title}
      /></label
    >
    <label>
      <p>Details (max 500 chars) <i>(optional)</i>:</p>
      <p><i>This will show up when user clicks on [Learn More]</i></p>
      <textarea
        class="w-full"
        maxlength="500"
        name="content"
        value={data.banner.content}
      ></textarea>
    </label>
    <label class="flex flex-row gap-4 items-center group">
      <input
        class="cursor-pointer w-16 h-16"
        type="color"
        name="banner_color"
        value={data.banner.banner_color}
      />
      <p class="text-black invert">Color of the banner.</p>
    </label>
    <label class="flex flex-row items-center gap-4">
      <input
        type="checkbox"
        name="is_dismissable"
        class="checkbox"
        value="yes"
        checked={data.banner.is_dismissable}
      />
      <p>Dismissable <i>(allow user to dismiss banner)</i></p>
    </label>
    <div class="flex flex-row gap-4">
      <button class="btn" type="submit" formaction="?/update_banner"
        >Save Changes</button
      >
    </div>
  </form>

  <form class="flex flex-col gap-2" action="?/change_info" method="POST">
    <h2 class="h2-txt-size bg-white text-black">Change Info</h2>
    <p>
      <em>Leave field blank for informations you don't want to change</em>
    </p>
    <p>
      <em>note: successful change of info will log you out of the dashboard.</em
      >
    </p>
    <label>
      New username:
      <input
        type="text"
        class="w-full"
        name="new_username"
        value={data.me.username}
      />
    </label>
    <label>
      New description:
      <input
        type="text"
        class="w-full"
        name="new_description"
        value={data.me.description}
      />
    </label>
    <label>
      New password:
      <input
        type="password"
        class="w-full"
        autocomplete="new-password"
        name="new_password"
      />
    </label>
    <label>
      Re-type new password:
      <input
        type="password"
        class="w-full"
        autocomplete="new-password"
        name="new_password2"
      />
    </label>
    <button class="btn" type="submit">Change Info</button>
  </form>
</div>
