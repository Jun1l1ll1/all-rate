<script lang="ts">

    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    type ValidType = 'collection' | 'item';

    let { type = 'item' }: { type: ValidType } = $props();

</script>


<button class="new-btn" onclick={() => goto(resolve(`/create/${type}`))}>+</button>


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
