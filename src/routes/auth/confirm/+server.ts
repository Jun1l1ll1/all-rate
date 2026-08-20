import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
    const code = url.searchParams.get('code');

    if (!code) redirect(303, '/auth');

    const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

    if (error) redirect(303, '/auth');

    redirect(303, '/');
};
