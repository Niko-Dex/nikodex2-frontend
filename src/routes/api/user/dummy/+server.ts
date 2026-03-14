import { env } from "$env/dynamic/private";
import { randomUUID } from "crypto";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ fetch, request, cookies }) => {
    const { username } = await request.json();
    const createAccountFetch = await fetch(`${env.API_SERVER_URL}/users/dummy`, {
        method: "POST",
        body: JSON.stringify({
            new_username: username,
            new_password: randomUUID(),
            new_description:
                "This is a dummy account only used to give Nikosonas a name, and was created by an admin of the Nikodex.",
        }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("token")}`,
        },
    });
    return createAccountFetch;
};
