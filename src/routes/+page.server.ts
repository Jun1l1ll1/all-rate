import { fail, redirect } from '@sveltejs/kit';
import { listUserCollections } from '$lib/server/collections';
import type { PageServerLoad, Actions } from './$types';
import { uuidPattern } from '$lib/scripts/variables';

export const load: PageServerLoad = async ({ locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
        return { user: null, collections: [], favorites: [] };
    }

    const { collections, favorites } = await listUserCollections(locals.supabase, user);

    return { user: { id: user.id, email: user.email ?? null }, collections, favorites };
};

export const actions: Actions = {
    deleteCollections: async ({ locals, request }) => {
        const { user } = await locals.safeGetSession();

        if (!user) return fail(401, { error: 'Sign in to delete collections.' });

        const formData = await request.formData();

        const collectionValues = formData.getAll('cid');

        const collectionIds = collectionValues.filter(
            (value): value is string =>
                typeof value === 'string' && uuidPattern.test(value)
        );

        if (collectionIds.length === 0) {
            return fail(400, { error: 'At least one collection is required.' });
        }

        const { error: itemDeleteError } = await locals.supabase
            .from('items')
            .delete()
            .in('cid', collectionIds);
            
        const { error: collectionDeleteError } = await locals.supabase
            .from('collections')
            .delete()
            .in('id', collectionIds);

        if (itemDeleteError || collectionDeleteError) {
            return fail(400, { error: itemDeleteError?.message || collectionDeleteError?.message });
        }

        redirect(303, `/`);
    },

    favoriteCollections: async ({ locals, request }) => {
        const { user } = await locals.safeGetSession();

        if (!user) return fail(401, { error: 'Sign in to favorite collections.' });

        const formData = await request.formData();

        const collectionValues = formData.getAll('cid');

        const collectionIds = collectionValues.filter(
            (value): value is string =>
                typeof value === 'string' && uuidPattern.test(value)
        );

        if (collectionIds.length === 0) {
            return fail(400, { error: 'At least one collection is required.' });
        }

        const { error: upsertError } = await locals.supabase
            .from('collection_favorites')
            .upsert(collectionIds.map((cid) => ({
                user_id: user.id,
                cid: cid
            })),
            {
                onConflict: 'user_id,cid',
                ignoreDuplicates: true
            }
        );

        if (upsertError) {
            return fail(400, { error: upsertError.message });
        }

        redirect(303, `/`);
    },
    unFavoriteCollections: async ({ locals, request }) => {
        const { user } = await locals.safeGetSession();

        if (!user) return fail(401, { error: 'Sign in to favorite collections.' });

        const formData = await request.formData();

        const collectionValues = formData.getAll('cid');

        const collectionIds = collectionValues.filter(
            (value): value is string =>
                typeof value === 'string' && uuidPattern.test(value)
        );

        if (collectionIds.length === 0) {
            return fail(400, { error: 'At least one collection is required.' });
        }

        const { error: deleteError } = await locals.supabase
            .from('collection_favorites')
            .delete()
            .in('cid', collectionIds);

        if (deleteError) {
            return fail(400, { error: deleteError.message });
        }

        redirect(303, `/`);
    }
};