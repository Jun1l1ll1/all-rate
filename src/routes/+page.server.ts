import { listUserCollections } from '$lib/server/collections';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
        return { user: null, collections: [], favorites: [] };
    }

    const { collections, favorites } = await listUserCollections(locals.supabase, user);

    return { user: { id: user.id, email: user.email ?? null }, collections, favorites };
};
