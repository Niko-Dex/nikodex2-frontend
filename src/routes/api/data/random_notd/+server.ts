import { json } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"
import { addDays, getDay, isAfter, startOfDay, type Day } from "date-fns"
import { format, toZonedTime } from "date-fns-tz"

let cachedData: Object | null = null
const getNextDate = (curday: Date) => {
    const nowUtc = toZonedTime(curday, "UTC")
    return startOfDay(addDays(nowUtc, 1))
}
let nextDate: Date = new Date(0)

export async function GET({ request, fetch, cookies }) {
    let currDate = new Date()
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
        return json({ error: "Cannot connect or problem while connecting to API server!" }, { status: 500 })
    }
}