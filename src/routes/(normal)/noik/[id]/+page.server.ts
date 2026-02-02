import { env } from "$env/dynamic/private";
import type { Niko } from "$lib/types/nikosona";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  const getNoikRequest = await fetch(`/api/data/niko?id=${params.id}`);
  return {
    origin: env.ORIGIN,
    noikData: (await getNoikRequest.json()) as Niko,
    success: getNoikRequest.ok,
  };
}) satisfies PageServerLoad;
