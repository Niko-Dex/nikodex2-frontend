import { json } from '@sveltejs/kit';
import { env } from "$env/dynamic/private"
import { addDays, isAfter, startOfDay } from "date-fns"
import { format, toZonedTime } from "date-fns-tz"
import { errSrv } from '../../helper';
import { createHash } from "crypto"
import nodeMID from "node-machine-id"

function modExp(base: number, exp: number, mod: number) {
    if (mod == 1) return 0
    let out = 1
    base %= mod

    while (exp > 0) {
        if (exp % 2 == 1) {
            out = ((out % mod) * (base % mod)) % mod
        }
        base = ((base % mod) * (base % mod)) % mod
        exp >>= 1
    }

    return out
}

let cachedData: Object[] = []
const getNextDate = (curday: Date) => {
    const nowUtc = toZonedTime(curday, "UTC")
    return startOfDay(addDays(nowUtc, 1))
}
let nextDate: Date = new Date(0)
let cachedIdx: number | null = null

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
            cachedIdx = null
        }

        if (cachedIdx == null) {
            const magic = createHash("sha256")
                .update(await nodeMID.machineId())
                .update(format(currDate, "ddMMyyyy"))
                .digest()

            cachedIdx = magic.reduce((t, c, w) => ((t % cachedData.length) * modExp(c, w, cachedData.length)) % cachedData.length)
        }

        return json(cachedData[cachedIdx], {
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