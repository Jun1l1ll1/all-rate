import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';

export type CollectionsClient = SupabaseClient<Database>;

export async function getItem(supabase: CollectionsClient, itemId: string) {
    const { data: items, error: error } = await supabase
        .from('items')
        .select('id, cid, title, rating, comment, position, external_id, created_at, updated_at')
        .eq('id', itemId)
        .maybeSingle();

    if (error) throw error;

    return items;
}