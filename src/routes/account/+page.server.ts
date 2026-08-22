import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    const { user } = await locals.safeGetSession();
    return { signedIn: Boolean(user), sent: url.searchParams.get('sent') === '1' };
};

export const actions: Actions = {
    signIn: async ({ locals, url }) => {

        const { data, error } = await locals.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${url.origin}/account/confirm`
            }
        });

        if (error) return fail(400, { error: error.message });
        
        if (data.url) redirect(303, data.url);
    },

    signOut: async ({ locals }) => {

        const { error } = await locals.supabase.auth.signOut()

        if (error) return fail(400, { error: error.message });
        
        redirect(303, '/account');
    }
};
