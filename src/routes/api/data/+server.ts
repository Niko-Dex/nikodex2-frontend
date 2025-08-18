import { json } from '@sveltejs/kit';

import { API_SERVER_URL } from "$env/static/private"
export async function GET({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${API_SERVER_URL}/nikos`)

        if (!res.ok) {
            return json({ error: "buh" }, { status: res.status })
        }

        let json_res = await res.json().then(r => {
            for (const element of r) {
                const new_img = `/api/image?id=${element["id"]}`
                element["full_img_path"] = new_img
            }
            return r
        })

        return json(json_res)
    } catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }

}

export async function POST({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${API_SERVER_URL}/nikos`, {
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
        const res = await fetch(`${API_SERVER_URL}/nikos?id=${url.searchParams.get("id")}`, {
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
        const res = await fetch(`${API_SERVER_URL}/nikos?id=${url.searchParams.get("id")}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
            }
        })

        return json(await res.json(), { status: res.status })
    } catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}