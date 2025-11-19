import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../../../helper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, fetch, cookies }) => {
  try {
    const url = new URL(request.url);
    const submissionReq = await fetch(
      `${env.API_SERVER_URL}/submissions/image?id=${url.searchParams.get("id")}`
    );

    return await resWithErrHandling(submissionReq);
  } catch (err) {
    return errSrv(err);
  }
};
