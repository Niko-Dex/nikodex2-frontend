import { env } from "$env/dynamic/private"
import { json } from "@sveltejs/kit";
import { errSrv } from '../helper';
import { WEBHOOK_URL } from "$env/static/private";

export async function POST({ request, fetch, cookies }) {
    try {
        const reqJson = await request.json()
        const res = await fetch(`${WEBHOOK_URL}`, {
            method: 'POST',
            body: JSON.stringify({
                content: `**Submission is made!**\n
Name: ${reqJson.name}\n
Author: ${reqJson.author}\n
Description: ${reqJson.description}\n
Full description: ${reqJson.full_desc}`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return json({msg: "Attempt is made."})
    }
    catch (e) {
        return errSrv(e)
    }
}