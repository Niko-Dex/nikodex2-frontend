import { env } from "$env/dynamic/private";
import { errSrv } from "../../helper";

export async function GET({ request, fetch, cookies }) {
  try {
    const url = new URL(request.url);
    const res = await fetch(
      `${env.API_SERVER_URL}/posts/user/?user_id=${url.searchParams.get("user_id")}`,
    );
    return res;
  } catch (e) {
    return errSrv(e);
  }
}
