import { env } from "$env/dynamic/private";
import { errSrv } from "../helper";

export async function GET({ fetch }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/banner`);
    return res;
  } catch (e) {
    return errSrv(e);
  }
}

export async function POST({ request, fetch, cookies }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/banner`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: await request.text(),
    });

    return res;
  } catch (e) {
    return errSrv(e);
  }
}
