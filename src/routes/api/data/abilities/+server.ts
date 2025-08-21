import { env } from "$env/dynamic/private"
import { json } from "@sveltejs/kit"
import { errSrv } from "../../helper.js"


export async function POST({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.API_SERVER_URL}/abilities`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
                "Content-Type": "application/json"
            },
            body: await request.text()
        })

        return res
    } catch (e) {
        return errSrv(e)
    }
}

export async function PUT({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/abilities?id=${url.searchParams.get("id")}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
                "Content-Type": "application/json"
            },
            body: await request.text()
        })

        return res
    } catch (e) {
        return errSrv(e)
    }
}

export async function DELETE({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/abilities?id=${url.searchParams.get("id")}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${cookies.get("token")}`,
                "Content-Type": "application/json"
            }
        })

        return res
    } catch (e) {
        return errSrv(e)
    }
}