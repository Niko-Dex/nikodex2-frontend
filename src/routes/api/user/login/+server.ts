import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { errSrv } from "../../helper";

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();
    const res = await fetch(`${env.API_SERVER_URL}/token`, {
      method: "POST",
      body: new URLSearchParams({ username, password }),
    });
    if (!res.ok)
      return json({ error: "invalid username or password!" }, { status: 401 });
    const { access_token } = await res.json();
    cookies.set("token", access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 30 * 60,
    });
    return json({ success: true });
  } catch (err) {
    return errSrv(err);
  }
};
