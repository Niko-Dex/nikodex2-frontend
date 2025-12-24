import { env } from "$env/dynamic/private";
import { errSrv } from "../helper";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const json_request = await request.json();

    const formData = new FormData();
    formData.append("title", "A Comment was made!");
    formData.append("msg", `On Post: ${json_request.post_id}`);
    formData.append("fields[n]", "2");
    formData.append("fields[0]", `Content;${json_request.content}`);
    formData.append("fields[1]", `User;${json_request.username}`);

    const b_res = await fetch(`${env.BOT_SERVER_URL}/audit`, {
      method: "POST",
      body: formData,
    });

    if (!b_res.ok) {
      console.log(
        `Error while trying to audit the action.. ${await b_res.text()}`,
      );
    }

    const postReq = await fetch(`${env.API_SERVER_URL}/comments`, {
      method: "POST",
      body: JSON.stringify(json_request),
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });
    return postReq;
  } catch (err) {
    return errSrv(err);
  }
};
