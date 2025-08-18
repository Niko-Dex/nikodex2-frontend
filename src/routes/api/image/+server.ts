import { json } from '@sveltejs/kit';

import { env } from "$env/dynamic/private"
export async function GET({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/image?id=${url.searchParams.get("id")}`)

        return res
    } catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}

export async function POST({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/image?id=${url.searchParams.get("id")}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
            },
            body: await request.formData()
        })

        return res
    } catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}