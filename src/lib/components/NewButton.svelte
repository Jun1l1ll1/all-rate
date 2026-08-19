<script lang="ts">

    import { goto } from '$app/navigation';

    let { type = null } = $props();
    const validTypes = ['collection', 'item']
</script>


<button class="new-btn" onclick={() => {
    if (validTypes.includes(type)) goto(`/create/${type}`);
}}>
    {#if validTypes.includes(type)}
        +
    {:else}
        Invalid
    {/if}
</button>


<style>
    .new-btn {
        --offset: 30px;
        --size: 4rem;

        position: absolute;
        bottom: var(--offset);
        right: var(--offset);

        background-color: var(--g-primary-color);
        font-weight: bold;
        font-size: 2rem;
        padding: 10px;
        min-width: var(--size);
        min-height: var(--size);
    }
</style>
