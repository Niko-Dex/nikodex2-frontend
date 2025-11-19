import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../../../helper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const fetchRequest = await fetch(
      `${env.API_SERVER_URL}/users/?id=${url.searchParams.get("id")}`
    );
    return await resWithErrHandling(fetchRequest);
  } catch (err) {
    return errSrv(err);
  }
};
