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
                    collection_color: string;
                };
                Insert: {
                    id?: string;
                    owner_id?: string;
                    title: string;
                    description?: string | null;
                    is_public?: boolean;
                    created_at?: string;
                    updated_at?: string;
                    collection_color?: string;
                };
                Update: {
                    id?: string;
                    owner_id?: string;
                    title?: string;
                    description?: string | null;
                    is_public?: boolean;
                    updated_at?: string;
                    collection_color?: string;
                };
                Relationships: [];
            };
            items: {
                Row: {
                    id: string;
                    cid: string;
                    title: string;
                    rating: number;
                    comment: string | null;
                    position: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    cid: string;
                    title: string;
                    rating: number;
                    comment?: string | null;
                    position?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    cid?: string;
                    title?: string;
                    rating?: number;
                    comment?: string | null;
                    position?: number;
                    updated_at?: string;
                };
                Relationships: [];
            };
            collection_favorites: {
                Row: { user_id: string; cid: string; created_at: string };
                Insert: { user_id?: string; cid: string; created_at?: string };
                Update: { user_id?: string; cid?: string; created_at?: string };
                Relationships: [];
            };
        };
        Views: { [_ in never]: never };
        Functions: { [_ in never]: never };
        Enums: { [_ in never]: never };
        CompositeTypes: { [_ in never]: never };
    };
};
