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