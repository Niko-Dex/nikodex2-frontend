import { json } from "@sveltejs/kit";
import { errSrv } from "../../../helper";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";

/**
 * this is a helper function for handling errors within fetching.
 * @param eventFetch the fetcher the current request is using. (event.fetch)
 * @param input the fetch input url
 * @param init the request initialization
 * @returns fetch
 */
async function fetchWithErrHandler(
  eventFetch: {
    (input: URL | RequestInfo, init?: RequestInit): Promise<Response>;
    (
      input: string | URL | globalThis.Request,
      init?: RequestInit,
    ): Promise<Response>;
  },
  input: URL | RequestInfo,
  init?: RequestInit,
) {
  const fetchReturner = await eventFetch(input, init);
  if (!fetchReturner.ok) {
    throw new Error(await fetchReturner.text());
  }
  return fetchReturner;
}

export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
  try {
    const {
      submission_id,
      name,
      description,
      author,
      full_desc,
      author_id,
      is_blacklisted,
    }: {
      submission_id: number;
      name: string;
      description: string;
      author: string;
      full_desc: string;
      author_id: number;
      is_blacklisted: boolean;
      image?: string;
    } = await request.json();
    console.log(is_blacklisted);
    const auth = cookies.get("token");
    if (!auth) throw new Error("unauthorized...");
    // Firstly, create the Noik that we want.
    await fetchWithErrHandler(fetch, `${env.API_SERVER_URL}/nikos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("token") ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
        author: author,
        full_desc: full_desc,
        author_id: author_id,
        is_blacklisted: is_blacklisted,
      }),
    });
    // Then, after the Noik is created, get the most recent Noik of the current user.
    const getLatestNikoOfUser = await fetchWithErrHandler(
      fetch,
      `${env.API_SERVER_URL}/nikos/user/latestid?user_id=${author_id}`,
    );
    const currentIdx = await getLatestNikoOfUser.text();
    // Next, get the submission image that we are trying to upload.
    const submissionImgRequest = await fetchWithErrHandler(
      fetch,
      `/api/data/submissions/img?id=${submission_id}`,
    );
    const submissionImg = await submissionImgRequest.blob();
    const formDataToSend = new FormData();
    formDataToSend.append("file", submissionImg);
    // After appending and getting ready, set the image with this fetch method.
    await fetchWithErrHandler(
      fetch,
      `${env.API_SERVER_URL}/image?id=${currentIdx}`,
      {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      },
    );
    // Finally, delete the submission from the database after we accepted it.
    await fetchWithErrHandler(
      fetch,
      `/api/data/submissions?id=${submission_id}`,
      {
        method: "DELETE",
      },
    );
    // yipee.
    return json({ success: true });
  } catch (err) {
    return errSrv(err);
  }
};
