<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";

    let username = $state("");
    let description = $state("");

    let { data } = $props();

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
        const userRes = await fetch("/api/admin/user");
        if (userRes.status == 401) goto("/admin/login");

        const userData = await userRes.json();
        username = userData["username"];
        description = userData["description"];
    });

    let new_username = $state("");
    let new_password = $state("");
    let new_password2 = $state("");

    async function update() {
        const fetchUser = fetch(`/api/admin/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                new_username,
                new_password,
                new_description: "",
            }),
        }).then(async (v) => {
            if (!v.ok) throw new Error((await v.json())["error"]);
            await goto("/admin/login");
        });

        await toast.promise(fetchUser, {
            success: "User updated! Please log back in.",
            loading: "Updating user",
            error: (e) => `Problem while updating user! ${e}`,
        });
    }

    async function updateUsername(
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) {
        const btn = ev.target as HTMLButtonElement;
        btn.disabled = true;
        if (new_username.trim().length == 0) {
            toast.error("New username cannot be empty!");
            btn.disabled = false;
            return;
        }

        await update();
        btn.disabled = false;
    }

    async function updatePassword(
        ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) {
        const btn = ev.target as HTMLButtonElement;
        btn.disabled = true;
        if (new_password.length == 0) {
            toast.error("New password cannot be empty!");
            btn.disabled = false;
            return;
        }

        if (new_password != new_password2) {
            toast.error("New password do not match!");
            btn.disabled = false;
            return;
        }

        await update();
        btn.disabled = false;
    }
</script>

<Toaster />
<div class="xl:px-4 flex flex-col gap-2 lg:gap-4 max-w-[1200px] m-auto">
    <h1 class="h1-txt-size text-center">Welcome, {username}!</h1>
    <p class="text-center"><em>[{description}]</em></p>
    <p class="text-center">
        Noik tab to edit the Nikosonas, and Blog tab to edit the blogs.
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

    <div class="flex flex-col gap-2">
        <h2 class="h2-txt-size bg-white text-black">Change Username</h2>
        <p>
            note: successful change of username will log you out of the
            dashboard.
        </p>
        <label>
            New username:
            <input type="text" class="w-full" bind:value={new_username} />
        </label>
        <button class="btn" onclick={updateUsername}>Change username</button>
    </div>

    <div class="password_change flex flex-col gap-2">
        <h2 class="h2-txt-size bg-white text-black">Change Password</h2>
        <p>
            If you have not changed the default login password of "nikodex": DO
            IT NOW!
        </p>
        <p>
            note: successful change of password will log you out of the
            dashboard.
        </p>
        <label>
            New password:
            <input
                type="password"
                class="w-full"
                autocomplete="new-password"
                bind:value={new_password}
            />
        </label>
        <label>
            Re-type new password:
            <input
                type="password"
                class="w-full"
                autocomplete="new-password"
                bind:value={new_password2}
            />
        </label>
        <button class="btn" onclick={updatePassword}>Change password</button>
    </div>
</div>
