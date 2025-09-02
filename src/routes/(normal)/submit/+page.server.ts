import { redirect } from '@sveltejs/kit'

async function fetchDiscordUser(discord_token: string) {
    const disc = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `Bearer ${discord_token}`
        }
    })

    if (disc.ok) {
        return await disc.json()
    } else {
        return null
    }
}

export async function load({ cookies }) {
    let discord_token = cookies.get('discord_token') ?? ""
    const user = await fetchDiscordUser(discord_token)

    let authenticated = false
    let discord_username = ""
    let discord_id = ""
    if (user) {
        authenticated = true
        discord_username = user["username"]
        discord_id = user["id"]
    }

    return {
        authenticated,
        discord_username,
        discord_id
    }
}