create table public.collections (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    title text not null check (char_length(trim(title)) between 1 and 120),
    description text check (description is null or char_length(description) <= 2000),
    is_public boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table public.items (
    id uuid primary key default gen_random_uuid(),
    cid uuid not null references public.collections(id) on delete cascade,
    title text not null check (char_length(trim(title)) between 1 and 200),
    rating numeric(3, 1) not null check (rating between 0 and 10),
    comment text check (comment is null or char_length(comment) <= 5000),
    position integer not null default 0 check (position >= 0),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table public.collection_favorites (
    user_id uuid not null references auth.users(id) on delete cascade,
    cid uuid not null references public.collections(id) on delete cascade,
    created_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, cid)
);

create index collections_owner_id_idx on public.collections(owner_id);
create index collections_public_idx on public.collections(is_public) where is_public = true;
create index items_collection_position_idx on public.items(cid, position, created_at);
create index collection_favorites_user_id_idx on public.collection_favorites(user_id);

alter table public.collections enable row level security;
alter table public.items enable row level security;
alter table public.collection_favorites enable row level security;

create policy "Owners can read their collections"
on public.collections for select
using (owner_id = (select auth.uid()) or is_public = true);

create policy "Owners can create collections"
on public.collections for insert
with check (owner_id = (select auth.uid()));

create policy "Owners can update collections"
on public.collections for update
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "Owners can delete collections"
on public.collections for delete
using (owner_id = (select auth.uid()));

create policy "Users can read visible items"
on public.items for select
using (
    exists (
        select 1 from public.collections
        where collections.id = items.cid
        and (collections.owner_id = (select auth.uid()) or collections.is_public = true)
    )
);

create policy "Collection owners can create items"
on public.items for insert
with check (
    exists (
        select 1 from public.collections
        where collections.id = items.cid
        and collections.owner_id = (select auth.uid())
    )
);

create policy "Collection owners can update items"
on public.items for update
using (
    exists (
        select 1 from public.collections
        where collections.id = items.cid
        and collections.owner_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1 from public.collections
        where collections.id = items.cid
        and collections.owner_id = (select auth.uid())
    )
);

create policy "Collection owners can delete items"
on public.items for delete
using (
    exists (
        select 1 from public.collections
        where collections.id = items.cid
        and collections.owner_id = (select auth.uid())
    )
);

create policy "Users can read their favorites"
on public.collection_favorites for select
using (user_id = (select auth.uid()));

create policy "Users can create their favorites"
on public.collection_favorites for insert
with check (
    user_id = (select auth.uid())
    and exists (
        select 1 from public.collections
        where collections.id = collection_favorites.cid
        and (collections.owner_id = (select auth.uid()) or collections.is_public = true)
    )
);

create policy "Users can delete their favorites"
on public.collection_favorites for delete
using (user_id = (select auth.uid()));