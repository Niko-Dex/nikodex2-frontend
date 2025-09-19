import { redirect } from '@sveltejs/kit'

export function load() {
    redirect(307, "https://discord.gg/3r77DBe5Ur")
}