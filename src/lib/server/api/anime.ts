export type AnimeSearchResult = {
    externalId: string;
    title: string;
    imageUrl: string | null;
    url: string | null;
};

type JikanAnime = {
    mal_id?: number;
    url?: unknown;
    title?: unknown;
    images?: {
        jpg?: {
            image_url?: unknown;
        };
    };
};

type JikanResponse = {
    data?: JikanAnime[];
};

const JIKAN_SEARCH_URL = 'https://api.jikan.moe/v4/anime';
const MAX_QUERY_LENGTH = 100;
const RESULT_LIMIT = 8;
const CACHE_TTL_MS = 60_000;
const searchCache = new Map<string, { expiresAt: number; results: AnimeSearchResult[] }>();

export function normalizeAnimeQuery(value: string | null): string {
    return (value ?? '').trim().replace(/\s+/g, ' ').slice(0, MAX_QUERY_LENGTH);
}

function mapAnime(value: unknown): AnimeSearchResult | null {
    if (!value || typeof value !== 'object') return null;

    const anime = value as JikanAnime;
    const externalId = anime.mal_id;
    if (typeof externalId !== 'number' || !Number.isInteger(externalId) || externalId <= 0 || typeof anime.title !== 'string') {
        return null;
    }

    return {
        externalId: String(externalId),
        title: anime.title.trim(),
        imageUrl: typeof anime.images?.jpg?.image_url === 'string' ? anime.images.jpg.image_url : null,
        url: typeof anime.url === 'string' ? anime.url : null
    };
}

export async function searchAnime(query: string, fetchFn: typeof fetch = fetch): Promise<AnimeSearchResult[]> {
    const normalizedQuery = normalizeAnimeQuery(query);
    if (normalizedQuery.length < 2) return [];

    const cached = searchCache.get(normalizedQuery.toLowerCase());
    if (cached && cached.expiresAt > Date.now()) return cached.results;

    const url = new URL(JIKAN_SEARCH_URL);
    url.searchParams.set('q', normalizedQuery);
    url.searchParams.set('limit', String(RESULT_LIMIT));
    url.searchParams.set('sfw', 'true');

    const response = await fetchFn(url, {
        headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
        throw new Error(`Anime provider returned ${response.status}.`);
    }

    const payload = (await response.json()) as JikanResponse;
    const results = Array.isArray(payload.data)
        ? payload.data.map(mapAnime).filter((anime): anime is AnimeSearchResult => anime !== null)
        : [];

    searchCache.set(normalizedQuery.toLowerCase(), {
        expiresAt: Date.now() + CACHE_TTL_MS,
        results
    });

    return results;
}