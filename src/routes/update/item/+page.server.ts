import { fail, error, redirect } from '@sveltejs/kit';
import { getItem } from '$lib/server/items';
import { formText, optionalText, requiredText } from '$lib/server/validation';
import type { PageServerLoad, Actions } from './$types';
import { uuidPattern } from '$lib/scripts/variables';

export const load: PageServerLoad = async ({ locals, url }) => {

	const collectionId = url.searchParams.get('cid');
	const itemId = url.searchParams.get('iid');

	if (!collectionId || !uuidPattern.test(collectionId)) {
		throw error(400, 'A valid collection id is required.');
	}

	if (itemId && !uuidPattern.test(itemId)) {
		throw error(400, 'The given item id is invalid.');
	}

	const item = itemId ? await getItem(locals.supabase, itemId) : null;
	if (itemId && !item) throw error(404, 'Item not found.');

	return { cid: collectionId, item: item };
};

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Sign in to update an item.' });

		const formData = await request.formData();
		const redirectPath = url.searchParams.get('from') || '/';
		const updateItemId = formText(formData.get('iid')) || url.searchParams.get('iid') || '';
		const collectionId = formText(formData.get('cid')) || url.searchParams.get('cid') || '';
		const titleError = requiredText(formData.get('title'), 'Title', 200);
		const commentError = optionalText(formData.get('comment'), 5000);
		const ratingValue = formText(formData.get('rating'));
		const rating = Number(ratingValue);
		const ratingError =
			!ratingValue ||
			!Number.isFinite(rating) ||
			rating < 0 ||
			rating > 10 ||
			!/^\d+(\.\d)?$/.test(ratingValue)
				? 'Rating must be a number from 0 to 10 with at most one decimal place.'
				: null;

		if (!uuidPattern.test(collectionId) || titleError || commentError || ratingError) {
			return fail(400, {
				error: titleError ?? commentError ?? ratingError ?? 'Invalid collection id.'
			});
		}

        if (updateItemId) {
            const { error } = await locals.supabase
                .from('items')
                .update({
					title: formText(formData.get('title')),
					rating,
					comment: formText(formData.get('comment')) || null
                })
                .eq('id', updateItemId)
                .single();
    
            if (error) return fail(400, { error: error.message });
        } else {
			const { data: lastItem, error: lastItemError } = await locals.supabase
				.from('items')
				.select('position')
				.eq('cid', collectionId)
				.order('position', { ascending: false })
				.limit(1)
				.maybeSingle();

			if (lastItemError) return fail(400, { error: lastItemError.message });

			const { error } = await locals.supabase.from('items').insert({
				cid: collectionId,
				title: formText(formData.get('title')),
				rating,
				comment: formText(formData.get('comment')) || null,
				position: (lastItem?.position ?? -1) + 1
			});

			if (error) return fail(400, { error: error.message });
		}

		redirect(303, redirectPath);
	}
};
