import { redirect } from '@sveltejs/kit'
import { env } from "$env/dynamic/private"

export function load({ url }) {
    const authURL = new URL("https://discord.com/oauth2/authorize")
    authURL.searchParams.set("client_id", env.DISCORD_BOT_CLIENT_ID)
    authURL.searchParams.set("response_type", "code")
    authURL.searchParams.set("redirect_uri", new URL("/api/discord_auth", url.origin).href)
    authURL.searchParams.set("scope", "identify")

    redirect(307, authURL.toString())
}