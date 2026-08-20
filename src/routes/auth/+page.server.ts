import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    const { user } = await locals.safeGetSession();
    return { signedIn: Boolean(user), sent: url.searchParams.get('sent') === '1' };
};

export const actions: Actions = {
    default: async ({ locals, request, url }) => {
        const formData = await request.formData();
        const email = formData.get('email');

        if (typeof email !== 'string' || !email.trim() || !email.includes('@')) {
            return fail(400, { error: 'Enter a valid email address.' });
        }

        const { error } = await locals.supabase.auth.signInWithOtp({
            email: email.trim(),
            options: { emailRedirectTo: `${url.origin}/auth/confirm` }
        });

        if (error) return fail(400, { error: error.message });
        redirect(303, '/auth?sent=1');
    }
};
