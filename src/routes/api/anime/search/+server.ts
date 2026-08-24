import { json } from '@sveltejs/kit';
import { normalizeAnimeQuery, searchAnime } from '$lib/server/api/anime';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
    const query = normalizeAnimeQuery(url.searchParams.get('q'));
    if (query.length < 2) {
        return json({ error: 'Search must contain at least 2 characters.' }, { status: 400 });
    }

    try {
        return json({ results: await searchAnime(query, fetch) });
    } catch (searchError) {
        console.error('Anime search failed', searchError);
        return json({ error: 'Anime search is temporarily unavailable.' }, { status: 502 });
    }
};