import { API_SERVER_URL } from "$env/static/private"
import { json } from "@sveltejs/kit"

export async function POST({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${API_SERVER_URL}/abilities`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
                "Content-Type": "application/json"
            },
            body: await request.text()
        })

        return json(await res.json(), { status: res.status })
    } catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}

export async function PUT({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${API_SERVER_URL}/abilities?id=${url.searchParams.get("id")}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
                "Content-Type": "application/json"
            },
            body: await request.text()
        })

        return json(await res.json(), { status: res.status })
    } catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}

export async function DELETE({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${API_SERVER_URL}/abilities?id=${url.searchParams.get("id")}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
                "Content-Type": "application/json"
            }
        })

        return json(await res.json(), { status: res.status })
    } catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}