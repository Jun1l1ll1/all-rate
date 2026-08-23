import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';

export type CollectionsClient = SupabaseClient<Database>;

export async function listUserCollections(supabase: CollectionsClient, user: User) {
    const [
        { data: collections, error: collectionsError },
        { data: favorites, error: favoritesError }
    ] = await Promise.all([
        supabase
            .from('collections')
            .select('id, title, description, is_public, created_at, updated_at, collection_color, pid')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
        supabase.from('collection_favorites').select('cid').eq('user_id', user.id)
    ]);

    if (collectionsError) throw collectionsError;
    if (favoritesError) throw favoritesError;

    const favoriteIds = new Set((favorites ?? []).map((favorite) => favorite.cid));

    return {
        collections: collections ?? [],
        favorites: (collections ?? []).filter((collection) => favoriteIds.has(collection.id))
    };
}

export async function getCollectionAndItems(supabase: CollectionsClient, collectionId: string) {
    const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .select('id, owner_id, title, description, is_public, created_at, updated_at, collection_color, pid')
        .eq('id', collectionId)
        .maybeSingle();

    if (collectionError) throw collectionError;
    if (!collection) return null;

    const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('id, cid, title, rating, comment, position, created_at, updated_at')
        .eq('cid', collectionId)
        .order('rating', { ascending: false })
        .order('title', { ascending: true });

    if (itemsError) throw itemsError;

    return { collection, items: items ?? [] };
}

export async function getCollection(supabase: CollectionsClient, collectionId: string) {
    const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .select('id, owner_id, title, description, is_public, created_at, updated_at, collection_color, pid')
        .eq('id', collectionId)
        .maybeSingle();

    if (collectionError) throw collectionError;

    return collection;
}
