import { json } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"
import { addDays, isAfter, startOfDay } from "date-fns"
import { format, toZonedTime } from "date-fns-tz"
import { errSrv, resWithErrHandling } from '../../helper';
import { createHash } from "crypto"
import nodeMID from "node-machine-id"

export async function GET({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/nikos/notd`)

        return await resWithErrHandling(res)
    }
    catch (e) {
        return errSrv(e)
    }
}