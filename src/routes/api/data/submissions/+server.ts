import { env } from "$env/dynamic/private";
import { errSrv } from "../../helper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, fetch, cookies }) => {
  try {
    const submissionReq = await fetch(`${env.API_SERVER_URL}/submissions`);

    return submissionReq;
  } catch (err) {
    return errSrv(err);
  }
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
  try {
    const currentUrl = new URL(request.url);
    const deleteSubmissionReq = await fetch(
      `${env.API_SERVER_URL}/submissions?id=${currentUrl.searchParams.get(
        "id"
      )}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.get("token") ?? ""}`,
        },
      }
    );
    return deleteSubmissionReq;
  } catch (err) {
    return errSrv(err);
  }
};
