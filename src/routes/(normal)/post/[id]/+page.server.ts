import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  const fetchMessage = await fetch(`/api/posts/id?id=${params.id}`);
  if (!fetchMessage.ok) return error(404, "Post not found");
  return {
    postData: await fetchMessage.json(),
    id: params.id,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const fetchReq = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        content: data.get("comment"),
        post_id: data.get("post_id"),
        username: data.get("username"),
      }),
    });
    const response = await fetchReq.json();
    if (!fetchReq.ok)
      return fail(fetchReq.status, response["error"]);
    else 
      return JSON.stringify(response);
  },
} satisfies Actions;
