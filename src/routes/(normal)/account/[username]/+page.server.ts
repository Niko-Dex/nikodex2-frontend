import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  const fetchMessage = await fetch(
    `/api/data/user?username=${params.username}`
  );
  if (!fetchMessage.ok)
    return error(404, "User not found")
  return {
    requestedInformation: await fetchMessage.json(),
  };
}) satisfies PageServerLoad;
