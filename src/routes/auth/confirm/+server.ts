import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
    const tokenHash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');

    if (!tokenHash || type !== 'email') {
        redirect(303, '/auth');
    }

    const { error } = await locals.supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email'
    });

    if (error) redirect(303, '/auth');
    redirect(303, '/');
};
