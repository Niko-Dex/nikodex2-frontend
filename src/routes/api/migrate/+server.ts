import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../helper";

export async function POST({ request, fetch, cookies }) {
  try {
    const res = await fetch(`${env.BOT_SERVER_URL}/req_migrate`, {
      method: "POST",
      body: await request.formData(),
      headers: {
        authorization: cookies.get("discord_token") ?? "",
      },
    });

    return await resWithErrHandling(res);
  } catch (e) {
    return errSrv(e);
  }
}
