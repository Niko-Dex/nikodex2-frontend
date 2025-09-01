import { goto } from '$app/navigation';
import { json, redirect } from '@sveltejs/kit';

export async function GET({ request, fetch, cookies }) {
    try {
        console.log(request.url);
        console.log(window.location);
        const url = new URL(request.url);
        //const fragment = new URLSearchParams(url.hash.slice(1));
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];
        console.log(accessToken);
        return json({ msg: `Success.` });
    } catch (error) {
        console.log(error);
        return json({ msg: `${error}` });
    }
}

export async function POST({ request, fetch, cookies }) {
    try {
        const reqJson = await request.json();
        console.log(reqJson);
        cookies.set('discord_token', reqJson['access_token'], {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 30 * 60
        });

        const disc = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${reqJson['access_token']}`
            }
        })
        const discJson = await disc.json();

        return json({ username: discJson['username'] })
    } catch (error) {
        console.log(error);
        return json({ msg: `${error}` });
    }
}