<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";

    let username = $state("")

    onMount(async() => {
		const userRes = await fetch("/api/admin/user")
		if (userRes.status == 401) goto("/admin/login")

        const userData = await userRes.json()
		username = userData["username"]
	})

    let new_username = $state("")
    let new_password = $state("")
    let new_password2 = $state("")

    async function update() {
        const res = await fetch(`/api/admin/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                new_username,
                new_password,
                new_description: ""
            })
        })

        if (res.status > 299) {
            toast.error(`Problem while updating username! ${await res.text()}`)
        } else {
            goto("/admin/login")
        }
    }

    async function updateUsername(ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        const btn = ev.target as HTMLButtonElement
        btn.disabled = true
        if (new_username.trim().length == 0) {
            toast.error("New username cannot be empty!")
            btn.disabled = false
            return
        }

        await update()
        btn.disabled = false
    }

    async function updatePassword(ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        const btn = ev.target as HTMLButtonElement
        btn.disabled = true
        if (new_password.length == 0) {
            toast.error("New password cannot be empty!")
            btn.disabled = false
            return
        }

        if (new_password != new_password2) {
            toast.error("New password do not match!")
            btn.disabled = false
            return
        }

        await update()
        btn.disabled = false
    }
</script>

<div class="xl:px-4 flex flex-col gap-4 max-w-[1200px] m-auto">
    <h1 class="h1-txt-size text-center">Welcome, {username}!</h1>
    <p class="text-center">Edit the Noiksona at the Noik link above, along with the Blog at the Blog link.</p>
    <p class="text-center">and uhh... that is lol. kbity :3</p>

    <div class="flex flex-col gap-2">
        <h2 class="h2-txt-size">Change Username</h2>
        <p>note: successful change of username will log you out of the dashboard.</p>
        <label>
            New username:
            <input type="text" class="w-full" bind:value={new_username}>
        </label>
        <button class="btn" onclick={updateUsername}>Change username</button>
    </div>

    <div class="password_change flex flex-col gap-2">
        <h2 class="h2-txt-size">Change Password</h2>
        <p>If you have not changed the default login password of "nikodex": DO IT NOW!</p>
        <p>note: successful change of password will log you out of the dashboard.</p>
        <label>
            New password:
            <input type="password" class="w-full" autocomplete="new-password" bind:value={new_password}>
        </label>
        <label>
            Re-type new password:
            <input type="password" class="w-full" autocomplete="new-password" bind:value={new_password2}>
        </label>
        <button class="btn" onclick={updatePassword}>Change password</button>
    </div>
</div>