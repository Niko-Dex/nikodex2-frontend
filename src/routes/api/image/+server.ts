import { env } from "$env/dynamic/private"
import type { Cookies } from "@sveltejs/kit";
import { errSrv } from '../helper';
export async function GET({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/image?id=${url.searchParams.get("id")}`)

        return res
    } catch (e) {
        return errSrv(e)
    }
}

async function imageWrapper(method: string, fetch: {
    (input: URL | RequestInfo, init?: RequestInit): Promise<Response>;
    (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
}, request: Request, cookies: Cookies) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/image?id=${url.searchParams.get("id")}`, {
            method: method,
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
            },
            body: await request.formData()
        })

        return res
    } catch (e) {
        return errSrv(e)
    }
}

export async function PUT({ request, fetch, cookies }) {
    return await imageWrapper("PUT", fetch, request, cookies);
}

export async function POST({ request, fetch, cookies }) {
    return await imageWrapper("POST", fetch, request, cookies);
}