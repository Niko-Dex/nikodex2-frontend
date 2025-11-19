import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../../../helper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, fetch }) => {
  try {
    const urlCurrent = new URL(request.url);
    const fetchRequest = await fetch(
      `${
        env.API_SERVER_URL
      }/submissions/user?user_id=${urlCurrent.searchParams.get("userid")}`
    );
    return await resWithErrHandling(fetchRequest);
  } catch (err) {
    return errSrv(err);
  }
};
