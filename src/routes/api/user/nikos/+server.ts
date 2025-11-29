import { env } from "$env/dynamic/private";
import { errSrv } from "../../helper";

export async function GET({ request, fetch, cookies }) {
  try {
    const url = new URL(request.url);
    const res = await fetch(
      `${env.API_SERVER_URL}/nikos/user?id=${url.searchParams.get("id")}`,
    );

    return res;
  } catch (e) {
    return errSrv(e);
  }
}
