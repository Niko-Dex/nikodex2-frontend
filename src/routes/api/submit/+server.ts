import { env } from "$env/dynamic/private"
import { json } from "@sveltejs/kit";
import { errSrv } from '../helper';
import { WEBHOOK_URL } from "$env/static/private";

export async function POST({ request, fetch, cookies }) {
    try {
        const reqJson = await request.json()
        const content = JSON.stringify({
            embeds: [{
                title: "New Submission!",
                fields: [
                    {
                        name: "Name",
                        value: reqJson.name
                    },
                    {
                        name: "Author",
                        value: reqJson.author
                    },
                    {
                        name: "Description",
                        value: reqJson.description
                    },
                    {
                        name: "Full desc",
                        value: reqJson.full_desc
                    }
                ]
            }]
        })
        const form = new FormData()
        form.append("content", content)

        const options = {
            method: 'POST',
            body: content,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await fetch(`${WEBHOOK_URL}`, options)

        if (res.status > 299) throw Error(await res.text())

        return json({msg: "Attempt is made."})
    }
    catch (e) {
        return errSrv(e)
    }
}