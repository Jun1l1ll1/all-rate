import { fail, redirect } from '@sveltejs/kit';
import { requiredText, optionalText, formText } from '$lib/server/validation';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const { user } = await locals.safeGetSession();
        if (!user) return fail(401, { error: 'Sign in to create a collection.' });

        const formData = await request.formData();
        const titleError = requiredText(formData.get('title'), 'Title', 120);
        const descriptionError = optionalText(formData.get('description'), 2000);

        if (titleError || descriptionError) {
            return fail(400, { error: titleError ?? descriptionError ?? 'Invalid form.' });
        }

        const { data, error } = await locals.supabase
            .from('collections')
            .insert({
                owner_id: user.id,
                title: formText(formData.get('title')),
                description: formText(formData.get('description')) || null,
                is_public: formData.get('is_public') === 'on'
            })
            .select('id')
            .single();

        if (error) return fail(400, { error: error.message });
        redirect(303, `/collection?cid=${data.id}`);
    }
};
