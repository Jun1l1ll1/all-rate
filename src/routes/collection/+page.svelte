<script lang="ts">
    import { page } from '$app/state';
    import NewButton from '$lib/components/NewButton.svelte';

    const cid = $derived(page.url.searchParams.get('cid'));
</script>

{#if cid}

    <p>Entered collection {cid}</p>

    <NewButton type="item" />

{:else}
    <p>Invalid collection, go back and select a collection.</p>
{/if}
