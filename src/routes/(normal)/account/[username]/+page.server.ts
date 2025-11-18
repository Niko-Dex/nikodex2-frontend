import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  const fetchMessage = await fetch(
    `/api/data/user?username=${params.username}`
  );
  return {
    isOk: fetchMessage.ok,
    requestedInformation: await fetchMessage.json(),
  };
}) satisfies PageServerLoad;
