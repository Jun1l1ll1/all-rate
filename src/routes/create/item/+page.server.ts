import { fail, redirect } from '@sveltejs/kit';
import { formText, optionalText, requiredText } from '$lib/server/validation';
import type { Actions } from './$types';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Sign in to create an item.' });

		const formData = await request.formData();
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
		redirect(303, `/collection?cid=${collectionId}`);
	}
};
