import { redirect } from '@sveltejs/kit'
import { env } from "$env/dynamic/private"

export function load() {
    redirect(307, "https://discord.gg/3r77DBe5Ur")
}