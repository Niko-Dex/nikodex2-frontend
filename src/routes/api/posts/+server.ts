import { env } from "$env/dynamic/private";
import { errSrv } from "../helper";

export async function GET({ request, fetch, cookies }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/posts`);
    return res;
  } catch (e) {
    return errSrv(e);
  }
}

export async function POST({ request, fetch, cookies }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
      body: await request.formData(),
    });

    return res;
  } catch (e) {
    return errSrv(e);
  }
}
