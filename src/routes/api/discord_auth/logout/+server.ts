import { json, redirect } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"
import { errSrv } from '../../helper.js';

export async function GET({ fetch, cookies, url }) {
    try {
        const token = cookies.get('discord_token') ?? ""

        await fetch("https://discord.com/api/oauth2/token/revoke", {
            method: "POST",
            body: new URLSearchParams({
                client_id: env.DISCORD_BOT_CLIENT_ID,
                client_secret: env.DISCORD_BOT_CLIENT_SECRET,
                token,
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        cookies.delete('discord_token', {
            httpOnly: true,
            secure: true,
            path: "/"
        });
    }
    catch(error) {
        console.error(error);
        return errSrv(error)
    }
    throw redirect(307, "/account/migrate")
}