import { json } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"
import { addDays, isAfter, startOfDay } from "date-fns"
import { format, toZonedTime } from "date-fns-tz"
import { errSrv } from '../../helper';

let cachedData: Object | null = null
const getNextDate = (curday: Date) => {
    const nowUtc = toZonedTime(curday, "UTC")
    return startOfDay(addDays(nowUtc, 1))
}
let nextDate: Date = new Date(0)

export async function GET({ request, fetch, cookies }) {
    let currDate = toZonedTime(new Date(), "UTC")
    try {
        if (isAfter(currDate, nextDate)) {
            const res = await fetch(`${env.API_SERVER_URL}/nikos/random`)
            if (!res.ok) {
                return json({ error: "buh" }, { status: res.status })
            }
            cachedData = await res.json()
            nextDate = getNextDate(currDate)
        }
        return json(cachedData, {
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