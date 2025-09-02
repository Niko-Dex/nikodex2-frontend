import { json, redirect } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"

export async function GET({ fetch, cookies, url }) {
    try {
        const code = url.searchParams.get("code") ?? ""
        const respones = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: env.DISCORD_BOT_CLIENT_ID,
                client_secret: env.DISCORD_BOT_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                // TODO: not hardcode the redirect hostname
                redirect_uri: url.origin + "/api/discord_auth",
                scope: "identity"
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        const data = await respones.json()
        cookies.set('discord_token', data['access_token'], {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: data['expires_in']
        });
    } catch (error) {
        console.log(error);
        return json({ msg: `${error}` });
    }
    throw redirect(307, "/submit")
}