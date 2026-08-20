export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            collections: {
                Row: {
                    id: string;
                    owner_id: string;
                    title: string;
                    description: string | null;
                    is_public: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    owner_id?: string;
                    title: string;
                    description?: string | null;
                    is_public?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    owner_id?: string;
                    title?: string;
                    description?: string | null;
                    is_public?: boolean;
                    updated_at?: string;
                };
                Relationships: [];
            };
            items: {
                Row: {
                    id: string;
                    collection_id: string;
                    title: string;
                    rating: number;
                    comment: string | null;
                    position: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    collection_id: string;
                    title: string;
                    rating: number;
                    comment?: string | null;
                    position?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    collection_id?: string;
                    title?: string;
                    rating?: number;
                    comment?: string | null;
                    position?: number;
                    updated_at?: string;
                };
                Relationships: [];
            };
            collection_favorites: {
                Row: { user_id: string; collection_id: string; created_at: string };
                Insert: { user_id?: string; collection_id: string; created_at?: string };
                Update: { user_id?: string; collection_id?: string; created_at?: string };
                Relationships: [];
            };
        };
        Views: { [_ in never]: never };
        Functions: { [_ in never]: never };
        Enums: { [_ in never]: never };
        CompositeTypes: { [_ in never]: never };
    };
};
