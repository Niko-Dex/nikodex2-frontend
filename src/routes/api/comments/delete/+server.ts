import { env } from "$env/dynamic/private";
import { errSrv } from "../../helper";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ request, fetch, cookies }) => {
  try {
    const url = new URL(request.url);

    const formData = new FormData();
    const id = url.searchParams.get("id");

    formData.append("title", "A Comment was deleted!");
    formData.append("msg", `Comment was deleted!`);
    formData.append("fields[n]", "1");
    formData.append("fields[0]", `ID;${id}`);

    const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
      method: "POST",
      body: formData,
    });

    if (!b_res.ok) {
      console.log(
        `Error while trying to audit the action.. ${await b_res.text()}`,
      );
    }
    const fetchMessage = await fetch(
      `${env.API_SERVER_URL}/comments?comment_id=${id}`,
      {
        method: "DELETE",
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
