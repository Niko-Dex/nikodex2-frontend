<script lang="ts">
    import type { PageProps } from "./$types";
    let { data }: PageProps = $props();
    import { goto } from "$app/navigation";
    import toast from "svelte-french-toast";
    import { onMount } from "svelte";

    let new_username = $state("");
    let new_description = $state("");
    let new_password = $state("");
    let new_password2 = $state("");

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
            success: redirect
                ? "User updated! Please log back in."
                : "User updated!",
            loading: "Updating user",
            error: (e) => `Problem while updating user! ${e}`,
        });
    }

    onMount(() => {
        new_username = data.username;
        new_description = data.description;
    });
</script>

<div class="flex flex-col gap-2">
    <p>Your user ID is: {data.id}</p>
    {#if data.is_admin}
        <p>You are an admin!</p>
    {/if}
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl">Bio/About Me</h1>
        <div class="min-w-full">
            <textarea class="w-full" bind:value={new_description}></textarea>
        </div>
        <button class="btn" onclick={async () => await updateUser(false)}
            >Update Info</button
        >
    </div>
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl">Login info</h1>

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
</div>
