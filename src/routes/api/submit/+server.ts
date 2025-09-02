import { env } from "$env/dynamic/private"
import { errSrv } from '../helper';

export async function POST({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.BOT_SERVER_URL}/upload`, {
            method: 'POST',
            body: await request.formData(),
            headers: {
                authorization: cookies.get("discord_token") ?? ""
            }
        })

        return res
    }
    catch (e) {
        return errSrv(e)
    }
}