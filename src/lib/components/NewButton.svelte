<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    type ValidType = 'collection' | 'item';

    let { type = 'item', collectionId }: { type: ValidType; collectionId?: string } = $props();

    const destination = $derived(
        type === 'item' && collectionId
            ? `/create/item?cid=${encodeURIComponent(collectionId)}`
            : `/create/${type}`
    );
</script>

<button
    class="new-btn"
    type="button"
    onclick={() => goto(resolve(destination as `/create/item?${string}` | '/create/collection'))}
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
