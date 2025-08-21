import { json, text } from '@sveltejs/kit';

import { env } from "$env/dynamic/private"
import { errSrv } from '../../helper';
export async function GET({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.API_SERVER_URL}/nikos/count`)

        return res
    } catch (e) {
        return errSrv(e)
    }

}