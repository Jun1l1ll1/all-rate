import { fail, error, redirect } from '@sveltejs/kit';
import { getCollection } from '$lib/server/collections';
import { requiredText, optionalText, formText } from '$lib/server/validation';
import type { PageServerLoad, Actions } from './$types';
import { uuidPattern } from '$lib/scripts/variables';

export const load: PageServerLoad = async ({ locals, url }) => {

    const collectionId = url.searchParams.get('cid');

    if (collectionId && !uuidPattern.test(collectionId)) {
        throw error(400, 'The given collection id is invalid.');
    }

    const collection = collectionId ? await getCollection(locals.supabase, collectionId) : null;
    if (collectionId && !collection) throw error(404, 'Collection not found.');

    return { collection: collection };
};

export const actions: Actions = {
    default: async ({ locals, request, url }) => {
        const { user } = await locals.safeGetSession();
        if (!user) return fail(401, { error: 'Sign in to update a collection.' });

        const formData = await request.formData();
		const redirectPath = url.searchParams.get('from') || '/';
		const updateCollectionId = formText(formData.get('cid')) || url.searchParams.get('cid') || '';
        const titleError = requiredText(formData.get('title'), 'Title', 120);
        const descriptionError = optionalText(formData.get('description'), 2000);

        if (titleError || descriptionError) {
            return fail(400, { error: titleError ?? descriptionError ?? 'Invalid form.' });
        }

        if (updateCollectionId) {
            const { error } = await locals.supabase
                .from('collections')
                .update({
                    title: formText(formData.get('title')),
                    description: formText(formData.get('description')) || null,
                    is_public: formData.get('is_private') !== 'on',
                    collection_color: formText(formData.get('color'))
                })
                .eq('id', updateCollectionId)
                .single();
    
            if (error) return fail(400, { error: error.message });
        } else {
            const { error } = await locals.supabase
                .from('collections')
                .insert({
                    owner_id: user.id,
                    title: formText(formData.get('title')),
                    description: formText(formData.get('description')) || null,
                    is_public: formData.get('is_private') !== 'on',
                    collection_color: formText(formData.get('color'))
                })
                .select('id')
                .single();
    
            if (error) return fail(400, { error: error.message });
        }
        redirect(303, redirectPath);
    }
};
