<script lang="ts">
    import Logo from "$lib/assets/images/logo.png";
    import { onMount } from "svelte";
    let validating = $state(false);
    import toast from "svelte-french-toast";

    let { form } = $props();

    async function submit() {
        validating = true;
        toast.loading("Logging in");
    }

    onMount(async () => {
        if (form?.error) {
            toast.error(form.error);
        }
    });
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div class="flex justify-center items-center w-screen h-screen">
    <form
        onsubmit={submit}
        method="post"
        class="min-w-80 flex flex-col gap-6 max-w-[420px] m-4"
    >
        <div class="flex flex-col justify-center items-center gap-2">
            <img src={Logo} alt="Nikodex Logo" />
            <h1 class="h1-txt-size">Admin Login</h1>
        </div>
        <div class="field flex flex-col gap-2">
            <label for="username">
                Username
                <input
                    type="text"
                    name="username"
                    id="username"
                    class="block w-full"
                    autocomplete="username"
                    required
                    readonly={validating}
                />
            </label>
            <label for="password">
                Password
                <input
                    type="password"
                    name="password"
                    id="password"
                    class="block w-full"
                    autocomplete="current-password"
                    required
                    readonly={validating}
                />
            </label>
        </div>
        <button type="submit" class="w-full btn" disabled={validating}
            >{validating ? "Logging in..." : "Login"}</button
        >
    </form>
</div>
