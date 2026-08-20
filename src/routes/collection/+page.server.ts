import { error } from '@sveltejs/kit';
import { getVisibleCollection } from '$lib/server/collections';
import type { PageServerLoad } from './$types';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ locals, url }) => {
    const collectionId = url.searchParams.get('cid');

    if (!collectionId || !uuidPattern.test(collectionId)) {
        throw error(400, 'A valid collection id is required.');
    }

    const collection = await getVisibleCollection(locals.supabase, collectionId);

    if (!collection) {
        throw error(404, 'Collection not found.');
    }

    return collection;
};
