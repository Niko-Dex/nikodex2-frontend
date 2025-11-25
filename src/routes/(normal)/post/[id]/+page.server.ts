import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  const fetchMessage = await fetch(`/api/posts/id?id=${params.id}`);
  if (!fetchMessage.ok) return error(404, "Post not found");
  return {
    postData: await fetchMessage.json(),
  };
}) satisfies PageServerLoad;
