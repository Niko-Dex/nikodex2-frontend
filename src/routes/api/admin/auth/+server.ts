import { json } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import { errSrv } from "../../helper";
import jwt from "jsonwebtoken";
export async function POST({ request, fetch, cookies }) {
  const { username, password } = await request.json();
  try {
    const res = await fetch(`${env.API_SERVER_URL}/token`, {
      method: "POST",
      body: new URLSearchParams({ username, password }),
    });

    if (!res.ok) {
      return json({ error: "Invalid username or password" }, { status: 401 });
    }

    const { access_token } = await res.json();
    try {
      const out = jwt.verify(access_token, env.JWT_SECRET);
      if (typeof out != "string") {
        if (!out["admin"]) throw new Error();
      } else {
        throw new Error();
      }
    } catch {
      return json({ error: "Invalid username or password" }, { status: 401 });
    }
    cookies.set("token", access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 30 * 60,
    });
    return json({ success: true });
  } catch (e) {
    return errSrv(e);
  }
}
