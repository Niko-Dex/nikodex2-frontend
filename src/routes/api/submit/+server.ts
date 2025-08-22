import { env } from "$env/dynamic/private"
import { json } from "@sveltejs/kit";
import { errSrv } from '../helper';

export async function POST({ request, fetch, cookies }) {
    try {
        const reqForm = await request.formData()
        console.log(reqForm.get("name"))

        const fields = [
                    {
                        name: "Name",
                        value: reqForm.get("name")
                    },
                    {
                        name: "Author",
                        value: reqForm.get("author")
                    },
                    {
                        name: "Description",
                        value: reqForm.get("description")
                    },
                    {
                        name: "Full desc",
                        value: reqForm.get("full_desc")
                    }
                ]
        let abilitiesArr = reqForm.get("abilities")?.toString().split("|||")
        if (abilitiesArr) {
            for (const element of abilitiesArr) {
                fields.push({
                    name: "Ability",
                    value: element
                })
            }
        }

        const content = JSON.stringify({
            embeds: [{
                title: "New Submission!",
                fields: fields
            }]
        })
        const form = new FormData()
        form.append("payload_json", content)
        form.append("files[0]", reqForm.get("files[0]") as Blob)

        const options = {
            method: 'POST',
            body: form
        }

        const res = await fetch(`${env.WEBHOOK_URL}`, options)

        if (res.status > 299) throw Error(await res.text())

        return json({msg: "Attempt is made."})
    }
    catch (e) {
        return errSrv(e)
    }
}