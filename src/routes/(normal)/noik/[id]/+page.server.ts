import type { PageServerLoad } from './$types';

export const load = (async ({fetch, params}) => {
    const getNoikRequest = await fetch(`/api/data/niko?id=${params.id}`)
    return {
        noikData: await getNoikRequest.json(),
        success: getNoikRequest.ok
    };
}) satisfies PageServerLoad;