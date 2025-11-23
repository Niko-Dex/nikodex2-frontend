import { json, redirect } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"
import { errSrv } from '../helper.js';

export async function GET({ fetch, cookies, url }) {
    block: try {
        const code = url.searchParams.get("code")
        if (!code) {
            break block
        }
        const response = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: env.DISCORD_BOT_CLIENT_ID,
                client_secret: env.DISCORD_BOT_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: new URL("/api/discord_auth", url.origin).href,
                scope: "identify"
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        if (!response.ok) {
            return json({ msg: `Invalid code!` }, {
                status: 401
            });
        }

        const data = await response.json()
        cookies.set('discord_token', data['access_token'], {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: data['expires_in']
        });
    } catch (error) {
        console.log(error);
        return errSrv(error)
    }
    throw redirect(307, "/account/migrate")
}