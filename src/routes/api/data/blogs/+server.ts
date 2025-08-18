import { json } from '@sveltejs/kit';

import { API_SERVER_URL } from "$env/static/private"

export async function GET({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${API_SERVER_URL}/blogs`)

        if (!res.ok) {
            return json({ error: "buh" }, { status: res.status })
        }

        return json(await res.json())
    }
    catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}