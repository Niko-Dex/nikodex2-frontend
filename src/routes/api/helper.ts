import { json } from "@sveltejs/kit";

export function errSrv(e: unknown) {
    console.log(e)
    if (e instanceof Error) {
        return json({ error: `Cannot connect or problem while connecting to API server! ${e.message}` }, { status: 500 })
    } else {
        return json({ error: `Cannot connect or problem while connecting to API server!` }, { status: 500 })
    }
}

export async function resWithErrHandling(res: Response) {
    const res2 = res.clone()
    if (res2.ok) return res
    else {
        return json({ error: (await res2.json())["detail"] }, { status: res2.status })
    }
}

interface TokenValidateResponse {
    "error-codes": string[];
    success: boolean;
    action: string;
    cdata: string;
}

export async function validateTurnstileToken(token: string, secret: string) {
    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                response: token,
                secret: secret,
            }),
        },
    );

    const data: TokenValidateResponse = await response.json();

    return {
        success: data.success,
        error: data["error-codes"]?.length ? data["error-codes"][0] : null,
    };
}