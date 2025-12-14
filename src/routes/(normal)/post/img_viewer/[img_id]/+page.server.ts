import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    return {
        imageLink: `/api/posts/image?id=${params.img_id}`
    };
}) satisfies PageServerLoad;