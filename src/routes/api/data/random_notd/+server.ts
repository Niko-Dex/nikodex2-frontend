import { json } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"
import { addDays, isAfter, startOfDay } from "date-fns"
import { format, toZonedTime } from "date-fns-tz"
import { errSrv } from '../../helper';
import { createHash } from "crypto"
import nodeMID from "node-machine-id"

let cachedData: Object[] = []
const getNextDate = (curday: Date) => {
    const nowUtc = toZonedTime(curday, "UTC")
    return startOfDay(addDays(nowUtc, 1))
}
let nextDate: Date = new Date(0)

export async function GET({ request, fetch, cookies }) {
    let currDate = toZonedTime(new Date(), "UTC")

    try {
        if (isAfter(currDate, nextDate)) {
            const res = await fetch(`${env.API_SERVER_URL}/nikos`)
            if (!res.ok) {
                return json({ error: "buh" }, { status: res.status })
            }
            cachedData = await res.json()
            nextDate = getNextDate(currDate)
        }

        const magic = createHash("sha256")
            .update(await nodeMID.machineId())
            .update(format(currDate, "ddMMyyyy"))
            .digest()

        const idx = magic.reduce((t, c) => (t + c) % cachedData.length)

        return json(cachedData[idx], {
            headers: {
                "Expires": format(nextDate, "EEE, dd MMM yyyy HH:mm:ss 'GMT'", {
                    timeZone: "Etc/GMT"
                })
            }
        })
    }
    catch (e) {
        return errSrv(e)
    }
}