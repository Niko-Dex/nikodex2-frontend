<script lang="ts">
    import { goto } from "$app/navigation";
    import Logo from "$lib/assets/images/logo.png"
    let validating = $state(false)
    import toast, { Toaster } from "svelte-french-toast"

    function submit(ev: SubmitEvent) {
        ev.preventDefault()
        validating = true
        ev.submitter?.setAttribute("disabled", "")
        const formData = new FormData(ev.target as HTMLFormElement)
        const {username, password} = Object.fromEntries(formData.entries())

        fetch(`/api/admin/auth`, {
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
                if (v.status != 200) {
                    if (v.status == 401) toast.error(`Error while logging in: ${jsonData["error"]}`)
                    return
                }

                await goto("/admin")
            })
            .catch(v => {
                validating = false
                ev.submitter?.removeAttribute("disabled")
                toast.error(`Error while connecting to API server!`)
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
                <input type="text" name="username" id="username" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6">
            </label>
            <label for="password">
                Password
                <input type="password" name="password" id="password" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6">
            </label>
        </div>
        <button type="submit" class="w-full rounded-md bg-indigo-500 px-3 py-1.5 text-white hover:bg-indigo-400 hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-75">{validating ? "Logging in..." : "Login"}</button>
    </form>
</div>