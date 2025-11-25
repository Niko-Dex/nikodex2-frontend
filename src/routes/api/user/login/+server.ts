import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { errSrv, validateTurnstileToken } from "../../helper";

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const tsToken = request.headers.get("X-Turnstile-Token") ?? ""
    const { success, error } = await validateTurnstileToken(
      tsToken,
      env.TURNSTILE_SECRET_KEY,
    );
    if (!success) {
      return json({
        error: `Unable to verify Captcha. ${error}`,
      }, { status: 400 });
    }

    const { username, password } = await request.json();
    const res = await fetch(`${env.API_SERVER_URL}/token`, {
      method: "POST",
      body: new URLSearchParams({ username, password }),
    });
    if (!res.ok)
      return json({ error: "Invalid username or password!" }, { status: 401 });
    const { access_token } = await res.json();
    cookies.set("token", access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 86400,
    });
    return json({ success: true });
  } catch (err) {
    return errSrv(err);
  }
};
