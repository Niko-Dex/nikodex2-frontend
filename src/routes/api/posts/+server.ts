import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../helper";

export async function GET({ request, fetch, cookies }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/posts`);
    return await resWithErrHandling(res);
  } catch (e) {
    return errSrv(e);
  }
}

export async function POST({ request, fetch, cookies }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/nikos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: await request.text(),
    });

    return await resWithErrHandling(res);
  } catch (e) {
    return errSrv(e);
  }
}
