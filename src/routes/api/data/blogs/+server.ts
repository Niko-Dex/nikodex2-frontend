import { env } from "$env/dynamic/private"
import { errSrv, resWithErrHandling } from '../../helper';

export async function GET({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.API_SERVER_URL}/blogs`)
        return await resWithErrHandling(res)
    }
    catch (e) {
        return errSrv(e)
    }
}

export async function POST({ request, fetch, cookies }) {
    try {
        const res = await fetch(`${env.API_SERVER_URL}/blogs`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${cookies.get('token')}`,
                "Content-Type": "application/json"
            },
            body: await request.text()
        })

        return await resWithErrHandling(res)
    }
    catch (e) {
        return errSrv(e)
    }
}

export async function PUT({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/blogs?id=${url.searchParams.get('id')}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${cookies.get('token')}`,
                'Content-Type': 'application/json'
            },
            body: await request.text()
        })

        return await resWithErrHandling(res)
    }
    catch (e) {
        return errSrv(e)
    }
}

export async function DELETE({ request, fetch, cookies }) {
    try {
        const url = new URL(request.url)
        const res = await fetch(`${env.API_SERVER_URL}/blogs?id=${url.searchParams.get('id')}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${cookies.get('token')}`,
                'Content-Type': 'application/json'
            },
            body: await request.text()
        })

        return await resWithErrHandling(res)
    }
    catch (e) {
        return errSrv(e)
    }
}