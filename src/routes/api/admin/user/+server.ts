import { json } from '@sveltejs/kit';

import { API_SERVER_URL } from "$env/static/private"
export async function GET({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${API_SERVER_URL}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`
            }
        })

        if (!res.ok) {
            console.log(await res.text(), res.status)
            return json({ error: "Invalid token!" }, { status: 401 })
        }

        return json(await res.json())
    } catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server" }, { status: 500 })
    }

}