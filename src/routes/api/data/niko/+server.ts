import { json } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"

export async function GET({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/nikos/?id=${url.searchParams.get('id')}`)
        if (!res.ok) {
            return json({ error: "buh" }, { status: res.status })
        }

        let json_res = await res.json()

        return json(json_res)
    }
    catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}