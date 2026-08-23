<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    type ValidType = 'collection' | 'item';

    let { type = 'item', pathname = '/', collectionId }: { type: ValidType; pathname?: string; collectionId?: string } = $props();

    const destination = $derived(
        type === 'item' && collectionId
            ? `/update/item?cid=${encodeURIComponent(collectionId)}&from=${pathname}`
            : `/update/${type}?from=${pathname}`
    );
</script>

<button
    class="new-btn"
    type="button"
    onclick={() => goto(resolve(destination as `/update/item?${string}` | `/update/collection?${string}`))}
    >+</button
>

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
