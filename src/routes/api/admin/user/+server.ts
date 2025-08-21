import { json } from '@sveltejs/kit';

import { env } from "$env/dynamic/private"
import { errSrv } from '../../helper';
export async function GET({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.API_SERVER_URL}/users/me`, {
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
        return errSrv(e)
    }

}