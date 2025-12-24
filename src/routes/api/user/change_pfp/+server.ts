import { env } from "$env/dynamic/private";
import { errSrv } from "../../helper";
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({ request, fetch, cookies }) => {
  try {
    const url = new URL(request.url);
    const profileFormData = await request.formData();
    const fetchMessage = await fetch(
      `${env.API_SERVER_URL}/users/profile_picture?user_id=${url.searchParams.get("id")}`,
      {
        method: "PUT",
        body: profileFormData,
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      },
    );
    return fetchMessage;
  } catch (error) {
    return errSrv(error);
  }
};
