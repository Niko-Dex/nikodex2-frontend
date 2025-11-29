import { env } from "$env/dynamic/private";
import { errSrv } from "../../../helper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const fetchRequest = await fetch(`${env.API_SERVER_URL}/users/count`);
    return fetchRequest;
  } catch (err) {
    return errSrv(err);
  }
};
