import { redirect } from '@sveltejs/kit'

export function load({ cookies }) {
    let discord_token = cookies.get('discord_token');

    return {
        discord_token: discord_token
    }
}