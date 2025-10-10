<script lang="ts">
    import { goto } from "$app/navigation";
    import Logo from "$lib/assets/images/logo.png"
    let validating = $state(false)
    import toast from "svelte-french-toast"

    async function submit(ev: SubmitEvent) {
        ev.preventDefault()
        validating = true
        ev.submitter?.setAttribute("disabled", "")
        const formData = new FormData(ev.target as HTMLFormElement)
        const {username, password} = Object.fromEntries(formData.entries())

        const adminLogin = fetch(`/api/admin/auth`, {
            method: "POST",
            body: JSON.stringify({username, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async v => {
            const jsonData = await v.json()
            validating = false
            ev.submitter?.removeAttribute("disabled")
            if (!v.ok) throw new Error(jsonData["error"])

            await goto("/admin")
        })

        await toast.promise(adminLogin, {
            success: "Successfully logged in!",
            loading: "Logging in",
            error: (e) => `Error while logging in: ${e.message}`
        })

    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div class="flex justify-center items-center w-screen h-screen">
    <form onsubmit={submit} method="post" class="min-w-80 flex flex-col gap-6 max-w-[420px] m-4">
        <div class="flex flex-col justify-center items-center gap-2">
            <img src={Logo} alt="Nikodex Logo">
            <h1 class="h1-txt-size">Admin Login</h1>
        </div>
        <div class="field flex flex-col gap-2">
            <label for="username">
                Username
                <input type="text" name="username" id="username" class="block w-full">
            </label>
            <label for="password">
                Password
                <input type="password" name="password" id="password" class="block w-full">
            </label>
        </div>
        <button type="submit" class="w-full btn">{validating ? "Logging in..." : "Login"}</button>
    </form>
</div>