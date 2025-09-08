import { env } from "$env/dynamic/private"
import { errSrv, resWithErrHandling } from '../../helper';
export async function GET({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.API_SERVER_URL}/nikos/count`)

        return await resWithErrHandling(res)
    } catch (e) {
        return errSrv(e)
    }

}