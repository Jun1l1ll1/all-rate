import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';

export type CollectionsClient = SupabaseClient<Database>;

export async function listAllPresets(supabase: CollectionsClient) {

    const { data: presets, error: error } = await supabase
        .from('presets')
        .select('id, name, created_at, updated_at')
        .order('name', { ascending: true });

    if (error) throw error;

    return presets;
}
