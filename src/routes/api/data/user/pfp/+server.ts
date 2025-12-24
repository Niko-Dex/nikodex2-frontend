import { env } from "$env/dynamic/private";
import { errSrv } from "../../../helper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, fetch }) => {
  try {
    const url = new URL(request.url);
    const fetchRequest = await fetch(
      `${env.API_SERVER_URL}/users/profile_picture?id=${url.searchParams.get(
        "id",
      )}`,
      {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
        },
      },
    );
    return fetchRequest;
  } catch (err) {
    return errSrv(err);
  }
};
