import { env } from "$env/dynamic/private"
import { errSrv } from "../helper"

export async function GET() {
    try {
        const begin = performance.now()
        await fetch(`${env.API_SERVER_URL}/ping`)
        const end = performance.now()
        return new Response((end - begin).toString())
    } catch (e) {
        return errSrv(e)
    }
}