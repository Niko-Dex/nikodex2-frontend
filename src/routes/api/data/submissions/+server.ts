import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../../helper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, fetch, cookies }) => {
  try {
    const submissionReq = await fetch(`${env.API_SERVER_URL}/submissions`);

    return await resWithErrHandling(submissionReq);
  } catch (err) {
    return errSrv(err);
  }
};
