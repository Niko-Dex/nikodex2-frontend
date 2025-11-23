import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { resWithErrHandling } from '../../helper';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({fetch, request}) => {
    const {username, password} = await request.json()
    const createAccountFetch = await fetch(`${env.API_SERVER_URL}/users`, 
        {
            method: "POST",
            body: JSON.stringify({
                "new_username": username,
                "new_password": password,
                "new_description": "cool description"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
    return resWithErrHandling(createAccountFetch)
};