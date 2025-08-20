import { json } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"

export async function GET({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/nikos/page?page=${url.searchParams.get('page')}&sort_by=${url.searchParams.get('sort_by')}`)
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
    }
    catch (e) {
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}