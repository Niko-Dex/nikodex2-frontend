import { env } from "$env/dynamic/private";
import { errSrv } from "../../../helper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const fetchMessage = await fetch(
      `${env.API_SERVER_URL}/comments/user_id?user_id=${url.searchParams.get("user_id")}`,
    );
    return fetchMessage;
  } catch (err) {
    return errSrv(err);
  }
};
