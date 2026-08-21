import { error, fail, redirect } from '@sveltejs/kit';
import { getVisibleCollection } from '$lib/server/collections';
import type { PageServerLoad, Actions } from './$types';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ locals, url }) => {
    const collectionId = url.searchParams.get('cid');

    if (!collectionId || !uuidPattern.test(collectionId)) {
        throw error(400, 'A valid collection id is required.');
    }

    const collection = await getVisibleCollection(locals.supabase, collectionId);

    if (!collection) throw error(404, 'Collection not found.');

    return collection;
};

export const actions: Actions = {
    deleteItems: async ({ locals, request, url }) => {
        const { user } = await locals.safeGetSession();

        if (!user) {
            return fail(401, { error: 'Sign in to delete items.' });
        }

        const formData = await request.formData();

        const collectionId = String(
            formData.get('cid') ?? url.searchParams.get('cid') ?? ''
        );

        const itemValues = formData.getAll('iid');

        const itemIds = itemValues.filter(
            (value): value is string =>
                typeof value === 'string' && uuidPattern.test(value)
        );

        if (!uuidPattern.test(collectionId) || itemIds.length === 0) {
            return fail(400, {
                error: 'A valid collection and at least one item are required.'
            });
        }

        const { error: deleteError } = await locals.supabase
            .from('items')
            .delete()
            .eq('cid', collectionId)
            .in('id', itemIds);

        if (deleteError) {
            return fail(400, { error: deleteError.message });
        }

        redirect(303, `/collection?cid=${collectionId}`);
    }
};