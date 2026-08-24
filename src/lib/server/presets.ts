import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/database.types';

export type CollectionsClient = SupabaseClient<Database>;

export async function listAllPresets(supabase: CollectionsClient) {

    const { data: presets, error: error } = await supabase
        .from('presets')
        .select('id, name, key, created_at, updated_at')
        .order('name', { ascending: true });

    if (error) throw error;

    return presets;
}

export async function getPreset(supabase: CollectionsClient, presetId: string) {
    const { data: preset, error } = await supabase
        .from('presets')
        .select('id, name, key, created_at, updated_at')
        .eq('id', presetId)
        .maybeSingle();

    if (error) throw error;

    return preset;
}
