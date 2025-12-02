import { env } from "$env/dynamic/private";
import { errSrv } from "../../helper";

export async function GET({ fetch }) {
  try {
    const res = await fetch(`${env.API_SERVER_URL}/posts/count`);
    return res;
  } catch (e) {
    return errSrv(e);
  }
}
