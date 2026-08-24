<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import type { Snippet } from 'svelte';

    type ValidType = 'collection' | 'item';
    type DestinationType = `/update/item?${string}` | `/update/collection?${string}`;

    let {
        children,
        type = 'item',
        pathname = '/',
        collectionId,
        usePopup = false
    }: {
        children?: Snippet;
        type: ValidType;
        pathname?: string;
        collectionId?: string;
        usePopup?: boolean;
    } = $props();

    const destination = $derived(
        type === 'item' && collectionId
            ? `/update/item?cid=${encodeURIComponent(collectionId)}&from=${pathname}`
            : `/update/${type}?from=${pathname}`
    );
</script>


<dialog id="new-button-popup" class="new-button-popup">
    {#if children}
        {@render children()}
    {/if}
</dialog>

<button
    class="new-btn"
    type="button"
    onclick={() => {
        if (usePopup) (document.getElementById('new-button-popup') as HTMLDialogElement).showModal();
        else goto(resolve(destination as DestinationType));
    }}>
    
    +
</button>


<style>
    .new-btn {
        --offset: 30px;
        --size: 4rem;

        position: absolute;
        bottom: var(--offset);
        right: var(--offset);
        z-index: 10;

        background-color: var(--g-primary-color);
        font-weight: bold;
        font-size: 2rem;
        padding: 10px;
        min-width: var(--size);
        min-height: var(--size);
    }
</style>
