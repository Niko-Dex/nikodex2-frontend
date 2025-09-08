import { env } from "$env/dynamic/private"
import { errSrv, resWithErrHandling } from '../../helper';

export async function GET({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/nikos/page?page=${url.searchParams.get('page')}&sort_by=${url.searchParams.get('sort_by')}`)

        return await resWithErrHandling(res)
    }
    catch (e) {
        return errSrv(e)
    }
}