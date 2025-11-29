import { env } from "$env/dynamic/private";
import { errSrv, resWithErrHandling } from "../../helper";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ request, fetch, cookies }) => {
  try {
    const url = new URL(request.url);
    const fetchMessage = await fetch(
      `${env.API_SERVER_URL}/users?id=${url.searchParams.get("id")}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      },
    );
    return await resWithErrHandling(fetchMessage);
  } catch (error) {
    return errSrv(error);
  }
};
