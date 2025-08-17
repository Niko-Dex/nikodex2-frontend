import type { ServerLoadEvent } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "$env/static/private"

export const load = (event: ServerLoadEvent) => {
    if (event.url.pathname.startsWith("/admin/login")) return
    const token = event.cookies.get("token") ?? ""

    try {
        jwt.verify(token, JWT_SECRET ?? "")
    } catch (e) {
        redirect(302, `/admin/login`)
    }
}