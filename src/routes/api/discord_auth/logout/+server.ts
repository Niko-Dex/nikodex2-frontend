import { json, redirect } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"

export async function POST({ fetch, cookies, url }) {
    try {
        cookies.delete('discord_token', {
            httpOnly: true,
            secure: true,
            path: "/"
        });

        return json({ msg: 'ok' }, { status: 200 })
    }
    catch(error) {
        console.error(error);
        return json({ msg: `${error}` }, { status: 500 })
    }
}