<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    let username = $state("");
    let description = $state("");

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
        username = data.user?.username ?? "";
        description = data.user?.description ?? "";
    });
</script>

<div
    class="xl:px-8 p-4 w-full flex flex-col gap-2 lg:gap-4 max-w-[1200px] m-auto"
>
    <h1 class="h1-txt-size text-center">Welcome, {username}!</h1>
    <p class="text-center"><em>[{description}]</em></p>
    <p class="text-center">
        Noik tab to edit the Nikosonas, Users tab to manage current accounts,
        and Blog tab to edit the blogs. Check Submissions tab for new noiks.
    </p>
    <p class="text-center">and uhh... that is lol. happy editing, kbity :3</p>

    <div class="flex flex-col gap-2">
        <h2 class="h2-txt-size bg-white text-black">Current Status</h2>
        <p>
            Frontend running on NodeJS v{data.frontend_nodejs_ver} (module version
            {data.frontend_nodejs_module})
        </p>
        <p>Uptime:</p>
        <ul class="list-disc pl-8">
            <li>
                Frontend process: {displayTime(
                    data.frontend_running_for * 1000,
                )}
            </li>
            <li>Server: {displayTime(data.server_uptime * 1000)}</li>
        </ul>
        <p>Memory usage:</p>
        <ul class="list-disc pl-8">
            <li>Frontend: {data.frontend_mem_usage} MB</li>
            <li>
                Server: {data.server_mem_usage} MB/{data.server_mem_total} MB
            </li>
        </ul>
    </div>

    <form class="flex flex-col gap-2" action="?/change_info" method="POST">
        <h2 class="h2-txt-size bg-white text-black">Change Info</h2>
        <p>
            <em>Leave field blank for informations you don't want to change</em>
        </p>
        <p>
            <em
                >note: successful change of info will log you out of the
                dashboard.</em
            >
        </p>
        <label>
            New username:
            <input type="text" class="w-full" name="new_username" />
        </label>
        <label>
            New description:
            <input type="text" class="w-full" name="new_description" />
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
