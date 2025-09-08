import { json } from '@sveltejs/kit';

import { env } from "$env/dynamic/private"
import { errSrv, resWithErrHandling } from '../../helper';
export async function GET({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.API_SERVER_URL}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`
            }
        })

        if (!res.ok) {
            return json({ error: "Invalid token!" }, { status: 401 })
        }

        return await resWithErrHandling(res)
    } catch (e) {
        return errSrv(e)
    }
}

export async function PUT({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.API_SERVER_URL}/users/me`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
                "Content-Type": "application/json"
            },
            body: await request.text()
        })

        return await resWithErrHandling(res)
    } catch (e) {
        return errSrv(e)
    }
}